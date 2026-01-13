<script lang="ts">
    import { ChevronRight } from 'lucide-svelte';

    import Footer from '$lib/components/Footer.svelte';

    let { data } = $props();
</script>

<div class="container mx-auto px-6 py-8 md:py-12">
    <div class="flex flex-col gap-8 lg:flex-row lg:justify-center lg:gap-16">
        <!-- Main Content -->
        <div class="w-full max-w-3xl">
            <main class="space-y-16">
                <!-- Breadcrumb -->
                <div class="animate-in delay-0 duration-700 fade-in slide-in-from-bottom-4">
                    <a
                        href="/"
                        class="group inline-flex items-center justify-center rounded-md border border-input bg-card px-2 py-1 text-sm font-medium whitespace-nowrap text-muted-foreground ring-offset-background transition-colors hover:bg-secondary hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                    >
                        <ChevronRight
                            class="mr-1 h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1"
                        />
                        回首頁
                    </a>
                </div>

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
                        </div>
                    </header>

                    <!-- Body Content -->
                    <div
                        class="prose max-w-none text-lg leading-relaxed text-muted-foreground dark:prose-invert"
                    >
                        <data.content />
                    </div>

                    <div class="mt-8 border-t border-border pt-8">
                        <h2 class="mb-4 text-2xl font-bold">Cookie 管理</h2>
                        <p class="mb-4 text-muted-foreground">
                            您隨時可以調整及管理您的 Cookie 偏好。
                        </p>
                        <button
                            type="button"
                            class="inline-flex cursor-pointer items-center justify-center rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 active:scale-95"
                            onclick={() => {
                                if (typeof window !== 'undefined' && 'CookieConsent' in window) {
                                    window.CookieConsent.showPreferences();
                                }
                            }}
                        >
                            管理 Cookie 偏好
                        </button>
                    </div>
                </article>
            </main>
            <div class="mt-8">
                <Footer />
            </div>
        </div>
    </div>
</div>
