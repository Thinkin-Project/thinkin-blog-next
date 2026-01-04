import type { ArticleMeta } from '$lib/types';

export async function getPosts() {
    let posts: ArticleMeta[] = [];

    const paths = import.meta.glob('/src/posts/*.md', { eager: true });

    for (const path in paths) {
        const file = paths[path];
        const slug = path.split('/').at(-1)?.replace('.md', '');

        if (file && typeof file === 'object' && 'metadata' in file && slug) {
            const metadata = file.metadata as Omit<ArticleMeta, 'slug'>;
            const post = { ...metadata, slug } as ArticleMeta;
            if (!post.drafted) {
                posts.push(post);
            }
        }
    }

    posts = posts.sort(
        (first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
    );

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
