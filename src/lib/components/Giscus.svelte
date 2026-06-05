<script lang="ts">
    import { onMount } from 'svelte';

    import { Cookie, MessageSquareOff } from '@lucide/svelte';

    import { BLOG_CONFIG } from '$lib/constants/blog';
    import { themeState } from '$lib/states/theme.svelte';

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
    const isValidConfig = !!(repo && repoId && categoryId);
    let isConsentGiven = $state(false);
    let isLoaded = false;

    // Handle theme changes
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

    // Handle initial loading and consent changes
    $effect(() => {
        if (isValidConfig && isConsentGiven && container && !isLoaded) {
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
            container.appendChild(script);
        }
    });

    onMount(() => {
        if (!isValidConfig) return;

        const checkConsent = () => {
            if (typeof window !== 'undefined' && 'CookieConsent' in window) {
                isConsentGiven = window.CookieConsent.acceptedCategory('functionality');
            } else {
                // If CookieConsent is not used/available, assume consent is given
                isConsentGiven = true;
            }
        };

        const handleConsentChange = () => {
            checkConsent();
        };

        // Initial check
        checkConsent();

        window.addEventListener('cc:onConsent', handleConsentChange);
        window.addEventListener('cc:onChange', handleConsentChange);

        return () => {
            window.removeEventListener('cc:onConsent', handleConsentChange);
            window.removeEventListener('cc:onChange', handleConsentChange);
        };
    });
</script>

<div class="giscus-container mt-16 border-t border-border pt-12">
    {#if !isValidConfig}
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
    {:else if !isConsentGiven}
        <div
            class="animate-in rounded-3xl border border-border bg-secondary/50 p-8 text-center duration-700 fade-in slide-in-from-bottom-4 md:p-12"
        >
            <div class="mb-6 flex justify-center">
                <div
                    class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"
                >
                    <Cookie class="h-6 w-6" />
                </div>
            </div>
            <h3 class="mb-3 text-2xl font-bold">留言功能需要 Cookie 授權</h3>

            <p class="mx-auto mb-6 max-w-md text-muted-foreground">
                為了載入留言功能，我們需要您同意使用「功能性 Cookie」。您可以隨時在設定中調整。
            </p>

            <button
                onclick={() => window.CookieConsent?.showPreferences()}
                class="inline-flex cursor-pointer items-center justify-center rounded-xl bg-primary px-6 py-2.5 font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-95"
            >
                開啟 Cookie 設定
            </button>
        </div>
    {:else}
        <div bind:this={container}></div>
    {/if}
</div>

<style>
    .giscus-container {
        width: 100%;
    }
</style>
