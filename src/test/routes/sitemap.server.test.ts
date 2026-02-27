import { describe, expect, it, vi } from 'vitest';

import { GET } from '../../routes/sitemap.xml/+server';

vi.mock('$lib/utils/xml', async () => {
    const actual = await import('../../lib/utils/xml');
    return actual;
});

vi.mock('$lib/constants/blog', () => ({
    BLOG_CONFIG: {
        url: 'https://example.com'
    }
}));

vi.mock('$lib/server/posts', () => ({
    getPosts: vi.fn(async () => [
        {
            title: 'Post A',
            description: 'A',
            slug: 'post-a',
            date: '2026-01-01',
            updated: '2026-02-03',
            drafted: false,
            featured: false,
            topic: 'dotnet',
            tags: [],
            authors: ['neil']
        },
        {
            title: 'Post B',
            description: 'B',
            slug: 'post with space',
            date: '2026-01-10',
            drafted: false,
            featured: false,
            topic: 'dotnet',
            tags: [],
            authors: ['neil']
        }
    ])
}));

describe('sitemap.xml GET', () => {
    it('returns sitemap xml with static and post urls', async () => {
        const response = await GET();
        const body = await response.text();

        expect(response.headers.get('Content-Type')).toBe('application/xml; charset=utf-8');
        expect(response.headers.get('Cache-Control')).toBe('max-age=0, s-maxage=3600');
        expect(body).toContain('<urlset');
        expect(body).toContain('<loc>https://example.com</loc>');
        expect(body).toContain('<loc>https://example.com/posts</loc>');
        expect(body).toContain('/posts/post-a');
        expect(body).toContain('/posts/post%20with%20space');
        expect(body).toContain('<lastmod>2026-02-03T00:00:00.000Z</lastmod>');
        expect(body).toContain('<lastmod>2026-01-10T00:00:00.000Z</lastmod>');
    });
});
