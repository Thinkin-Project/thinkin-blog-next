import { BLOG_CONFIG } from '$lib/constants/blog';
import { getPosts } from '$lib/server/posts';

export const GET = async () => {
    const posts = await getPosts();
    const siteUrl = BLOG_CONFIG.url;

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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
  <loc>${escapeXml(siteUrl)}</loc>
  <changefreq>daily</changefreq>
  <priority>1.0</priority>
</url>
<url>
  <loc>${escapeXml(siteUrl)}/posts</loc>
  <changefreq>daily</changefreq>
  <priority>0.8</priority>
</url>
${posts
    .map(
        (post) => `
<url>
  <loc>${escapeXml(siteUrl)}/posts/${escapeXml(post.slug)}</loc>
  <changefreq>weekly</changefreq>
  <lastmod>${escapeXml(post.updated || post.date)}</lastmod>
  <priority>0.6</priority>
</url>`
    )
    .join('')}
</urlset>`;

    return new Response(body, {
        headers: {
            'Cache-Control': 'max-age=0, s-maxage=3600',
            'Content-Type': 'application/xml'
        }
    });
};
