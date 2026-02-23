import { describe, expect, it, vi } from 'vitest';

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

        syncThemePreference({ setItem, removeItem }, 'light', true);

        expect(setItem).toHaveBeenCalledWith('theme', 'light');
        expect(removeItem).not.toHaveBeenCalled();
    });

    it('removes persisted key when persist=false', () => {
        const setItem = vi.fn();
        const removeItem = vi.fn();

        syncThemePreference({ setItem, removeItem }, 'dark', false);

        expect(setItem).not.toHaveBeenCalled();
        expect(removeItem).toHaveBeenCalledWith('theme');
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
