<script lang="ts">
    import { Command as CommandPrimitive } from 'cmdk-sv';

    import { cn } from '$lib/utils';

    let { class: className = undefined, children, ...restProps } = $props();
</script>

<CommandPrimitive.Item
    class={cn(
        'relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
        className
    )}
    {...restProps}
>
    {@render children?.()}
</CommandPrimitive.Item>
