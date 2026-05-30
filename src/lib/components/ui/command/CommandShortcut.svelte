<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    import { cn } from '$lib/utils';

    let {
        class: className = undefined,
        children,
        ...restProps
    }: HTMLAttributes<HTMLSpanElement> = $props();
</script>

<span class={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)} {...restProps}>
    {@render children?.()}
</span>
