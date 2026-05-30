<script lang="ts">
    import { Search } from 'lucide-svelte';

    import { Button } from '$lib/components/ui/button';
    import { searchState } from '$lib/states/search.svelte';

    interface Props {
        variant?: 'default' | 'icon';
    }

    let { variant = 'default' }: Props = $props();
</script>

{#if variant === 'default'}
    <button
        onclick={() => searchState.open()}
        class="flex w-full cursor-pointer items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
    >
        <Search class="h-4 w-4" />
        <span>搜尋文章...</span>
        <kbd
            class="pointer-events-none ml-auto hidden h-5 items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex"
        >
            <span class="text-xs">⌘</span>K
        </kbd>
    </button>
{:else}
    <Button
        variant="ghost"
        size="icon"
        onclick={() => searchState.open()}
        class="cursor-pointer text-muted-foreground hover:text-foreground"
        aria-label="搜尋文章"
    >
        <Search class="h-5 w-5" />
    </Button>
{/if}
