<script lang="ts">
    import type { Component } from 'svelte';

    import { Inbox } from 'lucide-svelte';

    let {
        title = '尚無內容',
        message = '正在挑選最精彩的內容與您分享，敬請期待。',
        icon: Icon = Inbox
    } = $props<{
        title?: string;
        message?: string;
        icon?: Component;
    }>();
</script>

<div class="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
    <div class="rounded-full bg-secondary p-4 text-muted-foreground">
        <Icon class="h-8 w-8" />
    </div>
    <div class="space-y-1">
        <p class="text-lg font-medium text-muted-foreground">{title}</p>
        {#if message}
            <p class="text-sm text-muted-foreground/80">
                {message}
            </p>
        {/if}
    </div>
</div>
