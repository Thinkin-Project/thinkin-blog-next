<script lang="ts">
    import { onMount } from 'svelte';

    import { ArrowUp } from 'lucide-svelte';

    import { Button } from '$lib/components/ui/button';
    import { cn } from '$lib/utils';

    let isVisible = $state(false);

    function checkScroll() {
        isVisible = window.scrollY > 300;
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    onMount(() => {
        window.addEventListener('scroll', checkScroll);
        checkScroll(); // 初始化檢查一次

        return () => {
            window.removeEventListener('scroll', checkScroll);
        };
    });
</script>

<div
    class={cn(
        'fixed right-6 bottom-6 z-40 transition-all duration-300 md:right-10 md:bottom-10',
        isVisible ? 'scale-100 opacity-100' : 'pointer-events-none scale-0 opacity-0'
    )}
>
    <Button
        variant="outline"
        size="icon"
        onclick={scrollToTop}
        class="h-12 w-12 cursor-pointer rounded-full border-zinc-200 bg-white/80 shadow-lg backdrop-blur-sm hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950/80 dark:hover:bg-zinc-900"
        aria-label="回到最頂層"
    >
        <ArrowUp class="h-6 w-6" />
    </Button>
</div>
