import { BLOG_CONFIG } from '$lib/constants/blog';
import { getPosts } from '$lib/server/posts';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    const posts = await getPosts();
    const articleLines = posts
        .filter((post) => !post.drafted)
        .map(
            (post) =>
                `- [${post.title}](${BLOG_CONFIG.url}/posts/${encodeURIComponent(post.slug)}.md): ${post.description}`
        )
        .join('\n');
    const body = `# ${BLOG_CONFIG.name}\n\n## WebMCP\n\nThese tools provide structured, read-only access to published blog content.\n\nWhen WebMCP is available, compatible AI agents can access the following tools:\n\n- \`search_posts(query?, topic?, tag?, limit?)\`: Search published posts using a natural language query, topic slug, or tag slug. When no filters are provided, this tool returns the most recently published posts.\n- \`get_post(slug)\`: Retrieve a published post as structured data, including metadata, canonical URL, and markdown content.\n- \`find_related_posts(slug, limit?)\`: Retrieve related published posts for a given post slug, prioritizing shared topics and tags.\n\n## Articles\n\n${articleLines}`;

    return new Response(body, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'max-age=0, s-maxage=3600'
        }
    });
};
