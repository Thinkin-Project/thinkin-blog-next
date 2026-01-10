import { BLOG_CONFIG } from '$lib/constants/blog';
import { getPosts } from '$lib/server/posts';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    const allPosts = await getPosts();
    const pageStr = url.searchParams.get('page');
    let currentPage = pageStr ? parseInt(pageStr) : 1;
    if (isNaN(currentPage)) currentPage = 1;

    const pageSize = BLOG_CONFIG.postsPerPage;

    const totalPosts = allPosts.length;
    const totalPages = Math.ceil(totalPosts / pageSize);

    // 確保頁碼在有效範圍內
    const validPage = Math.max(1, Math.min(currentPage, totalPages || 1));

    const start = (validPage - 1) * pageSize;
    const end = start + pageSize;
    const posts = allPosts.slice(start, end);

    return {
        posts,
        pagination: {
            currentPage: validPage,
            totalPages,
            totalPosts
        }
    };
};
