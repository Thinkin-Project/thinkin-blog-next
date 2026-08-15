import { describe, expect, it, vi } from 'vitest';

import { getPosts } from '$lib/server/posts';
import type { ArticleMeta } from '$lib/types';

import { load } from '../../routes/topics/[slug]/+page.server';

vi.mock('$lib/constants/blog', () => ({
    BLOG_CONFIG: {
        postsPerPage: 2
    }
}));

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

describe('topic page load', () => {
    it('filters posts by topic slug and computes pagination', async () => {
        mockedGetPosts.mockResolvedValue([
            makePost(1, 'dotnet'),
            makePost(2, 'devops'),
            makePost(3, 'dotnet'),
            makePost(4, 'dotnet')
        ]);

        const result = await runLoad({
            params: { slug: 'dotnet' },
            url: new URL('https://example.com/topics/dotnet?page=1')
        } as TopicsLoadInput);

        expect(result.posts).toHaveLength(2);
        expect(result.pagination.totalPosts).toBe(3);
        expect(result.pagination.totalPages).toBe(2);
        expect(result.meta.title).toBe('.NET');
        expect((result.posts as ArticleMeta[]).every((post) => post.topic === 'dotnet')).toBe(true);
    });

    it('throws 404 for unknown topic', async () => {
        mockedGetPosts.mockResolvedValue([makePost(1, 'dotnet')]);

        await expect(
            load({
                params: { slug: 'unknown-topic' },
                url: new URL('https://example.com/topics/unknown-topic')
            } as TopicsLoadInput)
        ).rejects.toMatchObject({
            status: 404,
            body: { message: 'Could not find topic unknown-topic' }
        });
    });

    it('normalizes out-of-range page query', async () => {
        mockedGetPosts.mockResolvedValue([
            makePost(1, 'dotnet'),
            makePost(2, 'dotnet'),
            makePost(3, 'dotnet')
        ]);

        const result = await runLoad({
            params: { slug: 'dotnet' },
            url: new URL('https://example.com/topics/dotnet?page=999')
        } as TopicsLoadInput);

        expect(result.pagination.currentPage).toBe(2);
        expect(result.posts).toHaveLength(1);
        expect(result.posts[0].slug).toBe('post-3');
    });
});
