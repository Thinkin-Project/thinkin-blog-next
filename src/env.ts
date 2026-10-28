import { defineEnvVars } from '@sveltejs/kit/env';

// 所有變數皆為選填，缺值時由 BLOG_CONFIG 提供預設值
const optionalPublic = {
    public: true,
    static: true,
    schema: (value: string | undefined) => value
} as const;

export const variables = defineEnvVars({
    PUBLIC_BLOG_NAME: optionalPublic,
    PUBLIC_BLOG_DESCRIPTION: optionalPublic,
    PUBLIC_BLOG_URL: optionalPublic,
    PUBLIC_BLOG_AUTHOR: optionalPublic,
    PUBLIC_BLOG_KEYWORDS: optionalPublic,
    PUBLIC_BLOG_LANG: optionalPublic,
    PUBLIC_BLOG_OG_IMAGE: optionalPublic,
    PUBLIC_FEATURED_POSTS_LIMIT: optionalPublic,
    PUBLIC_NEW_POSTS_LIMIT: optionalPublic,
    PUBLIC_POSTS_PER_PAGE: optionalPublic,
    PUBLIC_RELATED_POSTS_LIMIT: optionalPublic,
    PUBLIC_GISCUS_REPO: optionalPublic,
    PUBLIC_GISCUS_REPO_ID: optionalPublic,
    PUBLIC_GISCUS_CATEGORY: optionalPublic,
    PUBLIC_GISCUS_CATEGORY_ID: optionalPublic,
    PUBLIC_GISCUS_MAPPING: optionalPublic,
    PUBLIC_GISCUS_STRICT: optionalPublic,
    PUBLIC_GISCUS_REACTIONS_ENABLED: optionalPublic,
    PUBLIC_GISCUS_EMIT_METADATA: optionalPublic,
    PUBLIC_GISCUS_INPUT_POSITION: optionalPublic,
    PUBLIC_GISCUS_THEME: optionalPublic,
    PUBLIC_GISCUS_LOADING: optionalPublic
});
