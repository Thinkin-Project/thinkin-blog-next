import { BLOG_CONFIG } from '$lib/constants/blog';
import { getPosts } from '$lib/server/posts';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    const posts = await getPosts();
    const body = `# ${BLOG_CONFIG.name}\n\n## Articles\n\n${posts
        .filter((post) => !post.drafted)
        .map(
            (post) =>
                `- [${post.title}](${BLOG_CONFIG.url}/posts/${encodeURIComponent(post.slug)}.md): ${post.description}`
        )
        .join('\n')}`;

    return new Response(body, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'max-age=0, s-maxage=3600'
        }
    });
};
