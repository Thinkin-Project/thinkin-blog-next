<script lang="ts">
    import { Dialog, DialogContent } from '$lib/components/ui/dialog/index.js';
    import { Command } from './index.js';

    let { open = $bindable(false), children, shouldFilter = true, ...restProps } = $props();
</script>

<Dialog bind:open {...restProps}>
    <DialogContent class="overflow-hidden p-0 shadow-lg">
        <Command
            {shouldFilter}
            class="**:[data-cmdk-group]:not([hidden])~[data-cmdk-group]:pt-0 **:[data-cmdk-input-wrapper]_svg]:h-5 **:[data-cmdk-input-wrapper]_svg]:w-5 **:[data-cmdk-item]_svg]:h-5 **:[data-cmdk-item]_svg]:w-5 **:[data-cmdk-group]:px-2 **:[data-cmdk-group-heading]:px-2 **:[data-cmdk-group-heading]:font-medium **:[data-cmdk-group-heading]:text-muted-foreground **:[data-cmdk-input]:h-12 **:[data-cmdk-item]:px-4 **:[data-cmdk-item]:py-3"
        >
            {@render children?.()}
        </Command>
    </DialogContent>
</Dialog>
