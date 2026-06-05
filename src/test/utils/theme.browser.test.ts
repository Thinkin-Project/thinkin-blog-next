import { describe, expect, it, vi } from 'vitest';

import {
    STORAGE_KEYS,
    booleanStorage,
    readStorage,
    stringStorage,
    writeStorage
} from '../../lib/utils/storage';
import {
    type Theme,
    applyThemeDocumentClass,
    resolveInitialTheme,
    syncThemePreference
} from '../../lib/utils/theme';

describe('theme utils', () => {
    it('resolves initial theme from stored preference or system preference', () => {
        expect(resolveInitialTheme('dark', true)).toBe('dark');
        expect(resolveInitialTheme('light', false)).toBe('light');
        expect(resolveInitialTheme(null, true)).toBe('light');
        expect(resolveInitialTheme(null, false)).toBe('dark');
    });

    it('syncs persisted theme into storage', () => {
        const setItem = vi.fn();
        const removeItem = vi.fn();

        syncThemePreference({ setItem, removeItem }, STORAGE_KEYS.theme, 'light', true);

        expect(setItem).toHaveBeenCalledWith(STORAGE_KEYS.theme, 'light');
        expect(removeItem).not.toHaveBeenCalled();
    });

    it('reads and writes boolean storage via codec', () => {
        const map = new Map<string, string>();
        const storage = {
            getItem: (key: string) => map.get(key) ?? null,
            setItem: (key: string, value: string) => map.set(key, value),
            removeItem: (key: string) => map.delete(key)
        };

        writeStorage(storage, STORAGE_KEYS.sidebarCollapsed, true, booleanStorage.serialize);

        expect(readStorage(storage, STORAGE_KEYS.sidebarCollapsed, booleanStorage.parse)).toBe(
            true
        );
        expect(readStorage(storage, STORAGE_KEYS.theme, stringStorage.parse)).toBeNull();
    });

    it('parses false and invalid values correctly via boolean codec', () => {
        const map = new Map<string, string>();
        const storage = {
            getItem: (key: string) => map.get(key) ?? null,
            setItem: (key: string, value: string) => map.set(key, value),
            removeItem: (key: string) => map.delete(key)
        };

        writeStorage(storage, STORAGE_KEYS.sidebarCollapsed, false, booleanStorage.serialize);
        expect(readStorage(storage, STORAGE_KEYS.sidebarCollapsed, booleanStorage.parse)).toBe(
            false
        );

        storage.setItem(STORAGE_KEYS.sidebarCollapsed, 'invalid');
        expect(
            readStorage(storage, STORAGE_KEYS.sidebarCollapsed, booleanStorage.parse)
        ).toBeNull();
    });

    it('removes item from storage when writing null value', () => {
        const map = new Map<string, string>();
        const storage = {
            getItem: (key: string) => map.get(key) ?? null,
            setItem: (key: string, value: string) => map.set(key, value),
            removeItem: (key: string) => map.delete(key)
        };

        storage.setItem(STORAGE_KEYS.sidebarCollapsed, 'true');
        writeStorage(storage, STORAGE_KEYS.sidebarCollapsed, null, booleanStorage.serialize);
        expect(storage.getItem(STORAGE_KEYS.sidebarCollapsed)).toBeNull();
    });

    it('removes persisted key when persist=false', () => {
        const setItem = vi.fn();
        const removeItem = vi.fn();

        syncThemePreference({ setItem, removeItem }, STORAGE_KEYS.theme, 'dark', false);

        expect(setItem).not.toHaveBeenCalled();
        expect(removeItem).toHaveBeenCalledWith(STORAGE_KEYS.theme);
    });

    it('applies dark/light class and removes no-transitions after two raf ticks', () => {
        const element = document.createElement('html');
        const rafQueue: FrameRequestCallback[] = [];
        const raf = vi.fn((callback: FrameRequestCallback) => {
            rafQueue.push(callback);
            return rafQueue.length;
        });

        applyThemeDocumentClass(element, 'dark' as Theme, raf);

        expect(element.classList.contains('dark')).toBe(true);
        expect(element.classList.contains('no-transitions')).toBe(true);

        const first = rafQueue.shift();
        first?.(0);
        const second = rafQueue.shift();
        second?.(0);

        expect(element.classList.contains('no-transitions')).toBe(false);

        applyThemeDocumentClass(element, 'light' as Theme, raf);
        expect(element.classList.contains('dark')).toBe(false);
    });
});
