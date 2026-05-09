<script lang="ts">
    import { Check, ClipboardList, X } from 'lucide-svelte';

    let { code }: { code: string } = $props();

    let status = $state<'idle' | 'success' | 'error'>('idle');
    let resetTimer: ReturnType<typeof setTimeout> | undefined;

    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(code);
            status = 'success';
        } catch (error) {
            console.error('Failed to copy source code:', error);
            status = 'error';
        }

        if (resetTimer) clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
            status = 'idle';
        }, 2000);
    }
</script>

<button
    type="button"
    onclick={copyToClipboard}
    title={status === 'success' ? '已複製' : status === 'error' ? '複製失敗' : '複製原始碼'}
    aria-label={status === 'success' ? '已複製' : status === 'error' ? '複製失敗' : '複製原始碼'}
    class="code-copy-button"
    class:code-copy-button-success={status === 'success'}
    class:code-copy-button-error={status === 'error'}
>
    {#if status === 'success'}
        <Check size={14} class="animate-in duration-300 zoom-in" />
    {:else if status === 'error'}
        <X size={14} class="animate-in duration-300 zoom-in" />
    {:else}
        <ClipboardList size={14} />
    {/if}
</button>
