import { beforeEach, describe, expect, it, vi } from 'vitest';

async function loadTopics() {
    vi.resetModules();
    vi.doMock('$posts/_metadata/topics.json', () => ({
        default: [
            { slug: 'dotnet', name: '.NET', aliases: [] },
            { slug: 'devops', name: 'DevOps', aliases: [] }
        ]
    }));

    return import('../../lib/constants/topics');
}

describe('topics constants', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it('maps topic slug to name and falls back to slug when missing', async () => {
        const { TOPICS, getTopicName } = await loadTopics();
        const first = TOPICS[0];

        expect(first.aliases).toEqual([]);
        expect(getTopicName(first.slug)).toBe(first.name);
        expect(getTopicName('__unknown_topic__')).toBe('__unknown_topic__');
    });

    it('maps topic slug or display name to canonical slug and falls back when missing', async () => {
        const { TOPICS, getTopicSlug, resolveTopicSlug } = await loadTopics();
        const first = TOPICS[0];

        expect(getTopicSlug(first.slug)).toBe(first.slug);
        expect(getTopicSlug(first.name)).toBe(first.slug);
        expect(getTopicSlug(first.name.toLowerCase())).toBe(first.slug);
        expect(resolveTopicSlug('  .net  ')).toBe(first.slug);
        expect(resolveTopicSlug('DOTNET')).toBe(first.slug);
        expect(resolveTopicSlug('__unknown_topic_name__')).toBeUndefined();
        expect(getTopicSlug('__unknown_topic_name__')).toBe('__unknown_topic_name__');
    });
});
