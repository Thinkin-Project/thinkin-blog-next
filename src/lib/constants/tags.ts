import type { Tag } from '$lib/types';

export const TAGS: Tag[] = [
    { name: '創建型模式', slug: 'creational-pattern' },
    { name: 'SOLID 原則', slug: 'solid' }
];

/**
 * 根據 slug 取得標籤名稱
 */
export function getTagName(slug: string): string {
    return TAGS.find((t) => t.slug === slug)?.name || slug;
}
