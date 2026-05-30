import { browser } from '$app/environment';

import {
    type Theme,
    applyThemeDocumentClass,
    resolveInitialTheme,
    syncThemePreference
} from '$lib/utils/theme';

import { STORAGE_KEYS, readStorage, stringStorage } from '../utils/storage';

class ThemeState {
    #currentTheme = $state<Theme>('dark');

    constructor() {
        if (browser) {
            const storedTheme = readStorage(
                localStorage,
                STORAGE_KEYS.theme,
                stringStorage.parse
            ) as Theme | null;
            this.#currentTheme = resolveInitialTheme(
                storedTheme,
                window.matchMedia('(prefers-color-scheme: light)').matches
            );

            // Initial sync
            this.#updateDocument(this.#currentTheme);

            // Listen for system changes if no manual override exists
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!readStorage(localStorage, STORAGE_KEYS.theme, stringStorage.parse)) {
                    this.setTheme(e.matches ? 'dark' : 'light', false);
                }
            });
        }
    }

    get current() {
        return this.#currentTheme;
    }

    setTheme(theme: Theme, persist = true) {
        this.#currentTheme = theme;
        if (browser) {
            this.#updateDocument(theme);
            syncThemePreference(localStorage, STORAGE_KEYS.theme, theme, persist);
        }
    }

    toggle() {
        this.setTheme(this.#currentTheme === 'dark' ? 'light' : 'dark');
    }

    #updateDocument(theme: Theme) {
        if (browser) {
            applyThemeDocumentClass(document.documentElement, theme, requestAnimationFrame);
        }
    }
}

export const themeState = new ThemeState();
