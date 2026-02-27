import { getPosts, getRawPost } from '$lib/server/posts';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    const posts = await getPosts();
    const publishedPosts = posts.filter((post) => !post.drafted);
    const parts = await Promise.all(
        publishedPosts.map(async (post) => {
            const rawContent = await getRawPost(post.slug);
            if (!rawContent) {
                console.warn(`Missing raw markdown for published post: ${post.slug}`);
                return null;
            }

            return rawContent;
        })
    );

    return new Response(parts.filter(Boolean).join('\n\n'), {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'max-age=0, s-maxage=3600'
        }
    });
};
