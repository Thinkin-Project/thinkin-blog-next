import { BLOG_CONFIG } from '$lib/constants/blog';
import { getPosts } from '$lib/server/posts';
import { buildAbsoluteUrl, escapeXml } from '$lib/utils/xml';

export const GET = async () => {
    const posts = await getPosts();
    const siteUrl = BLOG_CONFIG.url;
    const siteTitle = BLOG_CONFIG.name;
    const siteDescription = BLOG_CONFIG.description;

    const body = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2007/atom">
<channel>
<title>${escapeXml(siteTitle)}</title>
<description>${escapeXml(siteDescription)}</description>
<link>${escapeXml(siteUrl)}</link>
<atom:link href="${escapeXml(buildAbsoluteUrl('/rss.xml', siteUrl))}" rel="self" type="application/rss+xml"/>
${posts
    .map(
        (post) => `
<item>
<title>${escapeXml(post.title)}</title>
<description>${escapeXml(post.description)}</description>
<link>${escapeXml(buildAbsoluteUrl(`/posts/${encodeURIComponent(post.slug)}`, siteUrl))}</link>
<guid isPermaLink="true">${escapeXml(buildAbsoluteUrl(`/posts/${encodeURIComponent(post.slug)}`, siteUrl))}</guid>
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
