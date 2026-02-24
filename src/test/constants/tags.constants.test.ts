import { beforeEach, describe, expect, it, vi } from 'vitest';

async function loadTags() {
    vi.resetModules();
    vi.doMock('$posts/_metadata/tags.json', () => ({
        default: [
            { slug: 'csharp', name: 'C#' },
            { slug: 'dotnet', name: '.NET' }
        ]
    }));

    return import('../../lib/constants/tags');
}

describe('tags constants', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it('maps tag slug to name and falls back to slug when missing', async () => {
        const { TAGS, getTagName } = await loadTags();
        const first = TAGS[0];

        expect(getTagName(first.slug)).toBe(first.name);
        expect(getTagName('__unknown_tag__')).toBe('__unknown_tag__');
    });
});
