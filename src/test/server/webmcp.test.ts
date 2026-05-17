import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getPosts, getRawPost } from '$lib/server/posts';
import type { ArticleMeta } from '$lib/types';

import {
    clampLimit,
    createPostSummary,
    findRelatedPosts,
    getPost,
    scoreRelatedPost,
    searchPosts,
    stripFrontmatter
} from '../../lib/server/webmcp';

vi.mock('$lib/constants/blog', () => ({
    BLOG_CONFIG: {
        url: 'https://example.com'
    }
}));

vi.mock('$lib/constants/topics', () => ({
    resolveTopicSlug: vi.fn((input: string) => {
        const normalizedInput = input.trim().toLowerCase();

        if (normalizedInput === 'dotnet' || normalizedInput === '.net') {
            return 'dotnet';
        }

        if (normalizedInput === 'svelte') {
            return 'svelte';
        }

        return undefined;
    })
}));

vi.mock('$lib/constants/tags', () => ({
    resolveTagSlug: vi.fn((input: string) => {
        const normalizedInput = input.trim().toLowerCase();

        if (normalizedInput === 'mcp') {
            return 'mcp';
        }

        if (normalizedInput === 'architecture') {
            return 'architecture';
        }

        return undefined;
    })
}));

vi.mock('$lib/server/posts', () => ({
    getPosts: vi.fn(),
    getRawPost: vi.fn()
}));

const mockedGetPosts = vi.mocked(getPosts);
const mockedGetRawPost = vi.mocked(getRawPost);

function makePost(overrides: Partial<ArticleMeta> = {}): ArticleMeta {
    return {
        title: 'Post title',
        description: 'Post description',
        slug: 'post-title',
        date: '2026-01-01',
        drafted: false,
        featured: false,
        topic: 'dotnet',
        tags: ['dotnet'],
        authors: ['neil'],
        ...overrides
    };
}

describe('webmcp server service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('strips frontmatter from raw markdown content', () => {
        expect(stripFrontmatter('---\ntitle: Test\n---\n# Heading\n\nBody')).toBe(
            '# Heading\n\nBody'
        );
    });

    it('clamps limit values into the supported range', () => {
        expect(clampLimit(undefined, 5, 20)).toBe(5);
        expect(clampLimit(0, 5, 20)).toBe(1);
        expect(clampLimit(25, 5, 20)).toBe(20);
    });

    it('creates summary payloads with canonical urls', () => {
        expect(createPostSummary(makePost({ slug: 'webmcp-intro' }))).toEqual({
            slug: 'webmcp-intro',
            title: 'Post title',
            description: 'Post description',
            topic: 'dotnet',
            tags: ['dotnet'],
            date: '2026-01-01',
            url: 'https://example.com/posts/webmcp-intro'
        });
    });

    it('returns recent fallback when no search criteria are provided', async () => {
        mockedGetPosts.mockResolvedValue([
            makePost({ slug: 'latest', date: '2026-03-01' }),
            makePost({ slug: 'older', date: '2026-02-01' })
        ]);

        const result = await searchPosts({});

        expect(result.mode).toBe('recent');
        expect(result.total).toBe(2);
        expect(result.results.map((post) => post.slug)).toEqual(['latest', 'older']);
        expect(mockedGetRawPost).not.toHaveBeenCalled();
    });

    it('filters search results by taxonomy slugs without loading raw markdown', async () => {
        mockedGetPosts.mockResolvedValue([
            makePost({ slug: 'mcp-dotnet', topic: 'dotnet', tags: ['mcp'] }),
            makePost({ slug: 'svelte-webmcp', topic: 'svelte', tags: ['mcp'] }),
            makePost({ slug: 'dotnet-clean', topic: 'dotnet', tags: ['architecture'] })
        ]);

        const result = await searchPosts({ topic: 'dotnet', tag: 'mcp' });

        expect(result.mode).toBe('search');
        expect(result.total).toBe(1);
        expect(result.results.map((post) => post.slug)).toEqual(['mcp-dotnet']);
        expect(mockedGetRawPost).not.toHaveBeenCalled();
    });

    it('filters search results by topic display name and tag slug without loading raw markdown', async () => {
        mockedGetPosts.mockResolvedValue([
            makePost({ slug: 'mcp-dotnet', topic: 'dotnet', tags: ['mcp'] }),
            makePost({ slug: 'svelte-webmcp', topic: 'svelte', tags: ['mcp'] }),
            makePost({ slug: 'dotnet-clean', topic: 'dotnet', tags: ['architecture'] })
        ]);

        const result = await searchPosts({ topic: '.NET', tag: 'mcp' });

        expect(result.mode).toBe('search');
        expect(result.total).toBe(1);
        expect(result.results.map((post) => post.slug)).toEqual(['mcp-dotnet']);
        expect(mockedGetRawPost).not.toHaveBeenCalled();
    });

    it('returns no matches when taxonomy input cannot be resolved to a canonical slug', async () => {
        mockedGetPosts.mockResolvedValue([
            makePost({ slug: 'mcp-dotnet', topic: 'dotnet', tags: ['mcp'] })
        ]);

        const result = await searchPosts({ topic: 'unknown-topic' });

        expect(result.mode).toBe('search');
        expect(result.total).toBe(0);
        expect(result.results).toEqual([]);
        expect(mockedGetRawPost).not.toHaveBeenCalled();
    });

    it('matches query against metadata first and falls back to body content', async () => {
        mockedGetPosts.mockResolvedValue([
            makePost({
                slug: 'body-match',
                title: 'API Notes',
                description: 'No webmcp keyword here',
                tags: ['api']
            }),
            makePost({
                slug: 'title-match',
                title: 'WebMCP introduction',
                description: 'Overview',
                tags: ['mcp']
            })
        ]);
        mockedGetRawPost.mockImplementation(async (slug: string) =>
            slug === 'body-match' ? '---\ntitle: API Notes\n---\nWebMCP appears in the body.' : null
        );

        const result = await searchPosts({ query: 'webmcp' });

        expect(result.results.map((post) => post.slug)).toEqual(['title-match', 'body-match']);
    });

    it('returns structured post payload without frontmatter', async () => {
        mockedGetPosts.mockResolvedValue([
            makePost({
                slug: 'webmcp-intro',
                updated: '2026-02-01',
                tags: ['mcp', 'browser']
            })
        ]);
        mockedGetRawPost.mockResolvedValue(
            "---\ntitle: 'ignored'\ndescription: 'ignored'\n---\n# WebMCP\n\nStructured body"
        );

        const result = await getPost('webmcp-intro');

        expect(result).toEqual({
            metadata: makePost({
                slug: 'webmcp-intro',
                updated: '2026-02-01',
                tags: ['mcp', 'browser']
            }),
            content: '# WebMCP\n\nStructured body',
            url: 'https://example.com/posts/webmcp-intro'
        });
    });

    it('returns null when post metadata or raw markdown is missing', async () => {
        mockedGetPosts.mockResolvedValue([]);
        expect(await getPost('missing')).toBeNull();

        mockedGetPosts.mockResolvedValue([makePost({ slug: 'missing-raw' })]);
        mockedGetRawPost.mockResolvedValue(null);
        expect(await getPost('missing-raw')).toBeNull();
    });

    it('scores related posts by topic first, then shared tags, then recency', async () => {
        const source = makePost({ slug: 'source', topic: 'dotnet', tags: ['mcp', 'api'] });
        const sameTopicAndTags = makePost({
            slug: 'same-topic-tags',
            topic: 'dotnet',
            tags: ['mcp', 'api'],
            date: '2026-03-10'
        });
        const sameTopicOnly = makePost({
            slug: 'same-topic-only',
            topic: 'dotnet',
            tags: ['architecture'],
            date: '2026-03-11'
        });

        const strong = scoreRelatedPost(source, sameTopicAndTags);
        const medium = scoreRelatedPost(source, sameTopicOnly);

        expect(strong.score).toBeGreaterThan(medium.score);
        expect(strong.reason).toContain('Same topic');
        expect(strong.reason).toContain('mcp');
    });

    it('returns related posts with explainable reasons and stable ordering', async () => {
        mockedGetPosts.mockResolvedValue([
            makePost({ slug: 'source', topic: 'dotnet', tags: ['mcp', 'api'], date: '2026-03-12' }),
            makePost({
                slug: 'same-topic-tags',
                topic: 'dotnet',
                tags: ['mcp', 'api'],
                date: '2026-03-11'
            }),
            makePost({
                slug: 'same-topic-newer',
                topic: 'dotnet',
                tags: ['architecture'],
                date: '2026-03-10'
            }),
            makePost({
                slug: 'shared-tag-only',
                topic: 'svelte',
                tags: ['mcp'],
                date: '2026-03-09'
            }),
            makePost({
                slug: 'fallback-recent',
                topic: 'career',
                tags: ['notes'],
                date: '2026-03-08'
            })
        ]);

        const result = await findRelatedPosts({ slug: 'source', limit: 4 });

        expect(result?.source.slug).toBe('source');
        expect(result?.results.map((post) => post.slug)).toEqual([
            'same-topic-tags',
            'same-topic-newer',
            'shared-tag-only',
            'fallback-recent'
        ]);
        expect(result?.results[0]?.reason).toBe('Same topic and shared tags: mcp, api');
        expect(result?.results[2]?.reason).toBe('Shared tags: mcp');
        expect(result?.results[3]?.reason).toBe('Recently published related post');
    });

    it('returns null when related source post is missing', async () => {
        mockedGetPosts.mockResolvedValue([makePost({ slug: 'another-post' })]);

        expect(await findRelatedPosts({ slug: 'missing' })).toBeNull();
    });
});
