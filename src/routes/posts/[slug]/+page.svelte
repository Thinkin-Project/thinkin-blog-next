<script lang="ts">
    import { ArrowRight, Calendar, Crosshair, Tag } from 'lucide-svelte';

    import AuthorBlock from '$lib/components/AuthorBlock.svelte';
    import Footer from '$lib/components/Footer.svelte';

    let { data } = $props();
</script>

<div class="container mx-auto max-w-3xl space-y-16 px-6 py-8 md:py-12">
    <!-- Breadcrumb -->
    <div class="animate-in delay-0 duration-700 fade-in slide-in-from-bottom-4">
        <a
            href="/posts"
            class="group inline-flex items-center justify-center rounded-md border border-input bg-zinc-900 px-2 py-1 text-sm font-medium whitespace-nowrap text-zinc-400 ring-offset-background transition-colors hover:bg-zinc-800 hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
            <ArrowRight
                class="mr-2 h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1"
            />
            所有文章
        </a>
    </div>

    <!-- Article Header -->
    <article class="animate-in space-y-12 delay-100 duration-700 fade-in slide-in-from-bottom-4">
        <header class="space-y-8">
            <div class="space-y-4">
                <h1 class="text-4xl leading-tight font-bold tracking-tight text-white md:text-5xl">
                    {data.meta.title}
                </h1>
                <p class="text-xl font-light text-zinc-500 md:text-2xl">
                    {data.meta.description}
                </p>
            </div>

            <div class="flex flex-wrap items-center gap-x-16 gap-y-6 text-sm">
                <div class="space-y-1">
                    <span class="flex items-center gap-2 text-zinc-500">
                        <Calendar class="h-3.5 w-3.5" /> 發佈時間
                    </span>
                    <span class="block font-medium text-white">{data.meta.date}</span>
                </div>
                <div class="space-y-1">
                    <span class="flex items-center gap-2 text-zinc-500">
                        <Crosshair class="h-3.5 w-3.5" /> 主題
                    </span>
                    <span class="block font-medium text-white">{data.meta.topic}</span>
                </div>
                {#if data.meta.tags && data.meta.tags.length > 0}
                    <div class="space-y-1">
                        <span class="flex items-center gap-2 text-zinc-500">
                            <Tag class="h-3.5 w-3.5" /> 標籤
                        </span>
                        <div class="flex flex-wrap gap-2">
                            {#each data.meta.tags as tag}
                                <span
                                    class="inline-flex items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-zinc-400"
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
            <div class="aspect-2/1 w-full overflow-hidden rounded-3xl border border-zinc-800">
                <img
                    src={data.meta.ogImage}
                    alt={data.meta.title}
                    class="h-full w-full object-cover"
                />
            </div>
        {/if}

        <!-- Body Content -->
        <div class="prose max-w-none text-lg leading-relaxed text-zinc-400 prose-zinc prose-invert">
            <data.content />
        </div>

        <!-- Author Block -->
        <AuthorBlock authorIds={data.meta.authors} />
    </article>

    <!-- Bottom Navigation -->
    {#if data.prev || data.next}
        <div
            class="flex animate-in items-center justify-between border-zinc-900 delay-200 duration-700 fade-in slide-in-from-bottom-4"
        >
            <div>
                {#if data.prev}
                    <a
                        href="/posts/{data.prev.slug}"
                        class="group inline-flex items-center justify-center rounded-md border border-input bg-zinc-900 px-2 py-1 text-sm font-medium whitespace-nowrap text-zinc-400 ring-offset-background transition-colors hover:bg-zinc-800 hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
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
                        class="group inline-flex items-center justify-center rounded-md border border-input bg-zinc-900 px-2 py-1 text-sm font-medium whitespace-nowrap text-zinc-400 ring-offset-background transition-colors hover:bg-zinc-800 hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
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
