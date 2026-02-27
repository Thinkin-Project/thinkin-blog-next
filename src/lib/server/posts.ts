import { dev } from '$app/environment';

import type { ArticleMeta } from '$lib/types';

let cachedPosts: ArticleMeta[] | null = null;

type PostLoader = () => Promise<unknown>;
type ImageLoaderMap = Record<string, PostLoader>;
type RawPostLoaderMap = Record<string, () => Promise<string>>;
export type ProcessPostEntryResult =
    | { path: string; post: ArticleMeta }
    | { path: string; error: unknown };

export async function getPosts() {
    if (cachedPosts && !dev) {
        return cachedPosts;
    }

    // non-eager glob: returns loader functions we call when needed
    const paths = import.meta.glob('/src/posts/*/index.md');
    // images as URL loaders (non-eager)
    const images = import.meta.glob('/src/posts/**/*.{jpg,jpeg,png,webp,svg,gif}', {
        query: '?url',
        import: 'default'
    });

    // load post modules and resolve their images in parallel per-post
    const entries = Object.entries(paths) as [string, () => Promise<unknown>][];

    const perPostPromises = entries.map(([path, loader]) =>
        processPostEntry(path, loader, images as ImageLoaderMap)
    );

    const results = await Promise.all(perPostPromises);
    let posts = collectValidPosts(results);
    posts = finalizePosts(posts);

    cachedPosts = posts;
    return posts;
}

export async function processPostEntry(
    path: string,
    loader: PostLoader,
    images: ImageLoaderMap
): Promise<ProcessPostEntryResult> {
    try {
        const file = await loader();
        const slug = path.split('/').at(-2);

        if (!file || typeof file !== 'object' || !('metadata' in file) || !slug) {
            return { path, error: new Error('invalid markdown') };
        }

        const metadata = file.metadata as ArticleMeta;

        const { ok, errors } = validateMetadata(metadata);
        if (!ok) {
            return { path, error: new Error(errors.join('; ')) };
        }

        let ogImage = metadata.ogImage;
        if (ogImage && ogImage.startsWith('.')) {
            const normalizedPath = ogImage.startsWith('./') ? ogImage.slice(2) : ogImage;
            const fullPath = `/src/posts/${slug}/${normalizedPath}`;
            const imageLoader = images[fullPath];
            if (imageLoader) {
                try {
                    const image = await imageLoader();
                    ogImage = image as string;
                } catch (error) {
                    return { path, error };
                }
            }
        }

        const post = { ...metadata, ogImage, slug } as ArticleMeta;
        return { path, post };
    } catch (error) {
        return { path, error };
    }
}

export function validateMetadata(metadata: ArticleMeta) {
    const errors: string[] = [];

    if (!metadata.title || !metadata.description) {
        errors.push('missing title or description');
    }
    if (!metadata.slug) {
        errors.push('missing slug');
    } else {
        if (typeof metadata.slug !== 'string') {
            errors.push('slug must be a string');
        } else if (!/^[a-z0-9-]+$/.test(metadata.slug)) {
            errors.push(`invalid slug format: ${metadata.slug}`);
        }
    }
    if (metadata.date && isNaN(new Date(metadata.date).getTime())) {
        errors.push(`invalid date format: ${metadata.date}`);
    }
    if (!Array.isArray(metadata.authors) || metadata.authors.length === 0) {
        errors.push('missing authors');
    }

    return { ok: errors.length === 0, errors };
}

export function collectValidPosts(results: ProcessPostEntryResult[]) {
    const posts: ArticleMeta[] = [];

    for (const result of results) {
        if ('error' in result) {
            console.warn(`Failed to process post ${result.path}:`, result.error);
            continue;
        }

        posts.push(result.post);
    }

    return posts;
}

export function finalizePosts(posts: ArticleMeta[]) {
    return posts
        .filter((post) => !post.drafted)
        .sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime());
}

export async function getAdjacentPosts(currentSlug: string) {
    const posts = await getPosts();
    return calculateAdjacentPosts(posts, currentSlug);
}

export function getRawPostLoaders() {
    return import.meta.glob('/src/posts/*/index.md', {
        query: '?raw',
        import: 'default'
    }) as RawPostLoaderMap;
}

export async function getRawPost(slug: string) {
    const loader = getRawPostLoaders()[`/src/posts/${slug}/index.md`];
    if (!loader) {
        return null;
    }

    return loader();
}

export function calculateAdjacentPosts(posts: ArticleMeta[], currentSlug: string) {
    const index = posts.findIndex((p) => p.slug === currentSlug);

    if (index === -1) {
        return {
            next: null,
            prev: null
        };
    }

    return {
        next: index > 0 ? posts[index - 1] : null, // Newer post
        prev: index < posts.length - 1 ? posts[index + 1] : null // Older post
    };
}
