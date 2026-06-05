<script lang="ts">
    import { onMount } from 'svelte';

    import { Check, Link } from '@lucide/svelte';

    import { cn } from '$lib/utils';

    import { Facebook, Linkedin, X } from './icons';

    let {
        url = '',
        title = '',
        layout = 'horizontal',
        class: className = ''
    }: {
        url?: string;
        title?: string;
        layout?: 'horizontal' | 'vertical';
        class?: string;
    } = $props();

    let fallbackUrl = $state('');
    let copied = $state(false);

    onMount(() => {
        fallbackUrl = window.location.href;
    });

    const displayUrl = $derived(url || fallbackUrl);
    const encodedUrl = $derived(encodeURIComponent(displayUrl));
    const encodedTitle = $derived(encodeURIComponent(title));

    const shareLinks = $derived([
        {
            name: 'LinkedIn',
            icon: Linkedin,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            color: 'hover:text-[#0A66C2] hover:bg-secondary'
        },
        {
            name: 'Facebook',
            icon: Facebook,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            color: 'hover:text-[#1877F2] hover:bg-secondary'
        },
        {
            name: 'X',
            icon: X,
            href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            color: 'hover:text-foreground hover:bg-secondary'
        }
    ]);

    async function copyToClipboard() {
        try {
            const plainText = displayUrl;
            const htmlContent = `<a href="${displayUrl}">${title}</a>`;
            const clipboardItem = new ClipboardItem({
                'text/plain': new Blob([plainText], { type: 'text/plain' }),
                'text/html': new Blob([htmlContent], { type: 'text/html' })
            });
            await navigator.clipboard.write([clipboardItem]);
            copied = true;
            setTimeout(() => {
                copied = false;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }
</script>

<div
    class={cn(
        'flex gap-2',
        layout === 'vertical' ? 'flex-col items-center' : 'flex-row items-center justify-center',
        className
    )}
>
    {#each shareLinks as link (link.name)}
        <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            title="分享至 {link.name}"
            class={cn(
                'flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-200',
                link.color
            )}
        >
            <link.icon size={20} />
        </a>
    {/each}

    <button
        type="button"
        onclick={copyToClipboard}
        title="複製連結"
        class={cn(
            'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground',
            copied && 'border-green-500/50 text-green-500 hover:text-green-400'
        )}
    >
        {#if copied}
            <Check size={20} class="animate-in duration-300 zoom-in" />
        {:else}
            <Link size={20} />
        {/if}
    </button>
</div>

<style>
    :global(.vertical-text) {
        writing-mode: vertical-rl;
    }
</style>
