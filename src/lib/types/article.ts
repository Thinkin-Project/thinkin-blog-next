/**
 * 文章的 Frontmatter/Metadata 結構
 */
export interface ArticleMeta {
    title: string; // 文章標題
    description: string; // 文章描述
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
