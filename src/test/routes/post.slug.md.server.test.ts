import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getPosts, getRawPost } from '$lib/server/posts';

import { GET } from '../../routes/posts/[slug].md/+server';

vi.mock('$lib/server/posts', () => ({
    getPosts: vi.fn(),
    getRawPost: vi.fn()
}));

const mockedGetPosts = vi.mocked(getPosts);
const mockedGetRawPost = vi.mocked(getRawPost);

type PostSlugMdGetInput = Parameters<typeof GET>[0];

describe('post slug .md GET', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns raw markdown for published post', async () => {
        mockedGetPosts.mockResolvedValue([{ slug: 'hello-world', drafted: false }]);
        mockedGetRawPost.mockResolvedValue('# Hello world');

        const response = await GET({ params: { slug: 'hello-world' } } as PostSlugMdGetInput);
        const body = await response.text();

        expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
        expect(body).toBe('# Hello world');
    });

    it('returns 404 for drafted post', async () => {
        mockedGetPosts.mockResolvedValue([{ slug: 'draft-post', drafted: true }]);

        await expect(
            GET({ params: { slug: 'draft-post' } } as PostSlugMdGetInput)
        ).rejects.toMatchObject({
            status: 404
        });
    });
});
