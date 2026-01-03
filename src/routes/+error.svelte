<script lang="ts">
    import { ArrowRight } from 'lucide-svelte';
    import { Separator } from '$lib/components/ui/separator';
    import FeaturedPostListItem from '$lib/components/FeaturedPostListItem.svelte';
    import Footer from '$lib/components/Footer.svelte';

    const featuredPosts = [
        {
            title: 'Demystifying Continuous Integration',
            subtitle: 'How CI improves development workflows',
            link: '/posts/demystifying-continuous-integration'
        },
        {
            title: 'The Philosophy of AI Ethics',
            subtitle: 'Can machines make moral decisions?',
            link: '/posts/ai-ethics'
        },
        {
            title: 'The Role of Empathy in Design',
            subtitle: 'Why empathy is the key to great design.',
            link: '/posts/empathy-in-design'
        }
    ];
</script>

<div class="container max-w-4xl mx-auto px-6 py-8 md:py-12 space-y-12">
    <!-- Error Message Section -->
    <section class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-white">
            404 – This page doesn't exist
        </h1>

        <a
            href="/"
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-zinc-900 hover:bg-zinc-800 hover:text-accent-foreground px-2 py-1 text-zinc-400 group"
        >
            <ArrowRight
                class="mr-2 h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1"
            />
            Homepage
        </a>
    </section>

    <Separator class="bg-zinc-800" />

    <!-- Featured Posts (Styled as Home Page 'Featured Posts') -->
    <section class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <h2 class="text-2xl font-bold tracking-tight">Featured posts</h2>
        <div
            class="flex flex-col gap-px bg-zinc-800 rounded-3xl overflow-hidden border border-zinc-800"
        >
            {#each featuredPosts as post}
                <FeaturedPostListItem {...post} />
            {/each}
        </div>
    </section>

    <!-- Footer Section -->
    <Footer />
</div>
