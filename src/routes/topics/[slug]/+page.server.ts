import { error } from '@sveltejs/kit';

import { BLOG_CONFIG } from '$lib/constants/blog';
import { TOPICS } from '$lib/constants/topics';
import { getPosts } from '$lib/server/posts';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
    const currentTopic = TOPICS.find((t) => t.slug === params.slug);
    if (!currentTopic) {
        error(404, `Could not find topic ${params.slug}`);
    }

    const allPosts = await getPosts();

    // Filter posts by topic matching the slug
    const filteredPosts = allPosts.filter((post) => {
        return post.topic === params.slug;
    });

    const pageStr = url.searchParams.get('page');
    let currentPage = pageStr ? parseInt(pageStr) : 1;
    if (isNaN(currentPage)) currentPage = 1;

    const pageSize = BLOG_CONFIG.postsPerPage;
    const totalPosts = filteredPosts.length;
    const totalPages = Math.ceil(totalPosts / pageSize);

    // 確保頁碼在有效範圍內
    const validPage = Math.max(1, Math.min(currentPage, totalPages || 1));

    const start = (validPage - 1) * pageSize;
    const end = start + pageSize;
    const posts = filteredPosts.slice(start, end);

    return {
        posts,
        pagination: {
            currentPage: validPage,
            totalPages,
            totalPosts
        },
        meta: {
            title: currentTopic.name
        }
    };
};
