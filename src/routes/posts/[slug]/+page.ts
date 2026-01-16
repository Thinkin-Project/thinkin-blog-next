import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, data }) => {
    try {
        const post = await import(`../../../posts/${params.slug}/index.md`);
        const rawContent = await import(`../../../posts/${params.slug}/index.md?raw`);

        // 解析 ogImage 路徑 (如果存在且為相對路徑)
        let ogImageUrl = post.metadata.ogImage;
        if (ogImageUrl && ogImageUrl.startsWith('.')) {
            // 取得所有文章圖片的 URL 映射
            const images = import.meta.glob('/src/posts/**/*.{jpg,jpeg,png,webp,svg,gif}', {
                query: '?url',
                import: 'default',
                eager: true
            });

            // 構建與 import.meta.glob 格式一致的完整路徑
            // 例如 ./hero.jpeg -> /src/posts/slug/hero.jpeg
            const normalizedPath = ogImageUrl.startsWith('./') ? ogImageUrl.slice(2) : ogImageUrl;
            const fullPath = `/src/posts/${params.slug}/${normalizedPath}`;

            if (images[fullPath]) {
                ogImageUrl = images[fullPath] as string;
            }
        }

        // 提取標題 (h2, h3)
        const headings = rawContent.default
            .split('\n')
            .filter((line: string) => line.startsWith('## ') || line.startsWith('### '))
            .map((line: string) => {
                const level = line.startsWith('### ') ? 3 : 2;
                const title = line.replace(/^#{2,3}\s+/, '').trim();
                const slug = title
                    .toLowerCase()
                    .replace(/[^\w\s\u4e00-\u9fa5-]/g, '')
                    .trim()
                    .replace(/\s+/g, '-');
                return { level, title, slug };
            });

        return {
            content: post.default,
            meta: {
                ...post.metadata,
                ogImage: ogImageUrl
            },
            headings,
            ...data
        };
    } catch (err) {
        console.error(err);
        error(404, `Could not find ${params.slug}`);
    }
};
