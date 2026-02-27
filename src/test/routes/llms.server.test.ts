import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getPosts, getRawPost } from '$lib/server/posts';
import type { ArticleMeta } from '$lib/types';

import { GET as getLlmsFull } from '../../routes/llms-full.txt/+server';
import { GET as getLlms } from '../../routes/llms.txt/+server';

vi.mock('$lib/constants/blog', () => ({
    BLOG_CONFIG: {
        url: 'https://example.com',
        name: 'Thinkin Markdown'
    }
}));

vi.mock('$lib/server/posts', () => ({
    getPosts: vi.fn(),
    getRawPost: vi.fn()
}));

const mockedGetPosts = vi.mocked(getPosts);
const mockedGetRawPost = vi.mocked(getRawPost);

type LlmsGetInput = Parameters<typeof getLlms>[0];
type LlmsFullGetInput = Parameters<typeof getLlmsFull>[0];

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

describe('llms routes GET', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('generates /llms.txt lines as "- [title](markdown-url): description"', async () => {
        mockedGetPosts.mockResolvedValue([
            makePost({
                title: 'First Post',
                description: 'First Description',
                slug: 'first-post'
            })
        ]);

        const response = await getLlms({} as LlmsGetInput);
        const body = await response.text();

        expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
        expect(response.headers.get('Cache-Control')).toBe('max-age=0, s-maxage=3600');
        expect(body).toBe(
            '# Thinkin Markdown\n\n## Articles\n\n- [First Post](https://example.com/posts/first-post.md): First Description'
        );
    });

    it('excludes drafted posts from /llms.txt and /llms-full.txt', async () => {
        mockedGetPosts.mockResolvedValue([
            makePost({
                title: 'Published',
                description: 'Visible',
                slug: 'published'
            }),
            makePost({
                title: 'Draft',
                description: 'Hidden',
                slug: 'draft',
                drafted: true
            })
        ]);
        mockedGetRawPost.mockImplementation(async (slug: string) =>
            slug === 'published' ? '# Published body' : '# Draft body'
        );

        const llmsResponse = await getLlms({} as LlmsGetInput);
        const llmsBody = await llmsResponse.text();
        expect(llmsBody).toContain('[Published](https://example.com/posts/published.md): Visible');
        expect(llmsBody).not.toContain('Draft');

        const llmsFullResponse = await getLlmsFull({} as LlmsFullGetInput);
        const llmsFullBody = await llmsFullResponse.text();
        expect(llmsFullResponse.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
        expect(llmsFullResponse.headers.get('Cache-Control')).toBe('max-age=0, s-maxage=3600');
        expect(llmsFullBody).toBe('# Published body');
        expect(llmsFullBody).not.toContain('Draft');
        expect(mockedGetRawPost).toHaveBeenCalledTimes(1);
        expect(mockedGetRawPost).toHaveBeenCalledWith('published');
    });

    it('combines published raw markdown in /llms-full.txt output', async () => {
        mockedGetPosts.mockResolvedValue([
            makePost({
                title: 'First',
                description: 'A',
                slug: 'first'
            }),
            makePost({
                title: 'Second',
                description: 'B',
                slug: 'second'
            })
        ]);
        mockedGetRawPost.mockImplementation(async (slug: string) =>
            slug === 'first' ? '# First body' : '# Second body'
        );

        const response = await getLlmsFull({} as LlmsFullGetInput);
        const body = await response.text();

        expect(body).toBe('# First body\n\n# Second body');
    });

    it('skips missing raw markdown and logs warning in /llms-full.txt', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        mockedGetPosts.mockResolvedValue([
            makePost({
                title: 'First',
                description: 'A',
                slug: 'first'
            }),
            makePost({
                title: 'Second',
                description: 'B',
                slug: 'second'
            })
        ]);
        mockedGetRawPost.mockImplementation(async (slug: string) =>
            slug === 'first' ? '# First body' : null
        );

        const response = await getLlmsFull({} as LlmsFullGetInput);
        const body = await response.text();

        expect(body).toBe('# First body');
        expect(warnSpy).toHaveBeenCalledWith('Missing raw markdown for published post: second');
    });
});
