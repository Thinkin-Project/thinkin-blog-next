import { describe, expect, it, vi } from 'vitest';

import { getPosts } from '$lib/server/posts';
import type { ArticleMeta } from '$lib/types';

import { load } from '../../routes/tags/+page.server';

vi.mock('$lib/constants/tags', () => ({
    TAGS: [
        { slug: 'javascript', name: 'JavaScript', aliases: [] },
        { slug: 'nodejs', name: 'Node.js', aliases: [] }
    ]
}));

vi.mock('$lib/server/posts', () => ({
    getPosts: vi.fn()
}));

const mockedGetPosts = vi.mocked(getPosts);

type TagsLoadInput = Parameters<typeof load>[0];
type TagsLoadOutput = Exclude<Awaited<ReturnType<typeof load>>, void>;

async function runLoad(input: TagsLoadInput): Promise<TagsLoadOutput> {
    const result = await load(input);
    expect(result).toBeDefined();
    return result as TagsLoadOutput;
}

function makePost(index: number, tags: string[]): ArticleMeta {
    return {
        title: `Post ${index}`,
        description: `Description ${index}`,
        slug: `post-${index}`,
        date: '2026-01-01',
        drafted: false,
        featured: false,
        topic: 'dotnet',
        tags,
        authors: ['neil']
    };
}

describe('tags page load', () => {
    it('computes post count per tag', async () => {
        mockedGetPosts.mockResolvedValue([
            makePost(1, ['javascript']),
            makePost(2, ['nodejs']),
            makePost(3, ['javascript', 'nodejs'])
        ]);

        const result = await runLoad({} as TagsLoadInput);

        expect(result.tags).toEqual([
            { slug: 'javascript', name: 'JavaScript', aliases: [], postCount: 2 },
            { slug: 'nodejs', name: 'Node.js', aliases: [], postCount: 2 }
        ]);
        expect(result.meta.title).toBe('標籤');
    });

    it('sorts tags by post count descending', async () => {
        mockedGetPosts.mockResolvedValue([
            makePost(1, ['nodejs']),
            makePost(2, ['nodejs']),
            makePost(3, ['nodejs']),
            makePost(4, ['javascript'])
        ]);

        const result = await runLoad({} as TagsLoadInput);

        expect(result.tags).toEqual([
            { slug: 'nodejs', name: 'Node.js', aliases: [], postCount: 3 },
            { slug: 'javascript', name: 'JavaScript', aliases: [], postCount: 1 }
        ]);
    });

    it('returns zero post count when no posts match', async () => {
        mockedGetPosts.mockResolvedValue([]);

        const result = await runLoad({} as TagsLoadInput);

        expect(result.tags).toEqual([
            { slug: 'javascript', name: 'JavaScript', aliases: [], postCount: 0 },
            { slug: 'nodejs', name: 'Node.js', aliases: [], postCount: 0 }
        ]);
    });
});
