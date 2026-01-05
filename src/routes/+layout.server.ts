import { BLOG_CONFIG } from '$lib/constants/blog';
import { getPosts } from '$lib/server/posts';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
    const allPosts = await getPosts();
    const featuredPosts = allPosts
        .filter((post) => post.featured)
        .slice(0, BLOG_CONFIG.featuredPostsLimit);

    return {
        featuredPosts
    };
};
