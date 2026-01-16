import tagsJson from '$lib/data/tags.json';
import type { Tag } from '$lib/types';

export const TAGS: Tag[] = tagsJson;

/**
 * 根據 slug 取得標籤名稱
 */
export function getTagName(slug: string): string {
    return TAGS.find((t) => t.slug === slug)?.name || slug;
}
