<script lang="ts">
    import { Command as CommandPrimitive } from 'cmdk-sv';

    import { cn } from '$lib/utils.js';

    let { class: className = undefined, ...restProps } = $props();
</script>

<CommandPrimitive.Separator class={cn('-mx-1 h-px bg-border', className)} {...restProps} />
