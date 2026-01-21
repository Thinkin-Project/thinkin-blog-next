import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    try {
        const post = await import('$content/privacy.md');
        const meta = post.metadata || {};

        return {
            content: post.default,
            meta: {
                title: meta.title || '隱私權保護政策',
                description: meta.description || 'Thinkin Markdown 的隱私權保護政策',
                slug: 'privacy', // Optional: for OG URL if needed
                ...meta
            }
        };
    } catch (err) {
        console.error('Error loading privacy page:', err);
        error(404, 'Could not find privacy policy');
    }
};
