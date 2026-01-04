import { getAdjacentPosts } from '$lib/server/posts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const { prev, next } = await getAdjacentPosts(params.slug);

    return {
        prev,
        next
    };
};
