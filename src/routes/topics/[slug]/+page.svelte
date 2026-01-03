<script lang="ts">
    import { ArrowRight } from 'lucide-svelte';
    import { Separator } from '$lib/components/ui/separator';
    import PostListItem from '$lib/components/PostListItem.svelte';
    import Newsletter from '$lib/components/Newsletter.svelte';
    import Footer from '$lib/components/Footer.svelte';

    const topics = ['Artificial Intelligence', 'Design', 'Engineering', 'Thoughts'];

    const posts = [
        {
            title: 'The Philosophy of AI Ethics',
            subtitle: 'Can machines make moral decisions?',
            date: '1/12/25',
            link: '/posts/the-philosophy-of-ai-ethics'
        },
        {
            title: 'How AI is Changing the Way We Work',
            subtitle: 'AI tools & their impact on productivity.',
            date: '1/16/25',
            link: '/posts/how-ai-is-changing-the-way-we-work'
        },
        {
            title: 'The Ethics of Artificial Intelligence',
            subtitle: 'Balancing innovation with responsibility.',
            date: '1/9/25',
            link: '/posts/the-ethics-of-artificial-intelligence'
        },
        {
            title: 'AI in Everyday Life',
            subtitle: 'AI is seamlessly woven into our daily routines.',
            date: '12/12/24',
            link: '/posts/ai-in-everyday-life'
        }
    ];
</script>

<div class="container max-w-4xl mx-auto px-6 py-8 md:py-12 space-y-16">
    <!-- Category Header -->
    <section class="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <!-- Header with Button and Title -->
        <div class="flex items-center gap-4">
            <a
                href="/posts"
                class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-zinc-900 hover:bg-zinc-800 hover:text-accent-foreground px-2 py-1 text-zinc-400 group"
            >
                <ArrowRight
                    class="mr-2 h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1"
                />
                All writing
            </a>
            <h1 class="text-3xl font-bold tracking-tight text-white">Artificial Intelligence</h1>
        </div>

        <!-- Sub-nav Categories -->
        <div class="flex flex-wrap gap-6 pt-2">
            {#each topics as topic}
                <a
                    href="/topics/{topic.toLowerCase().replace(' ', '-')}"
                    class="group flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors"
                >
                    <span class="text-zinc-700 group-hover:text-zinc-400 transition-colors">↳</span>
                    {topic}
                </a>
            {/each}
        </div>

        <!-- Subtle Divider -->
        <Separator class="bg-zinc-900 mt-4" />
    </section>

    <!-- Post List -->
    <section>
        <ul class="space-y-2">
            {#each posts as post}
                <PostListItem {...post} />
            {/each}
        </ul>
    </section>

    <!-- Newsletter Section -->
    <section>
        <Newsletter />
    </section>

    <!-- Footer Section -->
    <Footer />
</div>
