import { BLOG_CONFIG } from '$lib/constants/blog';
import { getPosts } from '$lib/server/posts';

export const GET = async () => {
    const posts = await getPosts();
    const siteUrl = BLOG_CONFIG.url;
    const siteTitle = BLOG_CONFIG.name;
    const siteDescription = BLOG_CONFIG.description;

    const escapeXml = (str: string) =>
        str.replace(
            /[&<>"']/g,
            (m) =>
                ({
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&apos;'
                })[m] || m
        );

    const body = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2007/atom">
<channel>
<title>${escapeXml(siteTitle)}</title>
<description>${escapeXml(siteDescription)}</description>
<link>${siteUrl}</link>
<atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${posts
    .map(
        (post) => `
<item>
<title>${escapeXml(post.title)}</title>
<description>${escapeXml(post.description)}</description>
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
