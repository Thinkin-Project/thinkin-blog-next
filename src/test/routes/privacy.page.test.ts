import { beforeEach, describe, expect, it, vi } from 'vitest';

const errorMock = vi.hoisted(() =>
    vi.fn((status: number, message: string) => {
        throw Object.assign(new Error(message), { status, message });
    })
);

vi.mock('@sveltejs/kit', () => ({
    error: errorMock
}));

type PrivacyLoadInput = Parameters<(typeof import('../../routes/privacy/+page'))['load']>[0];
type PrivacyLoadOutput = Exclude<
    Awaited<ReturnType<(typeof import('../../routes/privacy/+page'))['load']>>,
    void
>;

async function runLoad(input: PrivacyLoadInput): Promise<PrivacyLoadOutput> {
    const { load } = await import('../../routes/privacy/+page');
    const result = await load(input);
    expect(result).toBeDefined();
    return result as PrivacyLoadOutput;
}

describe('privacy page load', () => {
    beforeEach(() => {
        vi.resetModules();
        errorMock.mockClear();
        vi.spyOn(console, 'error').mockImplementation(() => undefined);
    });

    it('returns fallback metadata when markdown metadata is missing', async () => {
        vi.doMock('$content/privacy.md', () => ({
            default: () => 'privacy component',
            metadata: {}
        }));

        const result = await runLoad({} as PrivacyLoadInput);

        expect(result.meta.title).toBe('隱私權保護政策');
        expect(result.meta.description).toBe('Thinkin Markdown 的隱私權保護政策');
        expect(result.meta.slug).toBe('privacy');
    });

    it('throws 404 via sveltekit error helper when markdown import fails', async () => {
        vi.doMock('$content/privacy.md', () => {
            throw new Error('privacy not found');
        });

        await expect(runLoad({} as PrivacyLoadInput)).rejects.toMatchObject({
            status: 404,
            message: 'Could not find privacy policy'
        });

        expect(errorMock).toHaveBeenCalledWith(404, 'Could not find privacy policy');
    });
});
