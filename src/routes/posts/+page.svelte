<script lang="ts">
    import PostListItem from '$lib/components/PostListItem.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import { CornerDownRight } from 'lucide-svelte';
    import Separator from '$lib/components/ui/separator/Separator.svelte';

    let { data } = $props();
    const topics = ['Artificial Intelligence', 'Design', 'Engineering', 'Thoughts'];
</script>

<div class="container max-w-4xl mx-auto px-6 py-8 md:py-12 space-y-16">
    <!-- Topics Section -->
    <section class="space-y-4">
        <h2 class="text-4xl font-bold tracking-tight">主題</h2>
        <ul class="flex flex-wrap gap-4">
            {#each topics as topic}
                <a
                    href="/topics/{topic.toLowerCase().replace(' ', '-')}"
                    class="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300 cursor-pointer"
                >
                    <CornerDownRight class="h-4 w-4" />
                    <span class="text-sm font-medium tracking-wide">{topic}</span>
                </a>
            {/each}
        </ul>

        <!-- Subtle Divider -->
        <Separator class="bg-zinc-900 mt-4" />
    </section>

    <!-- All Posts Section -->
    <section class="space-y-10">
        <ul class="space-y-2">
            {#each data.posts as post}
                <PostListItem {...post} link="/posts/{post.slug}" />
            {/each}
        </ul>
    </section>

    <!-- Footer Section -->
    <Footer />
</div>
