import { describe, expect, it, vi } from 'vitest';

import { getAdjacentPosts } from '$lib/server/posts';

import { load } from '../../routes/posts/[slug]/+page.server';

vi.mock('$lib/server/posts', () => ({
    getAdjacentPosts: vi.fn()
}));

const mockedGetAdjacentPosts = vi.mocked(getAdjacentPosts);
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

        const result = await runLoad({
            params: { slug: 'current-post' }
        } as PostSlugServerLoadInput);

        expect(mockedGetAdjacentPosts).toHaveBeenCalledWith('current-post');
        expect(result).toEqual({
            prev: { slug: 'older-post' },
            next: { slug: 'newer-post' }
        });
    });

    it('returns null adjacent posts when none exists', async () => {
        mockedGetAdjacentPosts.mockResolvedValue({ prev: null, next: null });

        const result = await runLoad({ params: { slug: 'not-found' } } as PostSlugServerLoadInput);

        expect(result).toEqual({ prev: null, next: null });
    });
});
