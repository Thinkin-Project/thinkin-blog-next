import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, data }) => {
    try {
        const post = await import(`../../../posts/${params.slug}.md`);

        return {
            content: post.default,
            meta: post.metadata,
            ...data
        };
    } catch {
        error(404, `Could not find ${params.slug}`);
    }
};
