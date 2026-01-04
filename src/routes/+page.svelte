<script lang="ts">
    import { ArrowRight } from 'lucide-svelte';
    import FeaturedPostListItem from '$lib/components/FeaturedPostListItem.svelte';
    import PostListItem from '$lib/components/PostListItem.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Hero from '$lib/components/Hero.svelte';
    import SocialLinks from '$lib/components/SocialLinks.svelte';

    // Placeholder data based on spec
    const featuredPosts = [
        {
            title: 'Why Walking Clears the Mind',
            subtitle: 'The science behind movement and creativity',
            date: '2/3/24',
            link: '/posts/why-walking-clears-the-mind'
        },
        {
            title: 'Why Nostalgia Shapes Modern Trends',
            subtitle: 'Looking back to move forward',
            date: '11/20/24',
            link: '/posts/why-nostalgia-shapes-modern-trends'
        },
        {
            title: 'The Philosophy of AI Ethics',
            subtitle: 'Navigating the moral landscape of the future',
            date: '1/23/25',
            link: '/posts/the-philosophy-of-ai-ethics'
        }
    ];

    const newPosts = [
        {
            title: 'Why Walking Clears the Mind',
            subtitle: 'Movement & Creativity',
            date: '2/3/24',
            link: '/posts/why-walking-clears-the-mind'
        },
        {
            title: 'Why Nostalgia Shapes Modern Trends',
            subtitle: 'Cultural Cycles',
            date: '11/20/24',
            link: '/posts/why-nostalgia-shapes-modern-trends'
        },
        {
            title: 'The Philosophy of AI Ethics',
            subtitle: 'Machine Morality',
            date: '1/23/25',
            link: '/posts/the-philosophy-of-ai-ethics'
        },
        {
            title: 'Demystifying Continuous Integration',
            subtitle: 'DevOps Basics',
            date: '1/6/25',
            link: '/posts/demystifying-continuous-integration'
        },
        {
            title: 'Why Code Reviews Are Essential',
            subtitle: 'Team Quality',
            date: '7/1/24',
            link: '/posts/why-code-reviews-are-essential'
        },
        {
            title: 'How AI Is Changing the Way We Work',
            subtitle: 'Future of Work',
            date: '1/16/25',
            link: '/posts/how-ai-is-changing-the-way-we-work'
        }
    ];

    import { SOCIAL_LINKS } from '$lib/constants/navigation';
</script>

<div class="container max-w-4xl mx-auto px-6 py-8 md:py-12 space-y-12">
    <!-- Hero Section -->
    <Hero />

    <!-- Links Section -->
    <SocialLinks links={SOCIAL_LINKS} />

    <hr />

    <!-- Featured Posts Section -->
    <section class="space-y-8">
        <h2 class="text-2xl font-bold tracking-tight">置頂文章</h2>
        <div
            class="flex flex-col gap-px bg-zinc-800 rounded-3xl overflow-hidden border border-zinc-800"
        >
            {#each featuredPosts as post}
                <FeaturedPostListItem {...post} />
            {/each}
        </div>
    </section>

    <hr />

    <!-- New Posts Section -->
    <section class="space-y-8">
        <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold tracking-tight">最新文章</h2>
            <a
                href="/posts"
                class="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 group"
            >
                所有文章 <ArrowRight class="h-4 w-4 transition-transform group-hover:-rotate-45" />
            </a>
        </div>
        <ul class="space-y-2">
            {#each newPosts as post}
                <PostListItem {...post} />
            {/each}
        </ul>
    </section>

    <!-- Footer Section -->
    <Footer />
</div>
