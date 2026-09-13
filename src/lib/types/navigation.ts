import type { LucideIcon } from '@lucide/svelte';

/**
 * 導覽列項目
 */
export interface NavItem {
    name: string;
    href: string;
    icon: LucideIcon;
}

/**
 * 社群連結項目
 */
export interface SocialLink {
    name: string;
    url: string;
}
