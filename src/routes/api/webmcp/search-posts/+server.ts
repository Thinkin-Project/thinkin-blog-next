import { json } from '@sveltejs/kit';

import { searchPosts } from '$lib/server/webmcp';

import type { RequestHandler } from './$types';

function parseLimit(value: string | null): number | undefined {
    if (!value) {
        return undefined;
    }

    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
}

export const GET: RequestHandler = async ({ url }) => {
    const result = await searchPosts({
        query: url.searchParams.get('query') ?? undefined,
        topic: url.searchParams.get('topic') ?? undefined,
        tag: url.searchParams.get('tag') ?? undefined,
        limit: parseLimit(url.searchParams.get('limit'))
    });

    return json(result);
};
