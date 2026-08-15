<script lang="ts">
    import { page } from '$app/state';

    import Footer from '$lib/components/Footer.svelte';
    import Pagination from '$lib/components/Pagination.svelte';
    import PostListItem from '$lib/components/PostListItem.svelte';
    import { TOPICS } from '$lib/constants/topics';

    let { data } = $props();
    const { posts, pagination } = $derived(data);
    const currentTopic = $derived(TOPICS.find((t) => t.slug === page.params.slug)?.name || 'Topic');
</script>

<div class="container mx-auto max-w-4xl space-y-16 px-6 py-8 md:py-12">
    <!-- Post List -->
    <section class="animate-in space-y-10 delay-200 duration-700 fade-in slide-in-from-bottom-4">
        <h2 class="text-4xl font-bold tracking-tight">{currentTopic}</h2>
        <ul class="space-y-2">
            {#each posts as post (post.slug)}
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
