import { describe, expect, it, vi } from 'vitest';

import { getPosts } from '$lib/server/posts';
import type { ArticleMeta } from '$lib/types';

import { GET } from '../../routes/api/posts/+server';

vi.mock('$lib/server/posts', () => ({
    getPosts: vi.fn()
}));

vi.mock('$lib/constants/topics', () => ({
    getTopicName: vi.fn((slug: string) => `Topic:${slug}`)
}));

vi.mock('$lib/constants/tags', () => ({
    getTagName: vi.fn((slug: string) => `Tag:${slug}`)
}));

const mockedGetPosts = vi.mocked(getPosts);
type ApiPostsGetInput = Parameters<typeof GET>[0];

function makePost(index: number): ArticleMeta {
    return {
        title: `Post ${index}`,
        description: `Description ${index}`,
        slug: `post-${index}`,
        date: '2026-01-01',
        drafted: false,
        featured: false,
        topic: 'dotnet',
        tags: ['a', 'b'],
        authors: ['neil']
    };
}

describe('api/posts GET', () => {
    it('returns mapped search index shape', async () => {
        mockedGetPosts.mockResolvedValue([makePost(1)]);

        const response = await GET({} as ApiPostsGetInput);
        const body = (await response.json()) as Array<Record<string, unknown>>;

        expect(response.status).toBe(200);
        expect(body).toHaveLength(1);
        expect(body[0]).toEqual({
            title: 'Post 1',
            description: 'Description 1',
            slug: 'post-1',
            topic: 'Topic:dotnet',
            tags: ['Tag:a', 'Tag:b'],
            date: '2026-01-01'
        });
    });

    it('returns empty array when there are no posts', async () => {
        mockedGetPosts.mockResolvedValue([]);

        const response = await GET({} as ApiPostsGetInput);
        const body = (await response.json()) as unknown[];

        expect(response.status).toBe(200);
        expect(body).toEqual([]);
    });
});
