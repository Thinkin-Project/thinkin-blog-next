import { Folders, House, Newspaper, Rss, Shield, Tags } from '@lucide/svelte';

import type { NavItem, SocialLink } from '$lib/types';

export const NAV_ITEMS: NavItem[] = [
    { name: '首頁', href: '/', icon: House },
    { name: '文章', href: '/posts', icon: Newspaper },
    { name: '主題', href: '/topics', icon: Folders },
    { name: '標籤', href: '/tags', icon: Tags },
    { name: '隱私權政策', href: '/privacy', icon: Shield },
    { name: 'RSS', href: '/rss.xml', icon: Rss }
];

export const SOCIAL_LINKS: SocialLink[] = [];
