export type Theme = 'light' | 'dark';

export function resolveInitialTheme(storedTheme: Theme | null, prefersLight: boolean): Theme {
    if (storedTheme) {
        return storedTheme;
    }

    return prefersLight ? 'light' : 'dark';
}

export function syncThemePreference(
    storage: Pick<Storage, 'setItem' | 'removeItem'>,
    theme: Theme,
    persist: boolean
) {
    if (persist) {
        storage.setItem('theme', theme);
        return;
    }

    storage.removeItem('theme');
}

export function applyThemeDocumentClass(
    documentElement: HTMLElement,
    theme: Theme,
    raf: (callback: FrameRequestCallback) => number
) {
    documentElement.classList.add('no-transitions');

    if (theme === 'dark') {
        documentElement.classList.add('dark');
    } else {
        documentElement.classList.remove('dark');
    }

    raf(() => {
        raf(() => {
            documentElement.classList.remove('no-transitions');
        });
    });
}
