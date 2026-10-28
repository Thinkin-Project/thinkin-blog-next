import { getTagName } from '#lib/constants/tags.js';
import { getTopicName } from '#lib/constants/topics.js';
import { getPosts } from '#lib/server/posts.js';
import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    const posts = await getPosts();

    // 唯讀需要的欄位以減少傳輸量
    const searchIndex = posts.map((post) => ({
        title: post.title,
        description: post.description,
        slug: post.slug,
        topic: getTopicName(post.topic),
        tags: post.tags.map(getTagName),
        date: post.date
    }));

    return json(searchIndex);
};
