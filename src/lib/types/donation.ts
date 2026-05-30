import type { Icon } from 'lucide-svelte';

/**
 * 贊助連結項目
 */
export interface DonationLink {
    platform: string; // 平台名稱 (例如: 'Ko-fi')
    url: string; // 贊助連結
    icon?: typeof Icon; // 可選：指定圖示 (預設使用 Coffee)
    image?: string; // 可選：圖片 URL (例如 Ko-fi 的 badge 圖片)
}
