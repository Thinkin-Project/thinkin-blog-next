<script lang="ts">
    import { ArrowRight } from 'lucide-svelte';

    interface Link {
        name: string;
        url: string;
    }

    let {
        links = [],
        title = 'Links',
        onclick
    }: {
        links: Link[];
        title?: string;
        onclick?: () => void;
    } = $props();
</script>

<section>
    <ul class="space-y-4">
        <h2 class="text-2xl font-bold tracking-tight">{title}</h2>
        {#each links as link}
            <li class="group">
                <a
                    href={link.url}
                    class="flex items-center gap-2 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
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
