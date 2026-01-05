import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { escapeSvelte, mdsvex } from 'mdsvex';
import rehypeSlug from 'rehype-slug';
import remarkToc from 'remark-toc';
import { createHighlighter } from 'shiki';

// 快取 highlighter 實例
let highlighter;

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
    extensions: ['.md'],
    rehypePlugins: [rehypeSlug],
    remarkPlugins: [remarkToc],
    highlight: {
        highlighter: async (code, lang = 'text') => {
            if (!highlighter) {
                highlighter = await createHighlighter({
                    themes: ['github-dark'],
                    langs: [
                        'javascript',
                        'typescript',
                        'svelte',
                        'css',
                        'html',
                        'json',
                        'bash',
                        'markdown',
                        'csharp'
                    ]
                });
            }
            const html = highlighter.codeToHtml(code, { lang, theme: 'github-dark' });
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
        adapter: adapter()
    }
};

export default config;
