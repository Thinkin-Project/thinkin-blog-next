import { describe, expect, it, vi } from 'vitest';

type PublicEnv = Record<string, string | undefined>;

const defaultPublicEnv: PublicEnv = {
    PUBLIC_BLOG_NAME: undefined,
    PUBLIC_BLOG_DESCRIPTION: undefined,
    PUBLIC_BLOG_URL: undefined,
    PUBLIC_BLOG_AUTHOR: undefined,
    PUBLIC_BLOG_KEYWORDS: undefined,
    PUBLIC_BLOG_LANG: undefined,
    PUBLIC_BLOG_OG_IMAGE: undefined,
    PUBLIC_FEATURED_POSTS_LIMIT: undefined,
    PUBLIC_NEW_POSTS_LIMIT: undefined,
    PUBLIC_POSTS_PER_PAGE: undefined,
    PUBLIC_RELATED_POSTS_LIMIT: undefined,
    PUBLIC_GISCUS_REPO: undefined,
    PUBLIC_GISCUS_REPO_ID: undefined,
    PUBLIC_GISCUS_CATEGORY: undefined,
    PUBLIC_GISCUS_CATEGORY_ID: undefined,
    PUBLIC_GISCUS_MAPPING: undefined,
    PUBLIC_GISCUS_STRICT: undefined,
    PUBLIC_GISCUS_REACTIONS_ENABLED: undefined,
    PUBLIC_GISCUS_EMIT_METADATA: undefined,
    PUBLIC_GISCUS_INPUT_POSITION: undefined,
    PUBLIC_GISCUS_THEME: undefined,
    PUBLIC_GISCUS_LOADING: undefined
};

async function loadBlogConfig(envOverrides: PublicEnv) {
    vi.resetModules();
    vi.doMock('$env/static/public', () => ({
        ...defaultPublicEnv,
        ...envOverrides
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
        expect(BLOG_CONFIG.relatedPostsLimit).toBe(3);
    });

    it('parses numeric env values and falls back when invalid', async () => {
        const { BLOG_CONFIG } = await loadBlogConfig({
            PUBLIC_FEATURED_POSTS_LIMIT: '5',
            PUBLIC_NEW_POSTS_LIMIT: 'abc',
            PUBLIC_POSTS_PER_PAGE: '12',
            PUBLIC_RELATED_POSTS_LIMIT: '4'
        });

        expect(BLOG_CONFIG.featuredPostsLimit).toBe(5);
        expect(BLOG_CONFIG.newPostsLimit).toBe(10);
        expect(BLOG_CONFIG.postsPerPage).toBe(12);
        expect(BLOG_CONFIG.relatedPostsLimit).toBe(4);
    });
});
