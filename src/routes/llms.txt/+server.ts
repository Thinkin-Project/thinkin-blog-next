import { getPosts } from '$lib/server/posts';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    const posts = await getPosts();
    const body = posts
        .filter((post) => !post.drafted)
        .map(
            (post) =>
                `[${post.title}](/posts/${encodeURIComponent(post.slug)}.md): ${post.description}`
        )
        .join('\n');

    return new Response(body, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8'
        }
    });
};
