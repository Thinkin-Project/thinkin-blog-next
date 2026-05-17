import { beforeEach, describe, expect, it, vi } from 'vitest';

import { findRelatedPosts, getPost, searchPosts } from '$lib/server/webmcp';

import { GET as getPostRoute } from '../../routes/api/webmcp/posts/[slug]/+server';
import { GET as getRelatedPostsRoute } from '../../routes/api/webmcp/posts/[slug]/related/+server';
import { GET as getSearchPostsRoute } from '../../routes/api/webmcp/search-posts/+server';

vi.mock('$lib/server/webmcp', () => ({
    searchPosts: vi.fn(),
    getPost: vi.fn(),
    findRelatedPosts: vi.fn()
}));

const mockedSearchPosts = vi.mocked(searchPosts);
const mockedGetPost = vi.mocked(getPost);
const mockedFindRelatedPosts = vi.mocked(findRelatedPosts);

type SearchPostsRouteInput = Parameters<typeof getSearchPostsRoute>[0];
type GetPostRouteInput = Parameters<typeof getPostRoute>[0];
type GetRelatedPostsRouteInput = Parameters<typeof getRelatedPostsRoute>[0];

describe('api/webmcp routes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('maps search query params into the webmcp service', async () => {
        mockedSearchPosts.mockResolvedValue({
            mode: 'recent',
            total: 1,
            results: [
                {
                    slug: 'recent-post',
                    title: 'Recent Post',
                    description: 'Recent Description',
                    topic: 'dotnet',
                    tags: ['mcp'],
                    date: '2026-03-01',
                    url: 'https://example.com/posts/recent-post'
                }
            ]
        });

        const response = await getSearchPostsRoute({
            url: new URL('https://example.com/api/webmcp/search-posts?topic=dotnet&limit=99')
        } as SearchPostsRouteInput);
        const body = (await response.json()) as Record<string, unknown>;

        expect(mockedSearchPosts).toHaveBeenCalledWith({
            query: undefined,
            topic: 'dotnet',
            tag: undefined,
            limit: 99
        });
        expect(body.mode).toBe('recent');
    });

    it('returns structured json payload for a found post', async () => {
        mockedGetPost.mockResolvedValue({
            metadata: {
                title: 'WebMCP',
                description: 'Intro',
                slug: 'webmcp',
                date: '2026-03-01',
                drafted: false,
                featured: false,
                topic: 'dotnet',
                tags: ['mcp'],
                authors: ['neil']
            },
            content: '# WebMCP',
            url: 'https://example.com/posts/webmcp'
        });

        const response = await getPostRoute({
            params: { slug: 'webmcp' }
        } as GetPostRouteInput);
        const body = (await response.json()) as Record<string, unknown>;

        expect(response.status).toBe(200);
        expect(body.content).toBe('# WebMCP');
    });

    it('returns 404 when the requested post does not exist', async () => {
        mockedGetPost.mockResolvedValue(null);

        await expect(
            getPostRoute({ params: { slug: 'missing' } } as GetPostRouteInput)
        ).rejects.toMatchObject({
            status: 404
        });
    });

    it('returns related posts payload for the requested slug', async () => {
        mockedFindRelatedPosts.mockResolvedValue({
            source: {
                slug: 'webmcp',
                title: 'WebMCP',
                description: 'Intro',
                topic: 'dotnet',
                tags: ['mcp'],
                date: '2026-03-01',
                url: 'https://example.com/posts/webmcp'
            },
            total: 1,
            results: [
                {
                    slug: 'webmcp-tools',
                    title: 'WebMCP Tools',
                    description: 'Related',
                    topic: 'dotnet',
                    tags: ['mcp'],
                    date: '2026-03-02',
                    url: 'https://example.com/posts/webmcp-tools',
                    reason: '同主題，且共享標籤：mcp'
                }
            ]
        });

        const response = await getRelatedPostsRoute({
            params: { slug: 'webmcp' },
            url: new URL('https://example.com/api/webmcp/posts/webmcp/related?limit=8')
        } as GetRelatedPostsRouteInput);
        const body = (await response.json()) as Record<string, unknown>;

        expect(mockedFindRelatedPosts).toHaveBeenCalledWith({
            slug: 'webmcp',
            limit: 8
        });
        expect(body.total).toBe(1);
    });

    it('returns 404 when related post source does not exist', async () => {
        mockedFindRelatedPosts.mockResolvedValue(null);

        await expect(
            getRelatedPostsRoute({
                params: { slug: 'missing' },
                url: new URL('https://example.com/api/webmcp/posts/missing/related')
            } as GetRelatedPostsRouteInput)
        ).rejects.toMatchObject({
            status: 404
        });
    });
});
