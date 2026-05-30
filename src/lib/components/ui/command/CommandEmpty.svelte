<script lang="ts">
    import { Command as CommandPrimitive } from 'cmdk-sv';

    import { cn } from '$lib/utils';

    let { class: className = undefined, ...restProps } = $props();
</script>

<CommandPrimitive.Empty class={cn('py-6 text-center text-sm', className)} {...restProps} />
