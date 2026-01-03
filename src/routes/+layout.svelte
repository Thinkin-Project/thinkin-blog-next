<script lang="ts">
    import Sidebar from '$lib/components/Sidebar.svelte';
    import './layout.css';
    import favicon from '$lib/assets/favicon.svg';

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen w-full flex-col md:flex-row bg-background text-foreground">
    <Sidebar />
    <main class="flex-1">
        {@render children()}
    </main>
</div>
