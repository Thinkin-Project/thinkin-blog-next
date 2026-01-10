import type { Component } from 'svelte';

import type { Icon } from 'lucide-svelte';

/**
 * 作者資訊結構
 */
export interface Author {
    id: string; // 唯一識別碼
    name: string; // 作者名稱
    avatar: string; // 頭像 URL
    bio: string; // 作者簡介
    website?: string; // 個人網站
    github?: string; // GitHub 連結
    x?: string; // X (Twitter) 連結
    facebook?: string; // Facebook 連結
    linkedin?: string; // LinkedIn 連結
}

/**
 * 文章的 Frontmatter/Metadata 結構
 */
export interface ArticleMeta {
    title: string; // 文章標題
    description: string; // 文章摘要
    ogImage?: string; // 社群分享圖
    slug: string; // 文章的 URL 唯一識別碼
    date: string; // 發佈日期 (YYYY-MM-DD)
    updated?: string; // 最後更新日期
    drafted: boolean; // 是否為草稿
    featured: boolean; // 是否為推薦文章
    topic: string; // 主題
    tags: string[]; // 標籤陣列
    authors?: string[]; // 作者 ID 陣列
    readingTime?: number; // 預估閱讀時間 (分鐘)
}

/**
 * 完整文章資料結構
 */
export interface Article extends ArticleMeta {
    content: Component; // mdsvex 編譯後的組件
}

/**
 * 導覽列項目
 */
export interface NavItem {
    name: string;
    href: string;
    icon: typeof Icon;
}

/**
 * 社群連結項目
 */
export interface SocialLink {
    name: string;
    url: string;
}
/**
 * 主題結構
 */
export interface Topic {
    name: string;
    slug: string;
}

/**
 * 標籤結構
 */
export interface Tag {
    name: string;
    slug: string;
}
