import { describe, expect, it, vi } from 'vitest';

import { getPosts } from '$lib/server/posts';
import type { ArticleMeta } from '$lib/types';

import { load as layoutLoad } from '../../routes/+layout.server';
import { load as pageLoad } from '../../routes/+page.server';

vi.mock('$lib/constants/blog', () => ({
    BLOG_CONFIG: {
        newPostsLimit: 2,
        featuredPostsLimit: 2
    }
}));

vi.mock('$lib/server/posts', () => ({
    getPosts: vi.fn()
}));

const mockedGetPosts = vi.mocked(getPosts);

type PageLoadOutput = Exclude<Awaited<ReturnType<typeof pageLoad>>, void>;
type LayoutLoadOutput = Exclude<Awaited<ReturnType<typeof layoutLoad>>, void>;

function makePost(index: number, featured = false): ArticleMeta {
    return {
        title: `Post ${index}`,
        description: `Description ${index}`,
        slug: `post-${index}`,
        date: '2026-01-01',
        drafted: false,
        featured,
        topic: 'dotnet',
        tags: ['dotnet'],
        authors: ['neil']
    };
}

async function runPageLoad(): Promise<PageLoadOutput> {
    const result = await pageLoad({} as never);
    expect(result).toBeDefined();
    return result as PageLoadOutput;
}

async function runLayoutLoad(): Promise<LayoutLoadOutput> {
    const result = await layoutLoad({} as never);
    expect(result).toBeDefined();
    return result as LayoutLoadOutput;
}

describe('home and layout server loads', () => {
    it('limits home newPosts by BLOG_CONFIG.newPostsLimit', async () => {
        mockedGetPosts.mockResolvedValue([makePost(1), makePost(2), makePost(3)]);

        const result = await runPageLoad();

        expect(result.newPosts).toHaveLength(2);
        expect((result.newPosts as ArticleMeta[]).map((post) => post.slug)).toEqual([
            'post-1',
            'post-2'
        ]);
        expect(result.meta.title).toBe('首頁');
    });

    it('returns only featured posts and applies featured limit in layout', async () => {
        mockedGetPosts.mockResolvedValue([
            makePost(1, false),
            makePost(2, true),
            makePost(3, true),
            makePost(4, true)
        ]);

        const result = await runLayoutLoad();

        expect(result.featuredPosts).toHaveLength(2);
        expect((result.featuredPosts as ArticleMeta[]).every((post) => post.featured)).toBe(true);
        expect((result.featuredPosts as ArticleMeta[]).map((post) => post.slug)).toEqual([
            'post-2',
            'post-3'
        ]);
    });
});
