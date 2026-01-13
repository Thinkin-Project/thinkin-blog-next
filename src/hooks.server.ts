import { dev } from '$app/environment';

import { BLOG_CONFIG } from '$lib/constants/blog';

export function handle({ event, resolve }) {
    if (dev && event.url.pathname === '/.well-known/appspecific/com.chrome.devtools.json') {
        return new Response(undefined, { status: 404 });
    }

    return resolve(event, {
        transformPageChunk: ({ html }) => html.replace('%lang%', BLOG_CONFIG.lang)
    });
}
