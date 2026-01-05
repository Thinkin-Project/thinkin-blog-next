import { BLOG_CONFIG } from '$lib/constants/blog';
import { getPosts } from '$lib/server/posts';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const allPosts = await getPosts();

    // Latest posts
    const newPosts = allPosts.slice(0, BLOG_CONFIG.newPostsLimit);

    return {
        newPosts
    };
};
