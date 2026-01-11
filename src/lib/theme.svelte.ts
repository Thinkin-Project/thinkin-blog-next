import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

class ThemeState {
    #currentTheme = $state<Theme>('dark');

    constructor() {
        if (browser) {
            const storedTheme = localStorage.getItem('theme') as Theme | null;
            if (storedTheme) {
                this.#currentTheme = storedTheme;
            } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                this.#currentTheme = 'light';
            }

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
            if (persist) {
                localStorage.setItem('theme', theme);
            } else {
                localStorage.removeItem('theme');
            }
        }
    }

    toggle() {
        this.setTheme(this.#currentTheme === 'dark' ? 'light' : 'dark');
    }

    #updateDocument(theme: Theme) {
        if (browser) {
            // 防止切換主題時的過渡動畫造成閃爍
            document.documentElement.classList.add('no-transitions');

            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }

            // 強制重繪並移除 class
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    document.documentElement.classList.remove('no-transitions');
                });
            });
        }
    }
}

export const themeState = new ThemeState();
