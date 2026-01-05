<script lang="ts">
    import { CornerDownRight } from 'lucide-svelte';

    import Footer from '$lib/components/Footer.svelte';
    import PostListItem from '$lib/components/PostListItem.svelte';
    import Separator from '$lib/components/ui/separator/Separator.svelte';
    import { TOPICS } from '$lib/constants/topics';

    let { data } = $props();
    const topics = TOPICS;
</script>

<div class="container mx-auto max-w-4xl space-y-16 px-6 py-8 md:py-12">
    <!-- Topics Section -->
    <section class="animate-in space-y-4 delay-0 duration-700 fade-in slide-in-from-bottom-4">
        <h2 class="text-4xl font-bold tracking-tight">主題</h2>
        <ul class="flex flex-wrap gap-4">
            {#each topics as topic}
                <a
                    href="/topics/{topic.toLowerCase().replace(' ', '-')}"
                    class="group flex cursor-pointer items-center gap-2 text-muted-foreground transition-colors duration-300 hover:text-foreground"
                >
                    <CornerDownRight class="h-4 w-4" />
                    <span class="text-sm font-medium tracking-wide">{topic}</span>
                </a>
            {/each}
        </ul>

        <!-- Subtle Divider -->
        <Separator
            class="mt-4 animate-in bg-zinc-900 delay-100 duration-700 fade-in slide-in-from-bottom-4"
        />
    </section>

    <!-- All Posts Section -->
    <section class="animate-in space-y-10 delay-200 duration-700 fade-in slide-in-from-bottom-4">
        <h2 class="text-4xl font-bold tracking-tight">所有文章</h2>
        <ul class="space-y-2">
            {#each data.posts as post}
                <PostListItem {...post} link="/posts/{post.slug}" />
            {/each}
        </ul>
    </section>

    <!-- Footer Section -->
    <Footer />
</div>
