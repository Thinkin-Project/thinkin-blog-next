<script lang="ts">
    import { onMount } from 'svelte';

    import { MessageSquareOff } from 'lucide-svelte';

    import { BLOG_CONFIG } from '$lib/constants/blog';

    const {
        repo,
        repoId,
        category,
        categoryId,
        mapping,
        strict,
        reactionsEnabled,
        emitMetadata,
        inputPosition,
        theme,
        lang,
        loading
    } = BLOG_CONFIG.giscus;

    let container: HTMLDivElement | undefined = $state();
    let isValidConfig = $state(!!(repo && repoId && categoryId));

    onMount(() => {
        if (!isValidConfig) return;

        const script = document.createElement('script');
        script.src = 'https://giscus.app/client.js';
        script.setAttribute('data-repo', repo);
        script.setAttribute('data-repo-id', repoId);
        script.setAttribute('data-category', category);
        script.setAttribute('data-category-id', categoryId);
        script.setAttribute('data-mapping', mapping);
        script.setAttribute('data-strict', strict);
        script.setAttribute('data-reactions-enabled', reactionsEnabled);
        script.setAttribute('data-emit-metadata', emitMetadata);
        script.setAttribute('data-input-position', inputPosition);
        script.setAttribute('data-theme', theme);
        script.setAttribute('data-lang', lang);
        script.setAttribute('data-loading', loading);
        script.setAttribute('crossorigin', 'anonymous');
        script.async = true;

        container?.appendChild(script);
    });
</script>

<div class="giscus-container mt-16 border-t border-zinc-900 pt-10">
    {#if isValidConfig}
        <div bind:this={container}></div>
    {:else}
        <div
            class="animate-in rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 text-center duration-700 fade-in slide-in-from-bottom-4 md:p-12"
        >
            <div class="mb-6 flex justify-center">
                <div
                    class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"
                >
                    <MessageSquareOff class="h-6 w-6" />
                </div>
            </div>
            <h3 class="mb-3 text-2xl font-bold text-white">留言功能尚未啟用</h3>
            <p class="mx-auto mb-8 max-w-md text-muted-foreground">
                目前討論功能正在準備中，稍後將會開放。感謝你的耐心等待！
            </p>
        </div>
    {/if}
</div>

<style>
    .giscus-container {
        width: 100%;
    }
</style>
