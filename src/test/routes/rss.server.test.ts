import { describe, expect, it, vi } from 'vitest';

import { GET } from '../../routes/rss.xml/+server';

vi.mock('$lib/utils/xml', async () => {
    const actual = await import('../../lib/utils/xml');
    return actual;
});

vi.mock('$lib/constants/blog', () => ({
    BLOG_CONFIG: {
        url: 'https://example.com',
        name: 'Site & Name',
        description: 'Desc <Value>'
    }
}));

vi.mock('$lib/server/posts', () => ({
    getPosts: vi.fn(async () => [
        {
            title: 'Title <1>',
            description: 'Desc & 1',
            slug: 'post with space',
            date: '2026-01-01',
            drafted: false,
            featured: false,
            topic: 'dotnet',
            tags: ['a'],
            authors: ['neil']
        }
    ])
}));

describe('rss.xml GET', () => {
    it('returns xml response with escaped metadata and post links', async () => {
        const response = await GET();
        const body = await response.text();

        expect(response.headers.get('Content-Type')).toBe('application/xml');
        expect(response.headers.get('Cache-Control')).toBe('max-age=0, s-maxage=3600');
        expect(body).toContain('<rss version="2.0"');
        expect(body).toContain('<title>Site &amp; Name</title>');
        expect(body).toContain('<description>Desc &lt;Value&gt;</description>');
        expect(body).toContain('/posts/post%20with%20space');
        expect(body).toContain('Title &lt;1&gt;');
        expect(body).toContain('Desc &amp; 1');
    });
});
