import topicsJson from '$posts/_metadata/topics.json';

import type { Topic } from '$lib/types';

export const TOPICS: Topic[] = topicsJson;

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
    return TOPICS.find((t) => t.name === name)?.slug || name;
}
