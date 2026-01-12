<script lang="ts">
    import { page } from '$app/state';

    import favicon from '$lib/assets/favicon.ico';
    import CookieConsent from '$lib/components/CookieConsent.svelte';
    import GlobalSearch from '$lib/components/GlobalSearch.svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';
    import { BLOG_CONFIG } from '$lib/constants/blog';

    import './layout.css';

    let { children } = $props();

    const meta = $derived(page.data.meta || {});
    const title = $derived(meta.title ? `${meta.title} | ${BLOG_CONFIG.name}` : BLOG_CONFIG.name);
    const description = $derived(meta.description || BLOG_CONFIG.description);
    const ogImage = $derived(
        meta.ogImage
            ? `${BLOG_CONFIG.url}${meta.ogImage}`
            : `${BLOG_CONFIG.url}${BLOG_CONFIG.ogImage}`
    );
    const ogUrl = $derived(
        meta.slug ? `${BLOG_CONFIG.url}/posts/${meta.slug}` : BLOG_CONFIG.url + page.url.pathname
    );
</script>

<GlobalSearch />
<CookieConsent />

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
    <main class="flex-1">
        {@render children()}
    </main>
</div>
