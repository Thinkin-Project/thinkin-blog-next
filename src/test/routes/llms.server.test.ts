import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getPosts, getRawPost } from '$lib/server/posts';

import { GET as getLlmsFull } from '../../routes/llms-full.txt/+server';
import { GET as getLlms } from '../../routes/llms.txt/+server';

vi.mock('$lib/server/posts', () => ({
    getPosts: vi.fn(),
    getRawPost: vi.fn()
}));

const mockedGetPosts = vi.mocked(getPosts);
const mockedGetRawPost = vi.mocked(getRawPost);

describe('llms routes GET', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('generates /llms.txt lines as [title](markdown-url): description', async () => {
        mockedGetPosts.mockResolvedValue([
            {
                title: 'First Post',
                description: 'First Description',
                slug: 'first-post',
                drafted: false
            }
        ]);

        const response = await getLlms();
        const body = await response.text();

        expect(response.headers.get('Content-Type')).toBe('text/plain');
        expect(body).toBe('[First Post](/posts/first-post.md): First Description');
    });

    it('excludes drafted posts from /llms.txt and /llms-full.txt', async () => {
        mockedGetPosts.mockResolvedValue([
            {
                title: 'Published',
                description: 'Visible',
                slug: 'published',
                drafted: false
            },
            {
                title: 'Draft',
                description: 'Hidden',
                slug: 'draft',
                drafted: true
            }
        ]);
        mockedGetRawPost.mockImplementation(async (slug: string) =>
            slug === 'published' ? '# Published body' : '# Draft body'
        );

        const llmsResponse = await getLlms();
        const llmsBody = await llmsResponse.text();
        expect(llmsBody).toContain('[Published](/posts/published.md): Visible');
        expect(llmsBody).not.toContain('Draft');

        const llmsFullResponse = await getLlmsFull();
        const llmsFullBody = await llmsFullResponse.text();
        expect(llmsFullResponse.headers.get('Content-Type')).toBe('text/plain');
        expect(llmsFullBody).toBe('# Published body');
        expect(llmsFullBody).not.toContain('Draft');
        expect(mockedGetRawPost).toHaveBeenCalledTimes(1);
        expect(mockedGetRawPost).toHaveBeenCalledWith('published');
    });

    it('combines published raw markdown in /llms-full.txt output', async () => {
        mockedGetPosts.mockResolvedValue([
            {
                title: 'First',
                description: 'A',
                slug: 'first',
                drafted: false
            },
            {
                title: 'Second',
                description: 'B',
                slug: 'second',
                drafted: false
            }
        ]);
        mockedGetRawPost.mockImplementation(async (slug: string) =>
            slug === 'first' ? '# First body' : '# Second body'
        );

        const response = await getLlmsFull();
        const body = await response.text();

        expect(body).toBe('# First body\n\n# Second body');
    });
});
