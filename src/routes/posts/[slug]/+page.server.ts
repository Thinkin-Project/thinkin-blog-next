import { BLOG_CONFIG } from '$lib/constants/blog';
import { getAdjacentPosts } from '$lib/server/posts';
import { findRelatedPosts } from '$lib/server/webmcp';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const { prev, next } = await getAdjacentPosts(params.slug);
    const relatedResult = await findRelatedPosts({
        slug: params.slug,
        limit: BLOG_CONFIG.relatedPostsLimit
    });

    return {
        prev,
        next,
        relatedPosts: relatedResult?.results ?? []
    };
};
