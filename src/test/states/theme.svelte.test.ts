import { beforeEach, describe, expect, it, vi } from 'vitest';

import { STORAGE_KEYS, stringStorage, writeStorage } from '../../lib/utils/storage';

vi.mock('$lib/utils/theme', async () => {
    const actual = await import('../../lib/utils/theme');
    return actual;
});

type FakeClassList = {
    add: (...tokens: string[]) => void;
    remove: (...tokens: string[]) => void;
    contains: (token: string) => boolean;
};

function createFakeClassList(): FakeClassList {
    const set = new Set<string>();
    return {
        add: (...tokens: string[]) => tokens.forEach((token) => set.add(token)),
        remove: (...tokens: string[]) => tokens.forEach((token) => set.delete(token)),
        contains: (token: string) => set.has(token)
    };
}

function createStorage() {
    const map = new Map<string, string>();
    return {
        getItem: (key: string) => map.get(key) ?? null,
        setItem: (key: string, value: string) => map.set(key, value),
        removeItem: (key: string) => map.delete(key),
        clear: () => map.clear()
    };
}

describe('themeState', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it('initializes from stored theme and updates document class', async () => {
        const classList = createFakeClassList();
        const localStorage = createStorage();
        writeStorage(localStorage, STORAGE_KEYS.theme, 'light', stringStorage.serialize);

        const addEventListener = vi.fn();
        const matchMedia = vi.fn((query: string) => ({
            matches: query.includes('light'),
            media: query,
            onchange: null,
            addEventListener,
            removeEventListener: vi.fn(),
            addListener: vi.fn(),
            removeListener: vi.fn(),
            dispatchEvent: vi.fn()
        }));

        Object.defineProperty(globalThis, 'document', {
            configurable: true,
            value: { documentElement: { classList } }
        });
        Object.defineProperty(globalThis, 'window', {
            configurable: true,
            value: { matchMedia }
        });
        Object.defineProperty(globalThis, 'localStorage', {
            configurable: true,
            value: localStorage
        });
        Object.defineProperty(globalThis, 'requestAnimationFrame', {
            configurable: true,
            value: (callback: FrameRequestCallback) => {
                callback(0);
                return 1;
            }
        });

        vi.doMock('$app/environment', () => ({ browser: true, dev: false }));

        const { themeState } = await import('../../lib/states/theme.svelte.ts');

        expect(themeState.current).toBe('light');
        expect(classList.contains('dark')).toBe(false);
        expect(addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('follows system change when no persisted theme and toggle persists selection', async () => {
        const classList = createFakeClassList();
        const localStorage = createStorage();
        let darkChangeHandler: ((event: { matches: boolean }) => void) | undefined;

        const matchMedia = vi.fn((query: string) => ({
            matches: query.includes('light'),
            media: query,
            onchange: null,
            addEventListener: vi.fn((event: string, handler: (e: { matches: boolean }) => void) => {
                if (query.includes('dark') && event === 'change') {
                    darkChangeHandler = handler;
                }
            }),
            removeEventListener: vi.fn(),
            addListener: vi.fn(),
            removeListener: vi.fn(),
            dispatchEvent: vi.fn()
        }));

        Object.defineProperty(globalThis, 'document', {
            configurable: true,
            value: { documentElement: { classList } }
        });
        Object.defineProperty(globalThis, 'window', {
            configurable: true,
            value: { matchMedia }
        });
        Object.defineProperty(globalThis, 'localStorage', {
            configurable: true,
            value: localStorage
        });
        Object.defineProperty(globalThis, 'requestAnimationFrame', {
            configurable: true,
            value: (callback: FrameRequestCallback) => {
                callback(0);
                return 1;
            }
        });

        vi.doMock('$app/environment', () => ({ browser: true, dev: false }));

        const { themeState } = await import('../../lib/states/theme.svelte.ts');

        expect(themeState.current).toBe('light');

        darkChangeHandler?.({ matches: true });
        expect(themeState.current).toBe('dark');
        expect(localStorage.getItem(STORAGE_KEYS.theme)).toBeNull();

        themeState.toggle();
        expect(themeState.current).toBe('light');
        expect(localStorage.getItem(STORAGE_KEYS.theme)).toBe('light');
    });
});
