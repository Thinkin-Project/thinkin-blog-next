import { browser } from '$app/environment';

import {
    type Theme,
    applyThemeDocumentClass,
    resolveInitialTheme,
    syncThemePreference
} from '$lib/utils/theme';

class ThemeState {
    #currentTheme = $state<Theme>('dark');

    constructor() {
        if (browser) {
            const storedTheme = localStorage.getItem('theme') as Theme | null;
            this.#currentTheme = resolveInitialTheme(
                storedTheme,
                window.matchMedia('(prefers-color-scheme: light)').matches
            );

            // Initial sync
            this.#updateDocument(this.#currentTheme);

            // Listen for system changes if no manual override exists
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
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
            syncThemePreference(localStorage, theme, persist);
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
