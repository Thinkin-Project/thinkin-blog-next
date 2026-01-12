<script lang="ts">
    import { onMount } from 'svelte';

    import { MessageSquareOff } from 'lucide-svelte';

    import { BLOG_CONFIG } from '$lib/constants/blog';
    import { themeState } from '$lib/theme.svelte';

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
        lang,
        loading
    } = BLOG_CONFIG.giscus;

    let container: HTMLDivElement | undefined = $state();
    let isValidConfig = $state(!!(repo && repoId && categoryId));

    $effect(() => {
        const currentTheme = themeState.current;
        const iframe = container?.querySelector('iframe.giscus-frame') as HTMLIFrameElement;
        if (iframe?.contentWindow) {
            iframe.contentWindow.postMessage(
                { giscus: { setConfig: { theme: currentTheme } } },
                'https://giscus.app'
            );
        }
    });

    onMount(() => {
        if (!isValidConfig) return;

        // Check for cookie consent if the library is available
        const isConsentAccepted = () => {
            if (typeof window !== 'undefined' && 'CookieConsent' in window) {
                // @ts-ignore
                return window.CookieConsent.acceptedCategory('functionality');
            }
            return true; // Fallback if library not loaded yet or disabled
        };

        let isLoaded = false;
        const loadGiscus = () => {
            if (isLoaded) return;
            isLoaded = true;

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
            script.setAttribute('data-theme', themeState.current);

            script.setAttribute('data-lang', lang);
            script.setAttribute('data-loading', loading);
            script.setAttribute('crossorigin', 'anonymous');
            script.async = true;

            // eslint-disable-next-line svelte/no-dom-manipulating
            container?.appendChild(script);
        };

        if (isConsentAccepted()) {
            loadGiscus();
        } else {
            // Listen for consent changes
            window.addEventListener('cc:onConsent', () => {
                if (isConsentAccepted()) {
                    loadGiscus();
                }
            });
        }
    });
</script>

<div class="giscus-container mt-16 border-t border-border pt-12">
    {#if isValidConfig}
        <div bind:this={container}></div>
    {:else}
        <div
            class="animate-in rounded-3xl border border-border bg-secondary/50 p-8 text-center duration-700 fade-in slide-in-from-bottom-4 md:p-12"
        >
            <div class="mb-6 flex justify-center">
                <div
                    class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"
                >
                    <MessageSquareOff class="h-6 w-6" />
                </div>
            </div>
            <h3 class="mb-3 text-2xl font-bold">留言功能尚未啟用</h3>

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
