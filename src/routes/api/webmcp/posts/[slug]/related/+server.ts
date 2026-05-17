import { error, json } from '@sveltejs/kit';

import { findRelatedPosts } from '$lib/server/webmcp';

import type { RequestHandler } from './$types';

function parseLimit(value: string | null): number | undefined {
    if (!value) {
        return undefined;
    }

    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
}

export const GET: RequestHandler = async ({ params, url }) => {
    const result = await findRelatedPosts({
        slug: params.slug,
        limit: parseLimit(url.searchParams.get('limit'))
    });

    if (!result) {
        error(404, `Could not find ${params.slug}`);
    }

    return json(result);
};
