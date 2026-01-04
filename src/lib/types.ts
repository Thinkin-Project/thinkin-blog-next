import type { Component } from 'svelte';

/**
 * 作者資訊結構
 */
export interface Author {
    id: string; // 唯一識別碼
    name: string; // 作者名稱
    avatar: string; // 頭像 URL
    bio: string; // 作者簡介
    website?: string; // 個人網站
    twitter?: string; // Twitter 連結
    github?: string; // GitHub 連結
}

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
    authors?: string[]; // 作者 ID 陣列
}

/**
 * 完整文章資料結構
 */
export interface Article extends ArticleMeta {
    content: Component; // mdsvex 編譯後的組件
}
