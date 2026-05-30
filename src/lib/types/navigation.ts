import type { Icon } from 'lucide-svelte';

/**
 * 導覽列項目
 */
export interface NavItem {
    name: string;
    href: string;
    icon: typeof Icon;
}

/**
 * 社群連結項目
 */
export interface SocialLink {
    name: string;
    url: string;
}
