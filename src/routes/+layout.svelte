<script lang="ts">
    import favicon from '$lib/assets/favicon.ico';
    import Sidebar from '$lib/components/Sidebar.svelte';
    import { BLOG_CONFIG } from '$lib/constants/blog';

    import './layout.css';

    let { children } = $props();
</script>

<svelte:head>
    <title>{BLOG_CONFIG.name}</title>
    <link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen w-full flex-col bg-background text-foreground md:flex-row">
    <Sidebar />
    <main class="flex-1">
        {@render children()}
    </main>
</div>
