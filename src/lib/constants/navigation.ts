import { House, Newspaper, Rss } from 'lucide-svelte';

import type { NavItem, SocialLink } from '$lib/types';

export const NAV_ITEMS: NavItem[] = [
    { name: '首頁', href: '/', icon: House },
    { name: '文章', href: '/posts', icon: Newspaper },
    { name: 'RSS', href: '/rss.xml', icon: Rss }
];

export const SOCIAL_LINKS: SocialLink[] = [];
