<script lang="ts">
    import { CornerDownRight } from 'lucide-svelte';

    import Footer from '$lib/components/Footer.svelte';
    import Pagination from '$lib/components/Pagination.svelte';
    import PostListItem from '$lib/components/PostListItem.svelte';
    import { buttonVariants } from '$lib/components/ui/button';
    import Separator from '$lib/components/ui/separator/Separator.svelte';
    import { BLOG_CONFIG } from '$lib/constants/blog';
    import { TOPICS } from '$lib/constants/topics';

    let { data } = $props();
    const { posts, pagination } = $derived(data);
    const topics = TOPICS;
</script>

<svelte:head>
    <title>所有文章 | {BLOG_CONFIG.name}</title>
</svelte:head>

<div class="container mx-auto max-w-4xl space-y-16 px-6 py-8 md:py-12">
    <!-- Topics Section -->
    <section class="animate-in space-y-4 delay-0 duration-700 fade-in slide-in-from-bottom-4">
        <h2 class="text-4xl font-bold tracking-tight">主題</h2>
        <ul class="flex flex-wrap gap-4">
            {#each topics as topic}
                <a
                    href="/topics/{topic.slug}"
                    class="group flex cursor-pointer items-center gap-2 text-muted-foreground transition-colors duration-300 hover:text-foreground"
                >
                    <CornerDownRight class="h-4 w-4" />
                    <span class="text-sm font-medium tracking-wide">{topic.name}</span>
                </a>
            {/each}
        </ul>

        <!-- Subtle Divider -->
        <Separator
            class="mt-4 animate-in bg-border delay-100 duration-700 fade-in slide-in-from-bottom-4"
        />
    </section>

    <!-- All Posts Section -->
    <section class="animate-in space-y-10 delay-200 duration-700 fade-in slide-in-from-bottom-4">
        <h2 class="text-4xl font-bold tracking-tight">所有文章</h2>
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
