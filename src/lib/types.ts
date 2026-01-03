import type { Component } from 'svelte';

/**
 * 文章的 Frontmatter/Metadata 結構
 */
export interface ArticleMeta {
    title: string; // 文章標題
    slug: string; // 文章的 URL 唯一識別碼
    date: string; // 發佈日期 (YYYY-MM-DD)
    updated?: string; // 最後更新日期
    isDraft: boolean; // 是否為草稿
    topic: string; // 主要分類
    tags: string[]; // 標籤陣列
    description: string; // 文章摘要
    ogImage?: string; // 社群分享圖
    featured: boolean; // 是否為推薦文章
}

/**
 * 完整文章資料結構
 */
export interface Article extends ArticleMeta {
    content: Component; // mdsvex 編譯後的組件
}
