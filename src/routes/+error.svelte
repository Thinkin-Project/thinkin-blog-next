<script lang="ts">
    import { page } from '$app/state';

    import { ArrowRight } from 'lucide-svelte';

    import FeaturedPostListItem from '$lib/components/FeaturedPostListItem.svelte';
    import EmptyState from '$lib/components/EmptyState.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import { Separator } from '$lib/components/ui/separator';

    const featuredPosts = $derived(page.data.featuredPosts || []);
</script>

<div class="container mx-auto max-w-4xl space-y-12 px-6 py-8 md:py-12">
    <!-- Error Message Section -->
    <section class="animate-in space-y-6 delay-0 duration-700 fade-in slide-in-from-bottom-4">
        <h1 class="text-4xl font-bold tracking-tight text-white md:text-5xl">404 – 此頁面不存在</h1>

        <a
            href="/"
            class="group inline-flex items-center justify-center rounded-md border border-input bg-zinc-900 px-2 py-1 text-sm font-medium whitespace-nowrap text-zinc-400 ring-offset-background transition-colors hover:bg-zinc-800 hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
            <ArrowRight
                class="mr-2 h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1"
            />
            首頁
        </a>
    </section>

    <Separator
        class="animate-in bg-zinc-800 delay-50 duration-700 fade-in slide-in-from-bottom-4"
    />

    <!-- Featured Posts Section -->
    <section class="animate-in space-y-8 delay-100 duration-700 fade-in slide-in-from-bottom-4">
        <h2 class="text-2xl font-bold tracking-tight">置頂文章</h2>
        <div
            class="flex flex-col gap-px overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-800"
        >
            {#each featuredPosts as post}
                <FeaturedPostListItem {...post} link="/posts/{post.slug}" />
            {:else}
                <EmptyState title="尚無置頂文章" />
            {/each}
        </div>
    </section>

    <!-- Footer Section -->
    <Footer />
</div>
