<script lang="ts">
    import { Command as CommandPrimitive } from 'cmdk-sv';

    import { cn } from '$lib/utils';

    let { class: className = undefined, children, ...restProps } = $props();
</script>

<CommandPrimitive.List
    class={cn('max-h-[600px] overflow-x-hidden overflow-y-auto', className)}
    {...restProps}
>
    {@render children?.()}
</CommandPrimitive.List>
