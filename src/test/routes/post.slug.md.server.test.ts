import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getPosts, getRawPost } from '$lib/server/posts';
import type { ArticleMeta } from '$lib/types';

import { GET } from '../../routes/posts/[slug].md/+server';

vi.mock('$lib/server/posts', () => ({
    getPosts: vi.fn(),
    getRawPost: vi.fn()
}));

const mockedGetPosts = vi.mocked(getPosts);
const mockedGetRawPost = vi.mocked(getRawPost);

type PostSlugMdGetInput = Parameters<typeof GET>[0];

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

describe('post slug .md GET', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns raw markdown for published post', async () => {
        mockedGetPosts.mockResolvedValue([makePost({ slug: 'hello-world', drafted: false })]);
        mockedGetRawPost.mockResolvedValue('# Hello world');

        const response = await GET({ params: { slug: 'hello-world' } } as PostSlugMdGetInput);
        const body = await response.text();

        expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
        expect(response.headers.get('Cache-Control')).toBe('max-age=0, s-maxage=3600');
        expect(body).toBe('# Hello world');
    });

    it('returns 404 for drafted post', async () => {
        mockedGetPosts.mockResolvedValue([makePost({ slug: 'draft-post', drafted: true })]);

        await expect(
            GET({ params: { slug: 'draft-post' } } as PostSlugMdGetInput)
        ).rejects.toMatchObject({
            status: 404
        });
        expect(mockedGetRawPost).not.toHaveBeenCalled();
    });

    it('returns 404 when published post metadata exists but raw markdown is missing', async () => {
        mockedGetPosts.mockResolvedValue([makePost({ slug: 'hello-world', drafted: false })]);
        mockedGetRawPost.mockResolvedValue(null);

        await expect(
            GET({ params: { slug: 'hello-world' } } as PostSlugMdGetInput)
        ).rejects.toMatchObject({
            status: 404
        });
    });
});
