import { BLOG_CONFIG } from '$lib/constants/blog';
import { getPosts } from '$lib/server/posts';
import { buildAbsoluteUrl, escapeXml } from '$lib/utils/xml';

export const GET = async () => {
    const posts = await getPosts();
    const siteUrl = BLOG_CONFIG.url;

    const body = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
  <loc>${escapeXml(siteUrl)}</loc>
  <changefreq>daily</changefreq>
  <priority>1.0</priority>
</url>
<url>
  <loc>${escapeXml(buildAbsoluteUrl('/posts', siteUrl))}</loc>
  <changefreq>daily</changefreq>
  <priority>0.8</priority>
</url>
${posts
    .map((post) => {
        const loc = buildAbsoluteUrl(`/posts/${encodeURIComponent(post.slug)}`, siteUrl);
        const lastmod = new Date(post.updated || post.date).toISOString();
        return `\n<url>\n  <loc>${escapeXml(loc)}</loc>\n  <changefreq>weekly</changefreq>\n  <lastmod>${escapeXml(lastmod)}</lastmod>\n  <priority>0.6</priority>\n</url>`;
    })
    .join('')}
</urlset>`;

    return new Response(body, {
        headers: {
            'Cache-Control': 'max-age=0, s-maxage=3600',
            'Content-Type': 'application/xml'
        }
    });
};
