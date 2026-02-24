import { describe, expect, it, vi } from 'vitest';

import { getPosts } from '$lib/server/posts';
import type { ArticleMeta } from '$lib/types';

import { load } from '../../routes/posts/+page.server';

vi.mock('$lib/constants/blog', () => ({
    BLOG_CONFIG: {
        postsPerPage: 10
    }
}));

vi.mock('$lib/server/posts', () => ({
    getPosts: vi.fn()
}));

const mockedGetPosts = vi.mocked(getPosts);

type PostsLoadInput = Parameters<typeof load>[0];
type PostsLoadOutput = Exclude<Awaited<ReturnType<typeof load>>, void>;

async function runLoad(input: PostsLoadInput): Promise<PostsLoadOutput> {
    const result = await load(input);
    expect(result).toBeDefined();
    return result as PostsLoadOutput;
}

function makePost(index: number): ArticleMeta {
    return {
        title: `Post ${index}`,
        description: `Description ${index}`,
        slug: `post-${index}`,
        date: '2026-01-01',
        drafted: false,
        featured: false,
        topic: 'dotnet',
        tags: ['dotnet'],
        authors: ['neil']
    };
}

describe('posts page load', () => {
    it('uses page 1 when page query is missing', async () => {
        mockedGetPosts.mockResolvedValue(Array.from({ length: 23 }, (_, i) => makePost(i + 1)));

        const result = await runLoad({
            url: new URL('https://example.com/posts')
        } as PostsLoadInput);

        expect(result.pagination.currentPage).toBe(1);
        expect(result.pagination.totalPages).toBe(3);
        expect(result.pagination.totalPosts).toBe(23);
        expect(result.posts).toHaveLength(10);
    });

    it('normalizes invalid page values to valid range', async () => {
        mockedGetPosts.mockResolvedValue(Array.from({ length: 11 }, (_, i) => makePost(i + 1)));

        const nanResult = await runLoad({
            url: new URL('https://example.com/posts?page=abc')
        } as PostsLoadInput);
        expect(nanResult.pagination.currentPage).toBe(1);

        const negativeResult = await runLoad({
            url: new URL('https://example.com/posts?page=-3')
        } as PostsLoadInput);
        expect(negativeResult.pagination.currentPage).toBe(1);

        const overMaxResult = await runLoad({
            url: new URL('https://example.com/posts?page=99')
        } as PostsLoadInput);
        expect(overMaxResult.pagination.currentPage).toBe(2);
    });

    it('returns correct slice for second page', async () => {
        mockedGetPosts.mockResolvedValue(Array.from({ length: 23 }, (_, i) => makePost(i + 1)));

        const result = await runLoad({
            url: new URL('https://example.com/posts?page=2')
        } as PostsLoadInput);

        expect(result.posts).toHaveLength(10);
        expect(result.posts[0].slug).toBe('post-11');
        expect(result.posts[9].slug).toBe('post-20');
    });
});
