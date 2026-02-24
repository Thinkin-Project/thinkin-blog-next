import { beforeEach, describe, expect, it, vi } from 'vitest';

const errorMock = vi.hoisted(() =>
    vi.fn((status: number, message: string) => {
        throw Object.assign(new Error(message), { status, message });
    })
);

vi.mock('@sveltejs/kit', () => ({
    error: errorMock
}));

type PostSlugLoadInput = Parameters<(typeof import('../../routes/posts/[slug]/+page'))['load']>[0];
type PostSlugLoadOutput = Exclude<
    Awaited<ReturnType<(typeof import('../../routes/posts/[slug]/+page'))['load']>>,
    void
>;

async function runLoad(input: PostSlugLoadInput): Promise<PostSlugLoadOutput> {
    const { load } = await import('../../routes/posts/[slug]/+page');
    const result = await load(input);
    expect(result).toBeDefined();
    return result as PostSlugLoadOutput;
}

describe('post slug page load', () => {
    beforeEach(() => {
        vi.resetModules();
        errorMock.mockClear();
        vi.spyOn(console, 'error').mockImplementation(() => undefined);
    });

    it('loads markdown content and extracts h2/h3 headings', async () => {
        vi.doMock('$posts/unit-post/index.md', () => ({
            default: () => 'mock component',
            metadata: {
                title: 'Unit Post',
                description: 'desc',
                slug: 'unit-post',
                date: '2026-01-01',
                drafted: false,
                featured: false,
                topic: 'dotnet',
                tags: [],
                authors: ['neil'],
                ogImage: './missing-image.png'
            }
        }));

        vi.doMock('$posts/unit-post/index.md?raw', () => ({
            default: '# Title\n## Hello World\n### 中文 測試!\nText'
        }));

        const result = await runLoad({
            params: { slug: 'unit-post' },
            data: { prev: null, next: null }
        } as PostSlugLoadInput);

        expect(result.meta.ogImage).toBe('./missing-image.png');
        expect(result.headings).toEqual([
            { level: 2, title: 'Hello World', slug: 'hello-world' },
            { level: 3, title: '中文 測試!', slug: '中文-測試' }
        ]);
        expect(result.prev).toBeNull();
        expect(result.next).toBeNull();
    });

    it('throws 404 via sveltekit error helper when post cannot be loaded', async () => {
        await expect(
            runLoad({ params: { slug: 'missing-post' }, data: {} } as PostSlugLoadInput)
        ).rejects.toMatchObject({
            status: 404,
            message: 'Could not find missing-post'
        });

        expect(errorMock).toHaveBeenCalledWith(404, 'Could not find missing-post');
    });

    it('maps relative ogImage to resolved asset url when image exists', async () => {
        vi.doMock('$posts/why-program-needs-unit-testing/index.md', () => ({
            default: () => 'mock component',
            metadata: {
                title: 'Unit Post',
                description: 'desc',
                slug: 'why-program-needs-unit-testing',
                date: '2026-01-01',
                drafted: false,
                featured: false,
                topic: 'dotnet',
                tags: [],
                authors: ['neil'],
                ogImage: './images/why-unit-test-1.jpg'
            }
        }));

        vi.doMock('$posts/why-program-needs-unit-testing/index.md?raw', () => ({
            default: '# Title\n## Section A'
        }));

        const result = await runLoad({
            params: { slug: 'why-program-needs-unit-testing' },
            data: {}
        } as PostSlugLoadInput);

        expect(result.meta.ogImage).toBeTruthy();
        expect(result.meta.ogImage).not.toBe('./images/why-unit-test-1.jpg');
        expect(result.meta.ogImage.startsWith('/')).toBe(true);
    });
});
