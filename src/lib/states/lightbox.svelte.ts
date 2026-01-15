/**
 * 文章圖片燈箱的全域狀態 (Svelte 5 Runes)
 */

interface LightboxState {
    isOpen: boolean;
    src: string;
    alt: string;
}

const state = $state<LightboxState>({
    isOpen: false,
    src: '',
    alt: ''
});

/**
 * 開啟燈箱
 * @param src 圖片連結
 * @param alt 圖片描述
 */
export function openLightbox(src: string, alt: string): void {
    state.src = src;
    state.alt = alt;
    state.isOpen = true;
}

/**
 * 關閉燈箱
 */
export function closeLightbox(): void {
    state.isOpen = false;
}

/**
 * 取得燈箱當前狀態
 */
export const lightboxState = state;
