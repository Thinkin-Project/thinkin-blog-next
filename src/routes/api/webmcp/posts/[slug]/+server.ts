import { error, json } from '@sveltejs/kit';

import { getPost } from '#lib/server/webmcp.js';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
    const post = await getPost(params.slug);
    if (!post) {
        error(404, `Could not find ${params.slug}`);
    }

    return json(post);
};
