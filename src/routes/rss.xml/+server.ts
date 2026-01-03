import { getPosts } from '$lib/server/posts';

export const GET = async () => {
    const posts = await getPosts();
    const siteUrl = 'https://thinkin-blog.pages.dev'; // 這裡應根據實際部署調整
    const siteTitle = 'Thinkin Blog';
    const siteDescription = 'A blog about thoughts, design, and engineering.';

    const body = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2007/atom">
<channel>
<title>${siteTitle}</title>
<description>${siteDescription}</description>
<link>${siteUrl}</link>
<atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${posts
    .map(
        (post) => `
<item>
<title>${post.title}</title>
<description>${post.description}</description>
<link>${siteUrl}/posts/${post.slug}</link>
<guid isPermaLink="true">${siteUrl}/posts/${post.slug}</guid>
<pubDate>${new Date(post.date).toUTCString()}</pubDate>
</item>`
    )
    .join('')}
</channel>
</rss>`;

    return new Response(body, {
        headers: {
            'Cache-Control': 'max-age=0, s-maxage=3600',
            'Content-Type': 'application/xml'
        }
    });
};
