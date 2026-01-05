import { getPosts } from '$lib/server/posts';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const allPosts = await getPosts();

    // Filter posts by topic matching the slug
    const posts = allPosts.filter((post) => {
        return post.topic === params.slug;
    });

    return {
        posts
    };
};
