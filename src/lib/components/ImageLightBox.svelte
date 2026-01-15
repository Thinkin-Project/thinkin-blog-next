<script lang="ts">
    import * as Dialog from '$lib/components/ui/dialog';
    import { closeLightbox, lightboxState, openLightbox } from '$lib/states/lightbox.svelte';

    /**
     * 全域點擊攔截
     * 監聽所有具備 .zoomable-image class 的圖片點擊事件
     */
    function handleGlobalClick(e: MouseEvent) {
        const target = e.target as HTMLElement;
        if (target && target.tagName === 'IMG' && target.classList.contains('zoomable-image')) {
            const img = target as HTMLImageElement;
            openLightbox(img.src, img.alt);
        }
    }
</script>

<svelte:window on:click={handleGlobalClick} />

<Dialog.Root open={lightboxState.isOpen} onOpenChange={(open) => !open && closeLightbox()}>
    <Dialog.Content
        class="pointer-events-auto fixed inset-0 top-0 left-0 z-50 flex h-screen w-screen max-w-none translate-x-0 translate-y-0 items-center justify-center border-none bg-black/5 p-0 shadow-none backdrop-blur-sm duration-300"
        portalProps={{}}
    >
        <!-- 背景點擊區域 (全螢幕) -->
        <button
            type="button"
            class="absolute inset-0 cursor-zoom-out border-none bg-transparent outline-none"
            onclick={closeLightbox}
            aria-label="Close lightbox"
        ></button>

        <!-- 圖片容器：確保其在父層 flex 下置中 -->
        <div
            class="pointer-events-none relative z-10 flex max-h-full max-w-full flex-col items-center justify-center p-4 md:p-8"
        >
            <img
                src={lightboxState.src}
                alt={lightboxState.alt}
                class="h-auto max-h-[90vh] w-auto max-w-[95vw] rounded-sm object-contain shadow-[0_0_60px_rgba(0,0,0,0.6)] transition-all duration-300"
            />

            {#if lightboxState.alt}
                <div class="mt-4 rounded-lg bg-black/40 px-4 py-1.5 backdrop-blur-sm">
                    <p class="text-center text-sm font-medium tracking-wide text-white/90">
                        {lightboxState.alt}
                    </p>
                </div>
            {/if}
        </div>
    </Dialog.Content>
</Dialog.Root>

<style>
    /* 這裡可以放一些組件專用的微調，但大部分樣式建議放在全域 */
</style>
