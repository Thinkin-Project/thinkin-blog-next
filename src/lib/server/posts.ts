import { dev } from '$app/environment';

import type { ArticleMeta } from '$lib/types';

let cachedPosts: ArticleMeta[] | null = null;

export async function getPosts() {
    if (cachedPosts && !dev) {
        return cachedPosts;
    }

    let posts: ArticleMeta[] = [];

    const paths = import.meta.glob('/src/posts/*/index.md', { eager: true });
    // 取得所有文章圖片的 URL 映射
    const images = import.meta.glob('/src/posts/**/*.{jpg,jpeg,png,webp,svg,gif}', {
        query: '?url',
        import: 'default',
        eager: true
    });

    for (const path in paths) {
        const file = paths[path];
        // 路徑格式如 /src/posts/my-post/index.md, slug 是倒數第二層
        const slug = path.split('/').at(-2);

        if (file && typeof file === 'object' && 'metadata' in file && slug) {
            const metadata = file.metadata as Omit<ArticleMeta, 'slug'>;

            // 解析 ogImage 路徑
            let ogImage = metadata.ogImage;
            if (ogImage && ogImage.startsWith('.')) {
                const normalizedPath = ogImage.startsWith('./') ? ogImage.slice(2) : ogImage;
                const fullPath = `/src/posts/${slug}/${normalizedPath}`;
                if (images[fullPath]) {
                    ogImage = images[fullPath] as string;
                }
            }

            const post = { ...metadata, ogImage, slug } as ArticleMeta;
            if (!post.drafted) {
                posts.push(post);
            }
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
