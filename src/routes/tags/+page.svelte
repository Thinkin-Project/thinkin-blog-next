<script lang="ts">
    import { Search } from '@lucide/svelte';

    import Footer from '$lib/components/Footer.svelte';

    let { data } = $props();
    const { tags } = $derived(data);

    let query = $state('');

    const filteredTags = $derived(
        tags.filter((tag) => tag.name.toLowerCase().includes(query.trim().toLowerCase()))
    );
</script>

<div class="container mx-auto max-w-4xl space-y-8 px-6 py-8 md:py-12">
    <section class="animate-in space-y-2 delay-0 duration-700 fade-in slide-in-from-bottom-4">
        <h1 class="text-4xl font-bold tracking-tight">標籤</h1>
        <p class="text-sm text-muted-foreground">共 {tags.length} 個標籤</p>
    </section>

    <section class="animate-in delay-100 duration-700 fade-in slide-in-from-bottom-4">
        <div
            class="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-sm text-muted-foreground focus-within:ring-2 focus-within:ring-ring"
        >
            <Search class="h-4 w-4 shrink-0" />
            <input
                type="text"
                bind:value={query}
                placeholder="搜尋標籤..."
                aria-label="搜尋標籤"
                class="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
            />
        </div>
    </section>

    {#if filteredTags.length > 0}
        <section
            class="flex animate-in flex-wrap gap-3 delay-200 duration-700 fade-in slide-in-from-bottom-4"
        >
            {#each filteredTags as tag (tag.slug)}
                <a
                    href="/tags/{tag.slug}"
                    class="group inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                    {tag.name}
                    <span
                        class="text-xs text-muted-foreground transition-colors group-hover:text-accent-foreground"
                        >{tag.postCount}</span
                    >
                </a>
            {/each}
        </section>
    {:else}
        <p class="animate-in py-6 text-center text-sm text-muted-foreground duration-700 fade-in">
            找不到相關標籤
        </p>
    {/if}

    <Footer />
</div>
