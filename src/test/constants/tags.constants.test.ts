import { beforeEach, describe, expect, it, vi } from 'vitest';

async function loadTags() {
    vi.resetModules();
    vi.doMock('$posts/_metadata/tags.json', () => ({
        default: [
            { slug: 'csharp', name: 'C#', aliases: [] },
            { slug: 'dotnet', name: '.NET', aliases: [] }
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

        expect(first.aliases).toEqual([]);
        expect(getTagName(first.slug)).toBe(first.name);
        expect(getTagName('__unknown_tag__')).toBe('__unknown_tag__');
    });

    it('maps tag slug or display name to canonical slug and falls back when missing', async () => {
        const { TAGS, getTagSlug, resolveTagSlug } = await loadTags();
        const first = TAGS[1];

        expect(getTagSlug(first.slug)).toBe(first.slug);
        expect(getTagSlug(first.name)).toBe(first.slug);
        expect(getTagSlug(first.name.toLowerCase())).toBe(first.slug);
        expect(resolveTagSlug('  .net  ')).toBe(first.slug);
        expect(resolveTagSlug('DOTNET')).toBe(first.slug);
        expect(resolveTagSlug('__unknown_tag_name__')).toBeUndefined();
        expect(getTagSlug('__unknown_tag_name__')).toBe('__unknown_tag_name__');
    });
});
