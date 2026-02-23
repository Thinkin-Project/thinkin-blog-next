import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ArticleMeta } from '$lib/types';

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

describe('posts server module', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        vi.resetModules();
        vi.doMock('$app/environment', () => ({ dev: false, browser: false }));
        vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    });

    it('uses cache in non-dev mode', async () => {
        const { getPosts } = await import('../../lib/server/posts');

        const firstCall = await getPosts();
        const secondCall = await getPosts();

        expect(firstCall).toBe(secondCall);
    });

    it('returns error when markdown loader throws unexpectedly', async () => {
        const postsModule = await import('../../lib/server/posts');
        const loaderError = new Error('boom');

        const result = await postsModule.processPostEntry(
            '/src/posts/loader-throw/index.md',
            async () => {
                throw loaderError;
            },
            {}
        );

        expect('error' in result).toBe(true);
        if ('error' in result) {
            expect(result.error).toBe(loaderError);
        }
    });

    it('returns error result when markdown entry is invalid', async () => {
        const postsModule = await import('../../lib/server/posts');
        const result = await postsModule.processPostEntry(
            '/src/posts/bad/index.md',
            async () => ({ bad: true }),
            {}
        );

        expect('error' in result).toBe(true);
        if ('error' in result) {
            expect(result.error).toBeInstanceOf(Error);
            expect((result.error as Error).message).toContain('invalid markdown');
        }
    });

    it('returns error when metadata validation fails', async () => {
        const postsModule = await import('../../lib/server/posts');
        const result = await postsModule.processPostEntry(
            '/src/posts/invalid-metadata/index.md',
            async () => ({ metadata: makePost({ title: '', authors: [] }) }),
            {}
        );

        expect('error' in result).toBe(true);
        if ('error' in result) {
            expect((result.error as Error).message).toContain('missing title or description');
        }
    });

    it('returns error when image loader throws', async () => {
        const postsModule = await import('../../lib/server/posts');
        const imageError = new Error('image load failed');
        const result = await postsModule.processPostEntry(
            '/src/posts/sample-post/index.md',
            async () => ({ metadata: makePost({ slug: 'sample-post', ogImage: './cover.png' }) }),
            {
                '/src/posts/sample-post/cover.png': async () => {
                    throw imageError;
                }
            }
        );

        expect('error' in result).toBe(true);
        if ('error' in result) {
            expect(result.error).toBe(imageError);
        }
    });

    it('processes post entry and resolves relative ogImage via image loader', async () => {
        const postsModule = await import('../../lib/server/posts');

        const entryPath = '/src/posts/sample-post/index.md';
        const loader = vi.fn(async () => ({
            metadata: makePost({
                slug: 'sample-post',
                ogImage: './images/cover.jpg'
            })
        }));
        const imageLoader = vi.fn(async () => '/assets/sample-cover.jpg');

        const result = await postsModule.processPostEntry(entryPath, loader, {
            '/src/posts/sample-post/images/cover.jpg': imageLoader
        });

        expect('post' in result).toBe(true);
        if ('post' in result) {
            expect(result.post.slug).toBe('sample-post');
            expect(result.post.ogImage).toBe('/assets/sample-cover.jpg');
        }
        expect(imageLoader).toHaveBeenCalledTimes(1);
    });

    it('keeps relative ogImage when matching image loader does not exist', async () => {
        const postsModule = await import('../../lib/server/posts');

        const result = await postsModule.processPostEntry(
            '/src/posts/no-image-loader/index.md',
            async () => ({
                metadata: makePost({ slug: 'no-image-loader', ogImage: '.cover.png' })
            }),
            {}
        );

        expect('post' in result).toBe(true);
        if ('post' in result) {
            expect(result.post.ogImage).toBe('.cover.png');
        }
    });

    it('validates metadata with expected errors and accepts valid metadata', async () => {
        const postsModule = await import('../../lib/server/posts');

        const invalid = postsModule.validateMetadata(
            makePost({
                title: '',
                description: '',
                slug: 'INVALID_SLUG',
                date: 'not-a-date',
                authors: []
            })
        );

        expect(invalid.ok).toBe(false);
        expect(invalid.errors).toContain('missing title or description');
        expect(invalid.errors).toContain('invalid slug format: INVALID_SLUG');
        expect(invalid.errors).toContain('invalid date format: not-a-date');
        expect(invalid.errors).toContain('missing authors');

        const valid = postsModule.validateMetadata(makePost());
        expect(valid.ok).toBe(true);
        expect(valid.errors).toHaveLength(0);
    });

    it('reports missing slug and non-string slug validation errors', async () => {
        const postsModule = await import('../../lib/server/posts');

        const missingSlug = postsModule.validateMetadata(
            makePost({ slug: '' as unknown as string })
        );
        expect(missingSlug.ok).toBe(false);
        expect(missingSlug.errors).toContain('missing slug');

        const nonStringSlug = postsModule.validateMetadata({
            ...makePost(),
            slug: 123
        } as unknown as ArticleMeta);
        expect(nonStringSlug.ok).toBe(false);
        expect(nonStringSlug.errors).toContain('slug must be a string');
    });

    it('collects valid posts and skips errored results', async () => {
        const postsModule = await import('../../lib/server/posts');
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

        const collected = postsModule.collectValidPosts([
            { path: '/src/posts/a/index.md', post: makePost({ slug: 'a' }) },
            { path: '/src/posts/b/index.md', error: new Error('bad post') },
            { path: '/src/posts/c/index.md', post: makePost({ slug: 'c' }) }
        ]);

        expect(collected.map((post) => post.slug)).toEqual(['a', 'c']);
        expect(warnSpy).toHaveBeenCalledTimes(1);
    });

    it('filters drafted posts and sorts by date desc in finalizePosts', async () => {
        const postsModule = await import('../../lib/server/posts');
        const posts = [
            makePost({ slug: 'oldest', date: '2026-01-01', drafted: false }),
            makePost({ slug: 'drafted-new', date: '2026-03-01', drafted: true }),
            makePost({ slug: 'middle', date: '2026-02-01', drafted: false })
        ];

        const finalized = postsModule.finalizePosts(posts);

        expect(finalized).toHaveLength(2);
        expect(finalized.map((post) => post.slug)).toEqual(['middle', 'oldest']);
        expect(finalized.every((post) => !post.drafted)).toBe(true);
    });

    it('delegates getAdjacentPosts through getPosts pipeline', async () => {
        const postsModule = await import('../../lib/server/posts');
        const adjacent = await postsModule.getAdjacentPosts('non-existent-slug');

        expect(adjacent).toEqual({ next: null, prev: null });
    });

    it('returns null adjacent posts when slug is not found', async () => {
        const postsModule = await import('../../lib/server/posts');
        const adjacent = postsModule.calculateAdjacentPosts(
            [makePost({ slug: 'a' }), makePost({ slug: 'b' })],
            'non-existent-slug'
        );

        expect(adjacent.next).toBeNull();
        expect(adjacent.prev).toBeNull();
    });

    it('returns correct adjacent posts for first, middle, and last post', async () => {
        const postsModule = await import('../../lib/server/posts');
        const posts = [
            makePost({ slug: 'newest', date: '2026-03-01' }),
            makePost({ slug: 'middle', date: '2026-02-01' }),
            makePost({ slug: 'oldest', date: '2026-01-01' })
        ];

        const firstAdjacent = postsModule.calculateAdjacentPosts(posts, 'newest');
        expect(firstAdjacent.next).toBeNull();
        expect(firstAdjacent.prev?.slug).toBe('middle');

        const middleAdjacent = postsModule.calculateAdjacentPosts(posts, 'middle');
        expect(middleAdjacent.next?.slug).toBe('newest');
        expect(middleAdjacent.prev?.slug).toBe('oldest');

        const lastAdjacent = postsModule.calculateAdjacentPosts(posts, 'oldest');
        expect(lastAdjacent.next?.slug).toBe('middle');
        expect(lastAdjacent.prev).toBeNull();
    });
});
