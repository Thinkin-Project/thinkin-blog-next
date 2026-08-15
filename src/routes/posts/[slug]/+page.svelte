<script lang="ts">
    import { mount, unmount } from 'svelte';

    import { page } from '$app/stores';

    import { Calendar, ChevronRight, Clock, Crosshair, Tag } from '@lucide/svelte';

    import AuthorBlock from '$lib/components/AuthorBlock.svelte';
    import BackToTop from '$lib/components/BackToTop.svelte';
    import CodeBlockCopyButton from '$lib/components/CodeBlockCopyButton.svelte';
    import Donate from '$lib/components/Donate.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Giscus from '$lib/components/Giscus.svelte';
    import ReadingProgressBar from '$lib/components/ReadingProgressBar.svelte';
    import ShareButtons from '$lib/components/ShareButtons.svelte';
    import TableOfContents from '$lib/components/TableOfContents.svelte';
    import { getTagName } from '$lib/constants/tags';
    import { getTopicName } from '$lib/constants/topics';

    let { data } = $props();

    $effect(() => {
        if (!data.content) return;
        if (typeof window === 'undefined') return;

        const cleanupTasks: Array<() => void> = [];
        const codeBlocks = document.querySelectorAll<HTMLElement>('.prose pre');

        for (const pre of codeBlocks) {
            if (pre.dataset.copyCodeReady === 'true') continue;

            const codeElement = pre.querySelector<HTMLElement>('code');
            if (!codeElement) continue;

            const buttonHost = document.createElement('div');
            buttonHost.className = 'code-button-host';
            pre.appendChild(buttonHost);
            pre.dataset.copyCodeReady = 'true';

            const mountedComponent = mount(CodeBlockCopyButton, {
                target: buttonHost,
                props: {
                    code: codeElement.textContent ?? ''
                }
            });

            cleanupTasks.push(() => {
                unmount(mountedComponent);
                buttonHost.remove();
                delete pre.dataset.copyCodeReady;
            });
        }

        return () => {
            for (const cleanup of cleanupTasks) cleanup();
        };
    });
</script>

<ReadingProgressBar />

<div class="container mx-auto px-6 py-8 md:py-12">
    <div class="flex flex-col gap-8 lg:flex-row lg:justify-center lg:gap-16">
        <!-- Left Share Sidebar (Desktop Only) -->
        <aside class="hidden lg:block">
            <div class="sticky top-32 flex flex-col items-center gap-4">
                <ShareButtons layout="vertical" title={data.meta.title} />
            </div>
        </aside>

        <!-- Main Content -->
        <div class="w-full max-w-3xl min-w-0">
            <main class="space-y-16">
                <!-- Breadcrumb -->
                <div class="animate-in delay-0 duration-700 fade-in slide-in-from-bottom-4">
                    <a
                        href="/posts"
                        class="group inline-flex items-center justify-center rounded-md border border-input bg-card px-2 py-1 text-sm font-medium whitespace-nowrap text-muted-foreground ring-offset-background transition-colors hover:bg-secondary hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                    >
                        <ChevronRight
                            class="mr-1 h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1"
                        />
                        所有文章
                    </a>
                </div>

                <!-- Article Header -->
                <article
                    class="animate-in space-y-12 delay-100 duration-700 fade-in slide-in-from-bottom-4"
                >
                    <header class="space-y-8">
                        <div class="space-y-4">
                            <h1
                                class="text-4xl leading-tight font-bold tracking-tight text-foreground md:text-5xl"
                            >
                                {data.meta.title}
                            </h1>
                            <p class="text-xl font-light text-muted-foreground md:text-2xl">
                                {data.meta.description}
                            </p>
                        </div>

                        <div class="flex flex-wrap items-center gap-x-16 gap-y-6 text-sm">
                            <div class="space-y-1">
                                <span class="flex items-center gap-2 text-muted-foreground">
                                    <Calendar class="h-3.5 w-3.5" /> 發佈時間
                                </span>
                                <span class="block font-medium text-foreground"
                                    >{data.meta.date}</span
                                >
                            </div>
                            {#if data.meta.readingTime}
                                <div class="space-y-1">
                                    <span class="flex items-center gap-2 text-muted-foreground">
                                        <Clock class="h-3.5 w-3.5" /> 閱讀時間
                                    </span>
                                    <span class="block font-medium text-foreground"
                                        >{data.meta.readingTime} 分鐘</span
                                    >
                                </div>
                            {/if}
                            <div class="space-y-1">
                                <span class="flex items-center gap-2 text-muted-foreground">
                                    <Crosshair class="h-3.5 w-3.5" /> 主題
                                </span>
                                <a
                                    href="/topics/{data.meta.topic}"
                                    class="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs font-medium whitespace-nowrap text-foreground transition-colors hover:bg-secondary/70 hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                                >
                                    {getTopicName(data.meta.topic)}
                                </a>
                            </div>
                            {#if data.meta.tags && data.meta.tags.length > 0}
                                <div class="space-y-1">
                                    <span class="flex items-center gap-2 text-muted-foreground">
                                        <Tag class="h-3.5 w-3.5" /> 標籤
                                    </span>
                                    <div class="flex flex-wrap gap-2">
                                        {#each data.meta.tags as tag (tag)}
                                            <a
                                                href="/tags/{tag}"
                                                class="inline-flex items-center justify-center rounded-md border border-border bg-secondary px-2 py-0.5 text-xs font-medium whitespace-nowrap text-foreground transition-colors hover:bg-secondary/70 hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                                            >
                                                {getTagName(tag)}
                                            </a>
                                        {/each}
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </header>

                    <!-- Hero Image Placeholder -->
                    {#if data.meta.ogImage}
                        <div
                            class="aspect-2/1 w-full overflow-hidden rounded-3xl border border-secondary"
                        >
                            <img
                                src={data.meta.ogImage}
                                alt={data.meta.title}
                                class="h-full w-full object-cover"
                            />
                        </div>
                    {/if}

                    <!-- Body Content -->
                    <div
                        class="prose max-w-none text-lg leading-relaxed text-muted-foreground dark:prose-invert"
                    >
                        <data.content />
                    </div>

                    <!-- Share Buttons (Bottom) -->
                    <div class="mt-16 space-y-6 border-t border-border pt-12">
                        <p class="text-center text-sm font-medium text-muted-foreground">
                            如果這篇文章對你有幫助，歡迎分享給更多人！
                        </p>
                        <ShareButtons title={data.meta.title} />
                    </div>

                    <!-- Donate Block -->
                    <Donate />

                    <!-- Author Block -->
                    <AuthorBlock authorIds={data.meta.authors} />

                    <!-- Giscus Comments -->
                    <Giscus />
                </article>

                {#if data.relatedPosts?.length}
                    <section class="space-y-6 border-t border-border pt-12">
                        <div class="space-y-3">
                            <div class="space-y-2">
                                <h2 class="text-2xl font-bold tracking-tight text-foreground">
                                    推推，這 {data.relatedPosts.length} 篇也值得你順手看完～
                                </h2>
                            </div>
                            <div class="space-y-4">
                                <p
                                    class="text-lg leading-relaxed font-medium text-muted-foreground"
                                >
                                    根據相同主題與共享標籤，幫你整理出最相關的延伸閱讀。
                                </p>
                            </div>
                        </div>

                        <div class="grid gap-4 md:grid-cols-3">
                            {#each data.relatedPosts as post (post.slug)}
                                <a
                                    href="/posts/{post.slug}"
                                    class="group flex h-full flex-col rounded-2xl border border-border bg-card/80 p-5 transition-colors hover:bg-secondary hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                                >
                                    <div
                                        class="mb-4 flex items-center gap-2 text-xs font-medium text-muted-foreground"
                                    >
                                        <span class="rounded-full bg-secondary px-2 py-1">
                                            {getTopicName(post.topic)}
                                        </span>
                                        <span>{post.date}</span>
                                    </div>

                                    <h3
                                        class="text-lg leading-snug font-semibold text-foreground transition-colors group-hover:text-accent-foreground"
                                    >
                                        {post.title}
                                    </h3>

                                    <p
                                        class="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground"
                                    >
                                        {post.description}
                                    </p>

                                    <span
                                        class="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-medium text-foreground"
                                    >
                                        前往閱讀
                                        <ChevronRight
                                            class="h-4 w-4 transition-transform group-hover:translate-x-1"
                                        />
                                    </span>
                                </a>
                            {/each}
                        </div>
                    </section>
                {/if}

                <!-- Bottom Navigation -->
                {#if data.prev || data.next}
                    <div
                        class="mt-10 flex animate-in items-center justify-between border-t border-border pt-10 delay-200 duration-700 fade-in slide-in-from-bottom-4"
                    >
                        <div>
                            {#if data.prev}
                                <a
                                    href="/posts/{data.prev.slug}"
                                    class="group inline-flex items-center justify-center rounded-md border border-input bg-card px-2 py-1 text-sm font-medium whitespace-nowrap text-muted-foreground ring-offset-background transition-colors hover:bg-secondary hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                                >
                                    <ChevronRight
                                        class="mr-1 h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1"
                                    />
                                    上一篇
                                </a>
                            {/if}
                        </div>

                        <div>
                            {#if data.next}
                                <a
                                    href="/posts/{data.next.slug}"
                                    class="group inline-flex items-center justify-center rounded-md border border-input bg-card px-2 py-1 text-sm font-medium whitespace-nowrap text-muted-foreground ring-offset-background transition-colors hover:bg-secondary hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                                >
                                    下一篇
                                    <ChevronRight
                                        class="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                                    />
                                </a>
                            {/if}
                        </div>
                    </div>
                {/if}

                <div class="animate-in delay-0 duration-700 fade-in slide-in-from-bottom-4">
                    <a
                        href="/posts"
                        class="group inline-flex items-center justify-center rounded-md border border-input bg-card px-2 py-1 text-sm font-medium whitespace-nowrap text-muted-foreground ring-offset-background transition-colors hover:bg-secondary hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                    >
                        <ChevronRight
                            class="mr-1 h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1"
                        />
                        所有文章
                    </a>
                </div>
            </main>
            <div class="mt-16">
                <Footer />
            </div>
        </div>

        <!-- Sidebar / Table of Contents -->
        <aside class="hidden w-64 shrink-0 lg:block">
            <div class="sticky top-24 space-y-8">
                {#key $page.params.slug}
                    <TableOfContents headings={data.headings} />
                {/key}
            </div>
        </aside>
    </div>
</div>

<BackToTop />
