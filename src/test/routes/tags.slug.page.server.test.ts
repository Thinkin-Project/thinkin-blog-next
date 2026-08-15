import { describe, expect, it, vi } from 'vitest';

import { getPosts } from '$lib/server/posts';
import type { ArticleMeta } from '$lib/types';

import { load } from '../../routes/tags/[slug]/+page.server';

vi.mock('$lib/constants/blog', () => ({
    BLOG_CONFIG: {
        postsPerPage: 2
    }
}));

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

describe('tag page load', () => {
    it('filters posts by tag slug and computes pagination', async () => {
        mockedGetPosts.mockResolvedValue([
            makePost(1, ['javascript']),
            makePost(2, ['nodejs']),
            makePost(3, ['javascript']),
            makePost(4, ['javascript', 'nodejs'])
        ]);

        const result = await runLoad({
            params: { slug: 'javascript' },
            url: new URL('https://example.com/tags/javascript?page=1')
        } as TagsLoadInput);

        expect(result.posts).toHaveLength(2);
        expect(result.pagination.totalPosts).toBe(3);
        expect(result.pagination.totalPages).toBe(2);
        expect(result.meta.title).toBe('JavaScript');
        expect(
            (result.posts as ArticleMeta[]).every((post) => post.tags.includes('javascript'))
        ).toBe(true);
    });

    it('throws 404 for unknown tag', async () => {
        mockedGetPosts.mockResolvedValue([makePost(1, ['javascript'])]);

        await expect(
            load({
                params: { slug: 'unknown-tag' },
                url: new URL('https://example.com/tags/unknown-tag')
            } as TagsLoadInput)
        ).rejects.toMatchObject({
            status: 404,
            body: { message: 'Could not find tag unknown-tag' }
        });
    });

    it('normalizes out-of-range page query', async () => {
        mockedGetPosts.mockResolvedValue([
            makePost(1, ['javascript']),
            makePost(2, ['javascript']),
            makePost(3, ['javascript'])
        ]);

        const result = await runLoad({
            params: { slug: 'javascript' },
            url: new URL('https://example.com/tags/javascript?page=999')
        } as TagsLoadInput);

        expect(result.pagination.currentPage).toBe(2);
        expect(result.posts).toHaveLength(1);
        expect(result.posts[0].slug).toBe('post-3');
    });
});
