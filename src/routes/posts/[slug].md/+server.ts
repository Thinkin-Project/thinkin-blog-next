import { error } from '@sveltejs/kit';

import { getPosts, getRawPost } from '$lib/server/posts';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
    const rawContent = await getRawPost(params.slug);
    if (!rawContent) {
        error(404, `Could not find ${params.slug}`);
    }

    const post = (await getPosts()).find((item) => item.slug === params.slug && !item.drafted);
    if (!post) {
        error(404, `Could not find ${params.slug}`);
    }

    return new Response(rawContent, {
        headers: {
            'Content-Type': 'text/plain'
        }
    });
};
