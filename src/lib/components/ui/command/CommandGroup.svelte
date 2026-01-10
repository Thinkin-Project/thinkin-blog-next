<script lang="ts">
    import { Command as CommandPrimitive } from 'cmdk-sv';
    import { cn } from '$lib/utils.js';

    let { class: className = undefined, children, ...restProps } = $props();
</script>

<CommandPrimitive.Group
    class={cn(
        'overflow-hidden p-1 text-foreground **:data-cmdk-group-heading:px-2 **:data-cmdk-group-heading:py-1.5 **:data-cmdk-group-heading:text-xs **:data-cmdk-group-heading:font-medium **:data-cmdk-group-heading:text-muted-foreground',
        className
    )}
    {...restProps}
>
    {@render children?.()}
</CommandPrimitive.Group>
