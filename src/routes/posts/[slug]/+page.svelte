<script lang="ts">
    import { ArrowRight, Calendar, Crosshair, Tag } from 'lucide-svelte';
    import Footer from '$lib/components/Footer.svelte';
    import AuthorBlock from '$lib/components/AuthorBlock.svelte';

    let { data } = $props();
</script>

<div class="container max-w-3xl mx-auto px-6 py-8 md:py-12 space-y-16">
    <!-- Breadcrumb -->
    <div class="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-0">
        <a
            href="/posts"
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-zinc-900 hover:bg-zinc-800 hover:text-accent-foreground px-2 py-1 text-zinc-400 group"
        >
            <ArrowRight
                class="mr-2 h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1"
            />
            所有文章
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

            <div class="flex flex-wrap items-center gap-x-16 gap-y-6 text-sm">
                <div class="space-y-1">
                    <span class="text-zinc-500 flex items-center gap-2">
                        <Calendar class="w-3.5 h-3.5" /> 發佈時間
                    </span>
                    <span class="text-white font-medium block">{data.meta.date}</span>
                </div>
                <div class="space-y-1">
                    <span class="text-zinc-500 flex items-center gap-2">
                        <Crosshair class="w-3.5 h-3.5" /> 主題
                    </span>
                    <span class="text-white font-medium block">{data.meta.topic}</span>
                </div>
                {#if data.meta.tags && data.meta.tags.length > 0}
                    <div class="space-y-1">
                        <span class="text-zinc-500 flex items-center gap-2">
                            <Tag class="w-3.5 h-3.5" /> 標籤
                        </span>
                        <div class="flex flex-wrap gap-2">
                            {#each data.meta.tags as tag}
                                <span
                                    class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-zinc-400"
                                >
                                    #{tag}
                                </span>
                            {/each}
                        </div>
                    </div>
                {/if}
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
    {#if data.prev || data.next}
        <div class="flex items-center justify-between border-zinc-900 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <div>
                {#if data.prev}
                    <a
                        href="/posts/{data.prev.slug}"
                        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-zinc-900 hover:bg-zinc-800 hover:text-accent-foreground px-2 py-1 text-zinc-400 group"
                    >
                        <ArrowRight
                            class="mr-2 h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1"
                        />
                        上一篇
                    </a>
                {/if}
            </div>

            <div>
                {#if data.next}
                    <a
                        href="/posts/{data.next.slug}"
                        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-zinc-900 hover:bg-zinc-800 hover:text-accent-foreground px-2 py-1 text-zinc-400 group"
                    >
                        下一篇
                        <ArrowRight
                            class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                        />
                    </a>
                {/if}
            </div>
        </div>
    {/if}

    <!-- Footer Section -->
    <Footer />
</div>
