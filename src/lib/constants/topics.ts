import topicsJson from '$posts/_metadata/topics.json';

import type { Topic } from '$lib/types';

export const TOPICS: Topic[] = topicsJson as Topic[];

function normalizeValue(value: string): string {
    return value.trim().toLowerCase();
}

function findTopic(input: string): Topic | undefined {
    const normalizedInput = normalizeValue(input);

    return TOPICS.find((topic) => {
        if (normalizeValue(topic.slug) === normalizedInput) {
            return true;
        }

        if (normalizeValue(topic.name) === normalizedInput) {
            return true;
        }

        return topic.aliases.some((alias) => normalizeValue(alias) === normalizedInput);
    });
}

/**
 * 根據 slug 取得主題名稱
 */
export function getTopicName(slug: string): string {
    return TOPICS.find((t) => t.slug === slug)?.name || slug;
}

/**
 * 根據名稱取得主題 slug
 */
export function getTopicSlug(name: string): string {
    return findTopic(name)?.slug || name;
}

export function resolveTopicSlug(input: string): string | undefined {
    return findTopic(input)?.slug;
}
