<script lang="ts">
    import { page } from '$app/state';
    import { onMount } from 'svelte';

    import favicon from '$lib/assets/favicon.ico';
    import CookieConsent from '$lib/components/CookieConsent.svelte';
    import GlobalSearch from '$lib/components/GlobalSearch.svelte';
    import ImageLightBox from '$lib/components/ImageLightBox.svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';
    import { setupWebMcpBridge } from '$lib/client/webmcp';
    import { BLOG_CONFIG } from '$lib/constants/blog';

    import './layout.css';

    let { children } = $props();

    const meta = $derived(page.data.meta || {});
    const title = $derived(meta.title ? `${meta.title} | ${BLOG_CONFIG.name}` : BLOG_CONFIG.name);
    const description = $derived(meta.description || BLOG_CONFIG.description);
    const ogImage = $derived.by(() => {
        const imagePath = meta.ogImage || BLOG_CONFIG.ogImage;
        if (!imagePath) return '';

        // 如果已經是絕對網址 (http:// 或 https://)，直接回傳
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }

        // 確保 BLOG_CONFIG.url 與 imagePath 之間只有一個斜線
        const baseUrl = BLOG_CONFIG.url.endsWith('/')
            ? BLOG_CONFIG.url.slice(0, -1)
            : BLOG_CONFIG.url;
        const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

        return `${baseUrl}${normalizedPath}`;
    });
    const ogUrl = $derived.by(() => {
        const baseUrl = BLOG_CONFIG.url.endsWith('/')
            ? BLOG_CONFIG.url.slice(0, -1)
            : BLOG_CONFIG.url;
        if (meta.slug) {
            return `${baseUrl}/posts/${meta.slug}`;
        }
        return `${baseUrl}${page.url.pathname}`;
    });

    onMount(() => setupWebMcpBridge());
</script>

<GlobalSearch />
<CookieConsent />
<ImageLightBox />

<svelte:head>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="author" content={BLOG_CONFIG.author} />
    <meta name="keywords" content={BLOG_CONFIG.keywords} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content={meta.slug ? 'article' : 'website'} />
    <meta property="og:url" content={ogUrl} />
    <meta property="og:image" content={ogImage} />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImage} />

    <link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen w-full flex-col bg-background text-foreground md:flex-row">
    <Sidebar />
    <main class="min-w-0 flex-1">
        {@render children()}
    </main>
</div>
