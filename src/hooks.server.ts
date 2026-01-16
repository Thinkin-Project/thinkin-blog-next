import { dev } from '$app/environment';

import { BLOG_CONFIG } from '$lib/constants/blog';

export async function handle({ event, resolve }) {
    if (dev && event.url.pathname === '/.well-known/appspecific/com.chrome.devtools.json') {
        return new Response(undefined, { status: 404 });
    }

    const response = await resolve(event, {
        transformPageChunk: ({ html }) => html.replace('%lang%', BLOG_CONFIG.lang)
    });

    // Security Headers
    const securityHeaders = {
        'Content-Security-Policy': [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://giscus.app",
            "style-src 'self' 'unsafe-inline' https://giscus.app https://fonts.googleapis.com",
            "img-src 'self' data: https://storage.ko-fi.com https://ko-fi.com",
            "frame-src 'self' https://giscus.app",
            "connect-src 'self' https://giscus.app",
            "font-src 'self' data: https://fonts.gstatic.com",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
            'upgrade-insecure-requests'
        ].join('; '),
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
    };

    Object.entries(securityHeaders).forEach(([header, value]) => {
        response.headers.set(header, value);
    });

    return response;
}
