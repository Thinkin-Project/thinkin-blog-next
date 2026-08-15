<script lang="ts">
    import { page } from '$app/state';

    import Footer from '$lib/components/Footer.svelte';
    import Pagination from '$lib/components/Pagination.svelte';
    import PostListItem from '$lib/components/PostListItem.svelte';
    import { TAGS } from '$lib/constants/tags';

    let { data } = $props();
    const { posts, pagination } = $derived(data);
    const currentTag = $derived(TAGS.find((t) => t.slug === page.params.slug)?.name || 'Tag');
</script>

<div class="container mx-auto max-w-4xl space-y-16 px-6 py-8 md:py-12">
    <!-- Page Title -->
    <section class="animate-in delay-0 duration-700 fade-in slide-in-from-bottom-4">
        <h2 class="text-4xl font-bold tracking-tight">{currentTag}</h2>
    </section>

    <!-- Post List -->
    <section class="animate-in delay-100 duration-700 fade-in slide-in-from-bottom-4">
        <ul class="space-y-2">
            {#each posts as post (post.slug)}
                <PostListItem {...post} link="/posts/{post.slug}" />
            {/each}
        </ul>
    </section>

    <!-- Pagination Controls -->
    {#if pagination}
        <section class="animate-in delay-200 duration-700 fade-in slide-in-from-bottom-4">
            <Pagination {...pagination} />
        </section>
    {/if}

    <!-- Footer Section -->
    <Footer />
</div>
