<script lang="ts">
    import { page } from '$app/state';
    import { ChevronRight, CornerDownRight } from 'lucide-svelte';

    import Footer from '$lib/components/Footer.svelte';
    import Pagination from '$lib/components/Pagination.svelte';
    import PostListItem from '$lib/components/PostListItem.svelte';
    import { BLOG_CONFIG } from '$lib/constants/blog';
    import { Separator } from '$lib/components/ui/separator';
    import { TOPICS } from '$lib/constants/topics';

    let { data } = $props();
    const { posts, pagination } = $derived(data);
    const topics = TOPICS;
    const currentTopic = $derived(topics.find((t) => t.slug === page.params.slug)?.name || 'Topic');
</script>

<svelte:head>
    <title>{currentTopic} | {BLOG_CONFIG.name}</title>
</svelte:head>

<div class="container mx-auto max-w-4xl space-y-16 px-6 py-8 md:py-12">
    <!-- Topic Header -->
    <section class="animate-in space-y-4 delay-0 duration-700 fade-in slide-in-from-bottom-4">
        <!-- Header with Button and Title -->
        <div class="flex items-center gap-4">
            <a
                href="/posts"
                class="group inline-flex items-center justify-center rounded-md border border-input bg-zinc-900 px-2 py-1 text-sm font-medium whitespace-nowrap text-zinc-400 ring-offset-background transition-colors hover:bg-zinc-800 hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
                <ChevronRight
                    class="mr-1 h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1"
                />
                所有文章
            </a>
            <h1 class="text-3xl font-bold tracking-tight text-white">{currentTopic}</h1>
        </div>

        <!-- Sub-nav Categories -->
        <div class="flex flex-wrap gap-4 pt-2">
            {#each topics as topic}
                <a
                    href="/topics/{topic.slug}"
                    class="group flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-white"
                >
                    <CornerDownRight class="h-4 w-4" />
                    {topic.name}
                </a>
            {/each}
        </div>

        <!-- Subtle Divider -->
        <Separator
            class="mt-4 animate-in bg-zinc-900 delay-100 duration-700 fade-in slide-in-from-bottom-4"
        />
    </section>

    <!-- Post List -->
    <section class="animate-in delay-200 duration-700 fade-in slide-in-from-bottom-4">
        <ul class="space-y-2">
            {#each posts as post}
                <PostListItem {...post} link="/posts/{post.slug}" />
            {/each}
        </ul>

        <!-- Pagination Controls -->
        {#if pagination}
            <Pagination {...pagination} />
        {/if}
    </section>

    <!-- Footer Section -->
    <Footer />
</div>
