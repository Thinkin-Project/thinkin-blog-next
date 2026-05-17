import tagsJson from '$posts/_metadata/tags.json';

import type { Tag } from '$lib/types';

export const TAGS: Tag[] = tagsJson as Tag[];

function normalizeValue(value: string): string {
    return value.trim().toLowerCase();
}

function findTag(input: string): Tag | undefined {
    const normalizedInput = normalizeValue(input);

    return TAGS.find((tag) => {
        if (normalizeValue(tag.slug) === normalizedInput) {
            return true;
        }

        if (normalizeValue(tag.name) === normalizedInput) {
            return true;
        }

        return tag.aliases.some((alias) => normalizeValue(alias) === normalizedInput);
    });
}

/**
 * 根據 slug 取得標籤名稱
 */
export function getTagName(slug: string): string {
    return TAGS.find((t) => t.slug === slug)?.name || slug;
}

export function getTagSlug(name: string): string {
    return findTag(name)?.slug || name;
}

export function resolveTagSlug(input: string): string | undefined {
    return findTag(input)?.slug;
}
