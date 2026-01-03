<script lang="ts">
    import PostListItem from '$lib/components/PostListItem.svelte';
    import Newsletter from '$lib/components/Newsletter.svelte';
    import Footer from '$lib/components/Footer.svelte';

    const topics = ['Artificial Intelligence', 'Design', 'Engineering', 'Thoughts'];

    const allPosts = [
        {
            title: 'Why Walking Clears the Mind',
            subtitle: 'The surprising benefits of a simple stroll',
            date: '2/3/24',
            link: '/posts/why-walking-clears-the-mind'
        },
        {
            title: 'Why Nostalgia Shapes Modern Trends',
            subtitle: 'The pull of the past in a digital world',
            date: '11/20/24',
            link: '/posts/why-nostalgia-shapes-modern-trends'
        },
        {
            title: 'The Philosophy of AI Ethics',
            subtitle: 'Can machines make moral decisions?',
            date: '1/23/25',
            link: '/posts/the-philosophy-of-ai-ethics'
        },
        {
            title: 'Demystifying Continuous Integration',
            subtitle: 'How CI improves development workflows',
            date: '1/6/25',
            link: '/posts/demystifying-continuous-integration'
        },
        {
            title: 'Why Code Reviews Are Essential',
            subtitle: 'The power of collaboration in coding',
            date: '7/1/24',
            link: '/posts/why-code-reviews-are-essential'
        },
        {
            title: 'How AI Is Changing the Way We Work',
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
        },
        {
            title: 'The Role of Empathy in Design',
            subtitle: 'Why empathy is the key to great design.',
            date: '12/2/24',
            link: '/posts/the-role-of-empathy-in-design'
        },
        {
            title: 'Why Microinteractions Matter in UX',
            subtitle: 'Small details, big impact on user experience.',
            date: '11/20/24',
            link: '/posts/why-microinteractions-matter-in-ux'
        },
        {
            title: 'The Importance of Iteration in Design',
            subtitle: 'Iteration leads to better design outcomes.',
            date: '3/24/24',
            link: '/posts/the-importance-of-iteration-in-design'
        },
        {
            title: 'The Rise of Edge Computing',
            subtitle: 'Why edge computing is the future of tech',
            date: '8/22/24',
            link: '/posts/the-rise-of-edge-computing'
        }
    ];
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
            {#each allPosts as post}
                <PostListItem {...post} />
            {/each}
        </ul>
    </section>

    <!-- Newsletter Section -->
    <Newsletter />

    <!-- Footer Section -->
    <Footer />
</div>
