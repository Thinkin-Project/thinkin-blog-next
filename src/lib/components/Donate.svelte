<script lang="ts">
    import { Coffee } from 'lucide-svelte';

    import { BLOG_CONFIG } from '$lib/constants/blog';
    import type { DonationLink } from '$lib/types';
    import { cn } from '$lib/utils';

    let {
        variant = 'default',
        class: className
    }: {
        variant?: 'default' | 'sidebar';
        class?: string;
    } = $props();

    const donations: DonationLink[] = BLOG_CONFIG.donations || [];
</script>

{#if donations.length > 0}
    <div class={cn('animate-in duration-700 fade-in slide-in-from-bottom-4', className)}>
        {#if variant === 'default'}
            <div class="rounded-3xl border border-border bg-secondary/30 p-8 text-center md:p-12">
                <div class="mb-6 flex justify-center">
                    <div
                        class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"
                    >
                        <Coffee class="h-6 w-6" />
                    </div>
                </div>
                <h3 class="mb-3 text-2xl font-bold text-foreground">贊助支持</h3>
                <p class="mx-auto mb-8 max-w-md text-muted-foreground">
                    如果你喜歡我們的文章，或是這些內容對你有幫助，歡迎透過以下平台請我們喝杯咖啡，支持我們持續創作！
                </p>
                <div class="flex flex-wrap justify-center gap-4">
                    {#each donations as donation}
                        <a
                            href={donation.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="group relative inline-flex items-center transition-transform hover:scale-105 active:scale-95"
                        >
                            {#if donation.image}
                                <img
                                    src={donation.image}
                                    alt={donation.platform}
                                    class="h-12 w-auto object-contain"
                                />
                            {:else}
                                <span
                                    class="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 font-bold text-foreground transition-colors hover:bg-secondary"
                                >
                                    {#if donation.icon}
                                        <donation.icon class="h-5 w-5" />
                                    {:else}
                                        <Coffee class="h-5 w-5" />
                                    {/if}
                                    {donation.platform}
                                </span>
                            {/if}
                        </a>
                    {/each}
                </div>
            </div>
        {:else if variant === 'sidebar'}
            <div class="space-y-4">
                <p class="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    支持創作
                </p>
                <div class="flex flex-wrap gap-3">
                    {#each donations as donation}
                        <a
                            href={donation.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="group relative inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                            title={donation.platform}
                        >
                            {#if donation.image}
                                <img
                                    src={donation.image}
                                    alt={donation.platform}
                                    class="h-8 w-auto object-contain grayscale transition-[filter] group-hover:grayscale-0"
                                />
                            {:else}
                                {#if donation.icon}
                                    <donation.icon class="h-4 w-4" />
                                {:else}
                                    <Coffee class="h-4 w-4" />
                                {/if}
                                {donation.platform}
                            {/if}
                        </a>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
{/if}
