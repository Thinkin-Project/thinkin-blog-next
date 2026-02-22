import { dev } from '$app/environment';

import type { ArticleMeta } from '$lib/types';

let cachedPosts: ArticleMeta[] | null = null;

export async function getPosts() {
    if (cachedPosts && !dev) {
        return cachedPosts;
    }

    let posts: ArticleMeta[] = [];
    // non-eager glob: returns loader functions we call when needed
    const paths = import.meta.glob('/src/posts/*/index.md');
    // images as URL loaders (non-eager)
    const images = import.meta.glob('/src/posts/**/*.{jpg,jpeg,png,webp,svg,gif}', {
        query: '?url',
        import: 'default'
    });

    // load post modules and resolve their images in parallel per-post
    const entries = Object.entries(paths) as [string, () => Promise<unknown>][];

    const perPostPromises = entries.map(async ([path, loader]) => {
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

            // resolve ogImage URL if it's a relative path (do this per-post)
            let ogImage = metadata.ogImage;
            if (ogImage && ogImage.startsWith('.')) {
                const normalizedPath = ogImage.startsWith('./') ? ogImage.slice(2) : ogImage;
                const fullPath = `/src/posts/${slug}/${normalizedPath}`;
                const imgLoader = images[fullPath] as (() => Promise<unknown>) | undefined;
                if (imgLoader) {
                    try {
                        const img = await imgLoader();
                        ogImage = img as string;
                    } catch (e) {
                        return { path, error: e };
                    }
                }
            }

            const post = { ...metadata, ogImage, slug } as ArticleMeta;
            return { path, post };
        } catch (e) {
            return { path, error: e };
        }
    });

    const results = await Promise.all(perPostPromises);

    for (const result of results) {
        if ('error' in result) {
            console.warn(`Failed to process post ${result.path}:`, result.error);
            continue;
        }

        const post = result.post as ArticleMeta | undefined;
        if (post && !post.drafted) {
            posts.push(post);
        }
    }

    posts = posts.sort(
        (first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
    );

    cachedPosts = posts;
    return posts;
}

export async function getAdjacentPosts(currentSlug: string) {
    const posts = await getPosts();
    const index = posts.findIndex((p) => p.slug === currentSlug);

    return {
        next: index > 0 ? posts[index - 1] : null, // Newer post
        prev: index < posts.length - 1 ? posts[index + 1] : null // Older post
    };
}

function validateMetadata(metadata: ArticleMeta) {
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
