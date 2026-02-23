import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('lightboxState', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it('opens lightbox with src and alt', async () => {
        const { lightboxState, openLightbox } = await import('../../lib/states/lightbox.svelte.ts');

        openLightbox('/img/a.jpg', 'A image');

        expect(lightboxState.isOpen).toBe(true);
        expect(lightboxState.src).toBe('/img/a.jpg');
        expect(lightboxState.alt).toBe('A image');
    });

    it('closes lightbox while preserving content', async () => {
        const { lightboxState, openLightbox, closeLightbox } =
            await import('../../lib/states/lightbox.svelte.ts');

        openLightbox('/img/b.jpg', 'B image');
        closeLightbox();

        expect(lightboxState.isOpen).toBe(false);
        expect(lightboxState.src).toBe('/img/b.jpg');
        expect(lightboxState.alt).toBe('B image');
    });
});
