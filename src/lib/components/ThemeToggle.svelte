<script lang="ts">
    import { Moon, Sun } from 'lucide-svelte';

    import { Button } from '$lib/components/ui/button';
    import { themeState } from '$lib/theme.svelte';
    import { cn } from '$lib/utils';

    interface Props {
        variant?: 'icon' | 'full';
        class?: string;
    }

    let { variant = 'icon', class: className }: Props = $props();
</script>

{#if variant === 'icon'}
    <Button
        variant="ghost"
        size="icon"
        onclick={() => themeState.toggle()}
        class={cn('cursor-pointer text-muted-foreground hover:text-foreground', className)}
        aria-label="切換佈景主題"
    >
        {#if themeState.current === 'dark'}
            <Sun class="h-5 w-5" />
        {:else}
            <Moon class="h-5 w-5" />
        {/if}
    </Button>
{:else}
    <Button
        variant="outline"
        onclick={() => themeState.toggle()}
        class={cn(
            'flex w-full cursor-pointer items-center justify-between px-4 py-6 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800',
            className
        )}
    >
        <div class="flex items-center gap-3">
            {#if themeState.current === 'dark'}
                <Sun class="h-4 w-4" />
                <span class="font-medium">切換至淺色模式</span>
            {:else}
                <Moon class="h-4 w-4" />
                <span class="font-medium">切換至深色模式</span>
            {/if}
        </div>
        <div
            class="flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-bold dark:bg-zinc-800"
        >
            <span class={themeState.current === 'light' ? 'text-pink-500' : 'text-zinc-500'}
                >LIGHT</span
            >
            <span class="text-zinc-600">/</span>
            <span class={themeState.current === 'dark' ? 'text-pink-400' : 'text-zinc-500'}
                >DARK</span
            >
        </div>
    </Button>
{/if}
