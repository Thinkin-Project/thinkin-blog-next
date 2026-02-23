import { describe, expect, it, vi } from 'vitest';

async function loadHandleModule(dev: boolean) {
    vi.resetModules();
    vi.doMock('$app/environment', () => ({ dev, browser: false }));
    vi.doMock('$lib/constants/blog', () => ({
        BLOG_CONFIG: {
            lang: 'zh-Hant'
        }
    }));

    return import('../../hooks.server');
}

describe('server hook', () => {
    it('returns 404 for chrome devtools metadata request in dev mode', async () => {
        const { handle } = await loadHandleModule(true);
        const resolve = vi.fn();

        const response = await handle({
            event: {
                url: new URL('https://example.com/.well-known/appspecific/com.chrome.devtools.json')
            },
            resolve
        } as never);

        expect(response.status).toBe(404);
        expect(resolve).not.toHaveBeenCalled();
    });

    it('transforms lang placeholder and injects security headers', async () => {
        const { handle } = await loadHandleModule(false);

        const resolve = vi.fn(async (_event, opts) => {
            const html = opts?.transformPageChunk
                ? opts.transformPageChunk({ html: '<html lang="%lang%"></html>' })
                : '<html lang="%lang%"></html>';

            return new Response(html);
        });

        const response = await handle({
            event: {
                url: new URL('https://example.com/posts')
            },
            resolve
        } as never);

        const html = await response.text();

        expect(html).toContain('zh-Hant');
        expect(response.headers.get('Content-Security-Policy')).toContain("default-src 'self'");
        expect(response.headers.get('X-Frame-Options')).toBe('DENY');
        expect(response.headers.get('Strict-Transport-Security')).toContain('max-age=31536000');
    });
});
