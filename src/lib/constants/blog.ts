/**
 * 部落格相關設定
 */
export const BLOG_CONFIG = {
    // 部落格名稱
    name: 'Thinkin Markdown',
    // 部落格描述
    description: '一個專注於記錄軟體開發經驗與知識，強調實用收穫與開放分享的部落格。',
    // 部落格網址
    url: 'https://www.thinkinmd.com',
    // 預設作者
    author: 'Neil Tsai',
    // 預設關鍵字
    keywords: '軟體開發, 工程實踐, 技術分享, 持續學習',
    // 預設 OG 圖片
    ogImage: '/assets/og-image.jpg',
    // 置頂文章顯示數量限制
    featuredPostsLimit: 3,
    // 最新文章顯示數量限制
    newPostsLimit: 10,
    // 每頁顯示文章數量
    postsPerPage: 10,
    // 贊助連結
    donations: [
        {
            platform: 'Ko-fi',
            url: 'https://ko-fi.com/thinkinmd',
            image: 'https://storage.ko-fi.com/cdn/kofi3.png?v=3'
        }
    ]
};
