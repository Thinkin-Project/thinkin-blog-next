<script lang="ts">
    import { ArrowRight } from '@lucide/svelte';

    import type { SocialLink } from '$lib/types';

    let {
        links = [],
        title = '社群連結',
        onclick
    }: {
        links: SocialLink[];
        title?: string;
        onclick?: () => void;
    } = $props();
</script>

{#if links.length > 0}
    <section>
        <ul class="space-y-4">
            <h2 class="text-2xl font-bold tracking-tight">{title}</h2>
            {#each links as link (link.url)}
                <li class="group">
                    <a
                        href={link.url}
                        class="flex items-center gap-2 text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                        {onclick}
                    >
                        {link.name}
                        <ArrowRight
                            class="h-4 w-4 transition-transform duration-300 group-hover:-rotate-45"
                        />
                    </a>
                </li>
            {/each}
        </ul>
    </section>
{/if}
