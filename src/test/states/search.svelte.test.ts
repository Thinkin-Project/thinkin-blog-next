import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('searchState', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it('toggles isOpen state', async () => {
        const { searchState } = await import('../../lib/search.svelte.ts');

        expect(searchState.isOpen).toBe(false);
        searchState.toggle();
        expect(searchState.isOpen).toBe(true);
        searchState.toggle();
        expect(searchState.isOpen).toBe(false);
    });

    it('opens and closes explicitly', async () => {
        const { searchState } = await import('../../lib/search.svelte.ts');

        searchState.open();
        expect(searchState.isOpen).toBe(true);

        searchState.close();
        expect(searchState.isOpen).toBe(false);
    });
});
