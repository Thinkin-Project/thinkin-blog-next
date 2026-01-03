<script lang="ts">
    import PostListItem from '$lib/components/PostListItem.svelte';
    import Newsletter from '$lib/components/Newsletter.svelte';
    import Footer from '$lib/components/Footer.svelte';

    let { data } = $props();
    const topics = ['Artificial Intelligence', 'Design', 'Engineering', 'Thoughts'];
</script>

<div class="container max-w-4xl mx-auto px-6 py-8 md:py-12 space-y-16">
    <!-- Topics Section -->
    <section class="space-y-6">
        <h2 class="text-3xl font-bold tracking-tight">Topics</h2>
        <ul class="flex flex-wrap gap-x-8 gap-y-3">
            {#each topics as topic}
                <a
                    href="/topics/{topic.toLowerCase().replace(' ', '-')}"
                    class="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300 cursor-pointer"
                >
                    <span class="text-zinc-500 group-hover:text-foreground transition-colors"
                        >↳</span
                    >
                    <span class="text-sm font-medium tracking-wide">{topic}</span>
                </a>
            {/each}
        </ul>
    </section>

    <!-- All Posts Section -->
    <section class="space-y-10">
        <h2 class="text-4xl font-bold tracking-tight text-white mb-8">All posts</h2>
        <ul class="space-y-2">
            {#each data.posts as post}
                <PostListItem {...post} link="/posts/{post.slug}" />
            {/each}
        </ul>
    </section>

    <!-- Newsletter Section -->
    <Newsletter />

    <!-- Footer Section -->
    <Footer />
</div>
