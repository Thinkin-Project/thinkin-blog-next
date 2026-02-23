import { afterEach, vi } from 'vitest';

export function setupBrowserMocks() {
    if (typeof window === 'undefined') {
        return;
    }

    if (!window.matchMedia) {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: (query: string) => ({
                matches: false,
                media: query,
                onchange: null,
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                addListener: vi.fn(),
                removeListener: vi.fn(),
                dispatchEvent: vi.fn()
            })
        });
    }

    if (!window.localStorage) {
        const storage = new Map<string, string>();
        Object.defineProperty(window, 'localStorage', {
            writable: true,
            value: {
                getItem: (key: string) => storage.get(key) ?? null,
                setItem: (key: string, value: string) => storage.set(key, value),
                removeItem: (key: string) => storage.delete(key),
                clear: () => storage.clear(),
                key: (index: number) => Array.from(storage.keys())[index] ?? null,
                get length() {
                    return storage.size;
                }
            }
        });
    }

    if (!window.requestAnimationFrame) {
        Object.defineProperty(window, 'requestAnimationFrame', {
            writable: true,
            value: (callback: FrameRequestCallback) => setTimeout(() => callback(Date.now()), 16)
        });
    }
}

setupBrowserMocks();

afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
});
