<script lang="ts">
    import { Command as CommandPrimitive } from 'cmdk-sv';
    import { cn } from '$lib/utils.js';

    let { class: className = undefined, children, ...restProps } = $props();
</script>

<CommandPrimitive.Group
    class={cn(
        'overflow-hidden p-1 text-foreground [&_[data-cmdk-group-heading]]:px-2 [&_[data-cmdk-group-heading]]:py-1.5 [&_[data-cmdk-group-heading]]:text-xs [&_[data-cmdk-group-heading]]:font-medium [&_[data-cmdk-group-heading]]:text-muted-foreground',
        className
    )}
    {...restProps}
>
    {@render children?.()}
</CommandPrimitive.Group>
