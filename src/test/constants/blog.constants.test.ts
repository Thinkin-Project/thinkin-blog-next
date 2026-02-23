import { describe, expect, it, vi } from 'vitest';

type PublicEnv = Record<string, string | undefined>;

async function loadBlogConfig(envOverrides: PublicEnv) {
    vi.resetModules();
    vi.doMock('$env/dynamic/public', () => ({
        env: envOverrides
    }));

    return import('../../lib/constants/blog');
}

describe('BLOG_CONFIG', () => {
    it('uses fallback defaults when public env is missing', async () => {
        const { BLOG_CONFIG } = await loadBlogConfig({});

        expect(BLOG_CONFIG.name).toBe('Thinkin Markdown');
        expect(BLOG_CONFIG.url).toBe('https://www.thinkinmd.com');
        expect(BLOG_CONFIG.author).toBe('Neil Tsai');
        expect(BLOG_CONFIG.lang).toBe('zh-Hant');
        expect(BLOG_CONFIG.featuredPostsLimit).toBe(3);
        expect(BLOG_CONFIG.newPostsLimit).toBe(10);
        expect(BLOG_CONFIG.postsPerPage).toBe(10);
    });

    it('parses numeric env values and falls back when invalid', async () => {
        const { BLOG_CONFIG } = await loadBlogConfig({
            PUBLIC_FEATURED_POSTS_LIMIT: '5',
            PUBLIC_NEW_POSTS_LIMIT: 'abc',
            PUBLIC_POSTS_PER_PAGE: '12'
        });

        expect(BLOG_CONFIG.featuredPostsLimit).toBe(5);
        expect(BLOG_CONFIG.newPostsLimit).toBe(10);
        expect(BLOG_CONFIG.postsPerPage).toBe(12);
    });
});
