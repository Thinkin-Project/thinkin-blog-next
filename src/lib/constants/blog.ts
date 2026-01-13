import { env } from '$env/dynamic/public';

/**
 * 部落格相關設定
 */
export const BLOG_CONFIG = {
    // 部落格名稱
    name: env.PUBLIC_BLOG_NAME || 'Thinkin Markdown',
    // 部落格描述
    description:
        env.PUBLIC_BLOG_DESCRIPTION ||
        '一個專注於記錄軟體開發經驗與知識，強調實用收穫與開放分享的部落格。',
    // 部落格網址
    url: env.PUBLIC_BLOG_URL || 'https://www.thinkinmd.com',
    // 預設作者
    author: env.PUBLIC_BLOG_AUTHOR || 'Neil Tsai',
    // 預設關鍵字
    keywords: env.PUBLIC_BLOG_KEYWORDS || '軟體開發, 工程實踐, 技術分享, 持續學習',
    // 預設語言
    lang: env.PUBLIC_BLOG_LANG || 'zh-Hant',
    // 預設 OG 圖片
    ogImage: env.PUBLIC_BLOG_OG_IMAGE || '/assets/og-image.jpg',
    // 置頂文章顯示數量限制
    featuredPostsLimit: Number(env.PUBLIC_FEATURED_POSTS_LIMIT) || 3,
    // 最新文章顯示數量限制
    newPostsLimit: Number(env.PUBLIC_NEW_POSTS_LIMIT) || 10,
    // 每頁顯示文章數量
    postsPerPage: Number(env.PUBLIC_POSTS_PER_PAGE) || 10,
    // 贊助連結
    donations: [
        {
            platform: 'Ko-fi',
            url: 'https://ko-fi.com/thinkinmd',
            image: 'https://storage.ko-fi.com/cdn/kofi3.png?v=3'
        }
    ],
    // Giscus 留言系統設定
    giscus: {
        repo: env.PUBLIC_GISCUS_REPO || '',
        repoId: env.PUBLIC_GISCUS_REPO_ID || '',
        category: env.PUBLIC_GISCUS_CATEGORY || 'Announcements',
        categoryId: env.PUBLIC_GISCUS_CATEGORY_ID || '',
        mapping: env.PUBLIC_GISCUS_MAPPING || 'title',
        strict: env.PUBLIC_GISCUS_STRICT || '0',
        reactionsEnabled: env.PUBLIC_GISCUS_REACTIONS_ENABLED || '1',
        emitMetadata: env.PUBLIC_GISCUS_EMIT_METADATA || '0',
        inputPosition: env.PUBLIC_GISCUS_INPUT_POSITION || 'top',
        theme: env.PUBLIC_GISCUS_THEME || 'dark',
        lang: env.PUBLIC_BLOG_LANG || 'zh-Hant',
        loading: env.PUBLIC_GISCUS_LOADING || 'lazy'
    }
};
