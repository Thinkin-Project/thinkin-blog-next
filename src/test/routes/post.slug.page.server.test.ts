import { describe, expect, it, vi } from 'vitest';

import { getAdjacentPosts } from '$lib/server/posts';
import { findRelatedPosts } from '$lib/server/webmcp';

import { load } from '../../routes/posts/[slug]/+page.server';

vi.mock('$lib/constants/blog', () => ({
    BLOG_CONFIG: {
        relatedPostsLimit: 3
    }
}));

vi.mock('$lib/server/posts', () => ({
    getAdjacentPosts: vi.fn()
}));

vi.mock('$lib/server/webmcp', () => ({
    findRelatedPosts: vi.fn()
}));

const mockedGetAdjacentPosts = vi.mocked(getAdjacentPosts);
const mockedFindRelatedPosts = vi.mocked(findRelatedPosts);
type PostSlugServerLoadInput = Parameters<typeof load>[0];
type PostSlugServerLoadOutput = Exclude<Awaited<ReturnType<typeof load>>, void>;

async function runLoad(input: PostSlugServerLoadInput): Promise<PostSlugServerLoadOutput> {
    const result = await load(input);
    expect(result).toBeDefined();
    return result as PostSlugServerLoadOutput;
}

describe('post slug page.server load', () => {
    it('returns prev/next from getAdjacentPosts', async () => {
        mockedGetAdjacentPosts.mockResolvedValue({
            prev: { slug: 'older-post' },
            next: { slug: 'newer-post' }
        } as Awaited<ReturnType<typeof getAdjacentPosts>>);
        mockedFindRelatedPosts.mockResolvedValue({
            source: {
                slug: 'current-post',
                title: 'Current Post',
                description: 'Current description',
                topic: 'dotnet',
                tags: ['mcp'],
                date: '2026-01-01',
                url: 'https://example.com/posts/current-post'
            },
            total: 1,
            results: [
                {
                    slug: 'related-post',
                    title: 'Related Post',
                    description: 'Related description',
                    topic: 'dotnet',
                    tags: ['mcp'],
                    date: '2026-01-02',
                    url: 'https://example.com/posts/related-post',
                    reason: 'Same topic (.NET) and shared tags: MCP'
                }
            ]
        });

        const result = await runLoad({
            params: { slug: 'current-post' }
        } as PostSlugServerLoadInput);

        expect(mockedGetAdjacentPosts).toHaveBeenCalledWith('current-post');
        expect(mockedFindRelatedPosts).toHaveBeenCalledWith({ slug: 'current-post', limit: 3 });
        expect(result).toEqual({
            prev: { slug: 'older-post' },
            next: { slug: 'newer-post' },
            relatedPosts: [
                {
                    slug: 'related-post',
                    title: 'Related Post',
                    description: 'Related description',
                    topic: 'dotnet',
                    tags: ['mcp'],
                    date: '2026-01-02',
                    url: 'https://example.com/posts/related-post',
                    reason: 'Same topic (.NET) and shared tags: MCP'
                }
            ]
        });
    });

    it('returns null adjacent posts when none exists', async () => {
        mockedGetAdjacentPosts.mockResolvedValue({ prev: null, next: null });
        mockedFindRelatedPosts.mockResolvedValue(null);

        const result = await runLoad({ params: { slug: 'not-found' } } as PostSlugServerLoadInput);

        expect(result).toEqual({ prev: null, next: null, relatedPosts: [] });
    });
});
