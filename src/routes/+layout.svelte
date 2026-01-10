<script lang="ts">
    import favicon from '$lib/assets/favicon.ico';
    import Sidebar from '$lib/components/Sidebar.svelte';
    import GlobalSearch from '$lib/components/GlobalSearch.svelte';
    import { BLOG_CONFIG } from '$lib/constants/blog';

    import './layout.css';

    let { children } = $props();
</script>

<GlobalSearch />

<svelte:head>
    <title>{BLOG_CONFIG.name}</title>
    <meta name="description" content={BLOG_CONFIG.description} />
    <meta name="author" content={BLOG_CONFIG.author} />
    <meta name="keywords" content={BLOG_CONFIG.keywords} />
    <meta property="og:title" content={BLOG_CONFIG.name} />
    <meta property="og:description" content={BLOG_CONFIG.description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={BLOG_CONFIG.url} />
    <meta property="og:image" content={BLOG_CONFIG.url + BLOG_CONFIG.ogImage} />
    <link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen w-full flex-col bg-background text-foreground md:flex-row">
    <Sidebar />
    <main class="flex-1">
        {@render children()}
    </main>
</div>
