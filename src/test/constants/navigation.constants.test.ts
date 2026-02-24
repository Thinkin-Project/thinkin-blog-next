import { beforeEach, describe, expect, it, vi } from 'vitest';

async function loadNavigation() {
    vi.resetModules();
    vi.doMock('lucide-svelte', () => ({
        House: 'House',
        Newspaper: 'Newspaper',
        Shield: 'Shield',
        Rss: 'Rss'
    }));

    return import('../../lib/constants/navigation');
}

describe('navigation constants', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it('contains required navigation routes', async () => {
        const { NAV_ITEMS } = await loadNavigation();
        const hrefs = NAV_ITEMS.map((item) => item.href);

        expect(hrefs).toContain('/');
        expect(hrefs).toContain('/posts');
        expect(hrefs).toContain('/privacy');
        expect(hrefs).toContain('/rss.xml');
    });

    it('keeps social links as an array', async () => {
        const { SOCIAL_LINKS } = await loadNavigation();
        expect(Array.isArray(SOCIAL_LINKS)).toBe(true);
    });
});
