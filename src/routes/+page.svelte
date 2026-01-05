<script lang="ts">
    import { ArrowRight } from 'lucide-svelte';

    import FeaturedPostListItem from '$lib/components/FeaturedPostListItem.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Hero from '$lib/components/Hero.svelte';
    import PostListItem from '$lib/components/PostListItem.svelte';
    import SocialLinks from '$lib/components/SocialLinks.svelte';
    import { SOCIAL_LINKS } from '$lib/constants/navigation';

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
            class="flex flex-col gap-px overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-800"
        >
            {#each featuredPosts as post}
                <FeaturedPostListItem {...post} />
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
            {#each newPosts as post}
                <PostListItem {...post} />
            {/each}
        </ul>
    </section>

    <!-- Footer Section -->
    <Footer />
</div>
