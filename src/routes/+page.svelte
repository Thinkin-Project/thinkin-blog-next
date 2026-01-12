<script lang="ts">
    import { ArrowRight } from 'lucide-svelte';

    import EmptyState from '$lib/components/EmptyState.svelte';
    import FeaturedPostListItem from '$lib/components/FeaturedPostListItem.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Hero from '$lib/components/Hero.svelte';
    import PostListItem from '$lib/components/PostListItem.svelte';
    import SocialLinks from '$lib/components/SocialLinks.svelte';
    import { SOCIAL_LINKS } from '$lib/constants/navigation';

    let { data } = $props();

    const featuredPosts = $derived(data.featuredPosts || []);
    const newPosts = $derived(data.newPosts || []);
</script>

<div class="container mx-auto max-w-4xl space-y-12 px-6 py-8 md:py-12">
    <!-- Hero Section -->
    <div class="animate-in delay-0 duration-700 fade-in slide-in-from-bottom-4">
        <Hero />
    </div>

    <!-- Links Section -->
    <div class="animate-in delay-100 duration-700 fade-in slide-in-from-bottom-4">
        <SocialLinks links={SOCIAL_LINKS} />
    </div>

    <hr class="animate-in delay-200 duration-700 fade-in slide-in-from-bottom-4" />

    <!-- Featured Posts Section -->
    <section class="animate-in space-y-8 delay-300 duration-700 fade-in slide-in-from-bottom-4">
        <h2 class="text-2xl font-bold tracking-tight">置頂文章</h2>
        <div
            class="flex flex-col gap-px overflow-hidden rounded-3xl border border-border bg-border"
        >
            {#each featuredPosts as post (post.slug)}
                <FeaturedPostListItem {...post} link="/posts/{post.slug}" />
            {:else}
                <EmptyState title="尚無置頂文章" />
            {/each}
        </div>
    </section>

    <hr class="animate-in delay-400 duration-700 fade-in slide-in-from-bottom-4" />

    <!-- New Posts Section -->
    <section class="animate-in space-y-8 delay-500 duration-700 fade-in slide-in-from-bottom-4">
        <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold tracking-tight">最新文章</h2>
            <a
                href="/posts"
                class="group flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
                所有文章 <ArrowRight class="h-4 w-4 transition-transform group-hover:-rotate-45" />
            </a>
        </div>
        <ul class="space-y-2">
            {#each newPosts as post (post.slug)}
                <PostListItem {...post} link="/posts/{post.slug}" />
            {/each}
        </ul>
    </section>

    <!-- Footer Section -->
    <Footer />
</div>
