import { House, Newspaper, Mail } from 'lucide-svelte';
import type { NavItem, SocialLink } from '$lib/types';

export const NAV_ITEMS: NavItem[] = [
    { name: '首頁', href: '/', icon: House },
    { name: '文章', href: '/posts', icon: Newspaper },
    { name: '聯絡我們', href: '/contact', icon: Mail }
];

export const SOCIAL_LINKS: SocialLink[] = [];
