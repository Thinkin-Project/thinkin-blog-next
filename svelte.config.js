import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { escapeSvelte, mdsvex } from 'mdsvex';
import mdsvexRelativeImages from 'mdsvex-relative-images';
import rehypeSlug from 'rehype-slug';
import remarkToc from 'remark-toc';
import { createHighlighter } from 'shiki';

// 快取 highlighter 實例的 Promise，避免並行處理時多次建立
let highlighterPromise;

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
    extensions: ['.md'],
    rehypePlugins: [rehypeSlug],
    remarkPlugins: [
        mdsvexRelativeImages,
        remarkToc,
        // 自定義插件處理圖片優化 (Lazy Loading & Zoomable class)
        () => {
            return (tree) => {
                const visit = (node) => {
                    if (node.type === 'image') {
                        node.data = node.data || {};
                        node.data.hProperties = node.data.hProperties || {};
                        node.data.hProperties.loading = 'lazy';
                        node.data.hProperties.decoding = 'async';
                        // 添加識別用的 class，方便後續燈箱攔截
                        node.data.hProperties.class = 'zoomable-image';
                    }
                    if (node.children) node.children.forEach(visit);
                };
                visit(tree);
            };
        },
        // 自定義插件計算閱讀時間
        () => {
            return (tree, { data }) => {
                // 註：在 svelte.config.js 中 import 外部套件有時會有問題
                // 這裡透過遍歷 tree 來提取純文字進而計算閱讀時間
                let text = '';
                const visit = (node) => {
                    if (node.type === 'text') text += node.value;
                    if (node.children) node.children.forEach(visit);
                };
                visit(tree);

                // 計算閱讀時間 (簡單實作)
                const chineseCount = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
                const englishCount = text.split(/\s+/).filter((w) => w.length > 0).length;
                const readingTime = Math.ceil(chineseCount / 300 + englishCount / 200);

                data.fm = data.fm || {};
                data.fm.readingTime = readingTime > 0 ? readingTime : 1;
            };
        }
    ],
    highlight: {
        highlighter: async (code, lang = 'text') => {
            if (!highlighterPromise) {
                highlighterPromise = createHighlighter({
                    themes: ['github-dark', 'github-light'],
                    langs: [
                        'javascript',
                        'typescript',
                        'svelte',
                        'css',
                        'html',
                        'json',
                        'bash',
                        'markdown',
                        'csharp',
                        'powershell',
                        'yaml'
                    ]
                });
            }
            const highlighter = await highlighterPromise;
            const html = highlighter.codeToHtml(code, {
                lang,
                themes: {
                    light: 'github-light',
                    dark: 'github-dark'
                }
            });
            return `{@html \`${escapeSvelte(html)}\`}`;
        }
    }
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
    extensions: ['.svelte', '.md'],
    // Consult https://svelte.dev/docs/kit/integrations
    // for more information about preprocessors
    preprocess: [mdsvex(mdsvexOptions), vitePreprocess()],

    kit: {
        // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
        // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
        // See https://svelte.dev/docs/kit/adapters for more information about adapters.
        adapter: adapter(),
        alias: {
            $posts: 'src/posts',
            $content: 'src/content'
        }
    }
};

export default config;
