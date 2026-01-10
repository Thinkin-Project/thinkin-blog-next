import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, data }) => {
    try {
        const post = await import(`../../../posts/${params.slug}.md`);
        const rawContent = await import(`../../../posts/${params.slug}.md?raw`);

        // 提取標題 (h2, h3)
        const headings = rawContent.default
            .split('\n')
            .filter((line: string) => line.startsWith('## ') || line.startsWith('### '))
            .map((line: string) => {
                const level = line.startsWith('### ') ? 3 : 2;
                const title = line.replace(/^#{2,3}\s+/, '').trim();
                // 這裡的 slug 需與 rehype-slug 產生的邏輯一致
                // 移除大部分標點符號，保留中文與英數字，空格轉連字號
                const slug = title
                    .toLowerCase()
                    .replace(/[^\w\s\u4e00-\u9fa5-]/g, '')
                    .trim()
                    .replace(/\s+/g, '-');
                return { level, title, slug };
            });

        return {
            content: post.default,
            meta: post.metadata,
            headings,
            ...data
        };
    } catch (err) {
        console.error(err);
        error(404, `Could not find ${params.slug}`);
    }
};
