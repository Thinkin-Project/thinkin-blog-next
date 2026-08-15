<script lang="ts">
    import { Search } from '@lucide/svelte';

    import Footer from '$lib/components/Footer.svelte';

    let { data } = $props();
    const { topics } = $derived(data);

    let query = $state('');

    const filteredTopics = $derived(
        topics.filter((topic) => topic.name.toLowerCase().includes(query.trim().toLowerCase()))
    );
</script>

<div class="container mx-auto max-w-4xl space-y-8 px-6 py-8 md:py-12">
    <section class="animate-in space-y-2 delay-0 duration-700 fade-in slide-in-from-bottom-4">
        <h1 class="text-4xl font-bold tracking-tight">主題</h1>
        <p class="text-sm text-muted-foreground">共 {topics.length} 個主題</p>
    </section>

    <section class="animate-in delay-100 duration-700 fade-in slide-in-from-bottom-4">
        <div
            class="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-sm text-muted-foreground focus-within:ring-2 focus-within:ring-ring"
        >
            <Search class="h-4 w-4 shrink-0" />
            <input
                type="text"
                bind:value={query}
                placeholder="搜尋主題..."
                class="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
            />
        </div>
    </section>

    {#if filteredTopics.length > 0}
        <section
            class="grid animate-in grid-cols-1 gap-4 delay-200 duration-700 fade-in slide-in-from-bottom-4 sm:grid-cols-2 lg:grid-cols-4"
        >
            {#each filteredTopics as topic (topic.slug)}
                <a
                    href="/topics/{topic.slug}"
                    class="group rounded-2xl border border-border bg-card/80 p-4 transition-colors hover:bg-secondary hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                    <p
                        class="font-medium text-foreground transition-colors group-hover:text-accent-foreground"
                    >
                        {topic.name}
                    </p>
                    <p class="mt-1 text-sm text-muted-foreground">{topic.postCount} 篇文章</p>
                </a>
            {/each}
        </section>
    {:else}
        <p class="animate-in py-6 text-center text-sm text-muted-foreground duration-700 fade-in">
            找不到符合的主題
        </p>
    {/if}

    <Footer />
</div>
