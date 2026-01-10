<script lang="ts">
    import { Dialog, DialogContent } from '$lib/components/ui/dialog/index.js';
    import { Command } from './index.js';

    let { open = $bindable(false), children, shouldFilter = true, ...restProps } = $props();
</script>

<Dialog bind:open {...restProps}>
    <DialogContent class="overflow-hidden p-0 shadow-lg">
        <Command
            {shouldFilter}
            class="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-4 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
        >
            {@render children?.()}
        </Command>
    </DialogContent>
</Dialog>
