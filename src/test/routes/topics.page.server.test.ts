import { describe, expect, it, vi } from 'vitest';

import { getPosts } from '$lib/server/posts';
import type { ArticleMeta } from '$lib/types';

import { load } from '../../routes/topics/+page.server';

vi.mock('$lib/constants/topics', () => ({
    TOPICS: [
        { slug: 'dotnet', name: '.NET' },
        { slug: 'devops', name: 'DevOps' }
    ]
}));

vi.mock('$lib/server/posts', () => ({
    getPosts: vi.fn()
}));

const mockedGetPosts = vi.mocked(getPosts);

type TopicsLoadInput = Parameters<typeof load>[0];
type TopicsLoadOutput = Exclude<Awaited<ReturnType<typeof load>>, void>;

async function runLoad(input: TopicsLoadInput): Promise<TopicsLoadOutput> {
    const result = await load(input);
    expect(result).toBeDefined();
    return result as TopicsLoadOutput;
}

function makePost(index: number, topic: string): ArticleMeta {
    return {
        title: `Post ${index}`,
        description: `Description ${index}`,
        slug: `post-${index}`,
        date: '2026-01-01',
        drafted: false,
        featured: false,
        topic,
        tags: ['dotnet'],
        authors: ['neil']
    };
}

describe('topics page load', () => {
    it('computes post count per topic', async () => {
        mockedGetPosts.mockResolvedValue([
            makePost(1, 'dotnet'),
            makePost(2, 'devops'),
            makePost(3, 'dotnet')
        ]);

        const result = await runLoad({} as TopicsLoadInput);

        expect(result.topics).toEqual([
            { slug: 'dotnet', name: '.NET', postCount: 2 },
            { slug: 'devops', name: 'DevOps', postCount: 1 }
        ]);
        expect(result.meta.title).toBe('主題');
    });

    it('sorts topics by post count descending', async () => {
        mockedGetPosts.mockResolvedValue([
            makePost(1, 'devops'),
            makePost(2, 'devops'),
            makePost(3, 'devops'),
            makePost(4, 'dotnet')
        ]);

        const result = await runLoad({} as TopicsLoadInput);

        expect(result.topics).toEqual([
            { slug: 'devops', name: 'DevOps', postCount: 3 },
            { slug: 'dotnet', name: '.NET', postCount: 1 }
        ]);
    });

    it('returns zero post count when no posts match', async () => {
        mockedGetPosts.mockResolvedValue([]);

        const result = await runLoad({} as TopicsLoadInput);

        expect(result.topics).toEqual([
            { slug: 'dotnet', name: '.NET', postCount: 0 },
            { slug: 'devops', name: 'DevOps', postCount: 0 }
        ]);
    });
});
