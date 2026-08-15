import { TAGS } from '$lib/constants/tags';
import { getPosts } from '$lib/server/posts';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const allPosts = await getPosts();

    const tags = TAGS.map((tag) => ({
        ...tag,
        postCount: allPosts.filter((post) => post.tags.includes(tag.slug)).length
    })).sort((first, second) => second.postCount - first.postCount);

    return {
        tags,
        meta: {
            title: '標籤'
        }
    };
};
