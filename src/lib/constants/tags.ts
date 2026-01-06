import type { Tag } from '$lib/types';

export const TAGS: Tag[] = [
    { name: '創建型模式', slug: 'creational-pattern' },
    { name: 'SOLID 原則', slug: 'solid' },
    { name: 'Chrome 擴充功能', slug: 'chrome-extension' },
    { name: 'JMeter', slug: 'jmeter' },
    { name: 'BlazeMeter', slug: 'blazemeter' },
    { name: '壓力測試', slug: 'stress-test' },
    { name: '單元測試', slug: 'unit-test' }
];

/**
 * 根據 slug 取得標籤名稱
 */
export function getTagName(slug: string): string {
    return TAGS.find((t) => t.slug === slug)?.name || slug;
}
