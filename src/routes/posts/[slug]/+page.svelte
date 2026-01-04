<script lang="ts">
    import { ArrowRight, Calendar, Tag } from 'lucide-svelte';
    import Footer from '$lib/components/Footer.svelte';
    import AuthorBlock from '$lib/components/AuthorBlock.svelte';

    let { data } = $props();

    // 格式化日期
    const formattedDate = $derived(
        new Date(data.meta.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    );
</script>

<div class="container max-w-3xl mx-auto px-6 py-8 md:py-12 space-y-16">
    <!-- Breadcrumb -->
    <div class="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <a
            href="/posts"
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-zinc-900 hover:bg-zinc-800 hover:text-accent-foreground px-2 py-1 text-zinc-400 group"
        >
            <ArrowRight
                class="mr-2 h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1"
            />
            All posts
        </a>
    </div>

    <!-- Article Header -->
    <article class="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <header class="space-y-8">
            <div class="space-y-4">
                <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                    {data.meta.title}
                </h1>
                <p class="text-xl md:text-2xl text-zinc-500 font-light">
                    {data.meta.description}
                </p>
            </div>

            <div class="flex items-center gap-16 text-sm">
                <div class="space-y-1">
                    <span class="text-zinc-500 flex items-center gap-2">
                        <Calendar class="w-3.5 h-3.5" /> Published
                    </span>
                    <span class="text-white font-medium block">{formattedDate}</span>
                </div>
                <div class="space-y-1">
                    <span class="text-zinc-500 flex items-center gap-2">
                        <Tag class="w-3.5 h-3.5" /> Topic
                    </span>
                    <span class="text-white font-medium block">{data.meta.topic}</span>
                </div>
            </div>
        </header>

        <!-- Hero Image Placeholder -->
        {#if data.meta.ogImage}
            <div class="w-full aspect-2/1 rounded-3xl overflow-hidden border border-zinc-800">
                <img
                    src={data.meta.ogImage}
                    alt={data.meta.title}
                    class="w-full h-full object-cover"
                />
            </div>
        {:else}
            <div
                class="w-full aspect-2/1 bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden flex items-center justify-center"
            >
                <span class="text-zinc-700 italic">No Hero Image</span>
            </div>
        {/if}

        <!-- Body Content -->
        <div class="prose prose-invert prose-zinc max-w-none text-lg leading-relaxed text-zinc-400">
            <data.content />
        </div>

        <!-- Author Block -->
        <AuthorBlock authorIds={data.meta.authors} />
    </article>

    <!-- Bottom Navigation -->
    <div class="flex items-center justify-between pt-8 border-zinc-900">
        <a
            href="/posts"
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-zinc-900 hover:bg-zinc-800 hover:text-accent-foreground px-2 py-1 text-zinc-400 group"
        >
            <ArrowRight
                class="mr-2 h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1"
            />
            Back to posts
        </a>
    </div>

    <!-- Footer Section -->
    <Footer />
</div>
