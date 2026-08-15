import { TOPICS } from '$lib/constants/topics';
import { getPosts } from '$lib/server/posts';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const allPosts = await getPosts();

    const topics = TOPICS.map((topic) => ({
        ...topic,
        postCount: allPosts.filter((post) => post.topic === topic.slug).length
    })).sort((first, second) => second.postCount - first.postCount);

    return {
        topics,
        meta: {
            title: '主題'
        }
    };
};
