import type { Topic } from '$lib/types';

export const TOPICS: Topic[] = [
    { name: '設計模式', slug: 'design-pattern' },
    { name: '物件導向設計原則', slug: 'object-oriented-design-principles' },
    { name: '瀏覽器擴充功能', slug: 'browser-extension' },
    { name: '測試', slug: 'test' },
    { name: '命令列', slug: 'command-line' },
    { name: 'Visual Studio', slug: 'visual-studio' },
    { name: 'Oracle', slug: 'oracle' },
    { name: 'IIS', slug: 'iis' },
    { name: 'API 設計模式', slug: 'api-design-pattern' },
    { name: '.NET Standard', slug: 'net-standard' },
    { name: '.NET Core', slug: 'net-core' },
    { name: '.NET', slug: 'net' },
];

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
