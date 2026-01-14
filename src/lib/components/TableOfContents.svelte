<script lang="ts">
    import { tick } from 'svelte';

    import { pushState } from '$app/navigation';

    interface Heading {
        level: number;
        title: string;
        slug: string;
    }

    type NestedHeading = Heading & { children: Heading[] };

    let { headings = [] }: { headings: Heading[] } = $props();

    let activeId = $state('');

    // 將平鋪的標題轉換為樹狀結構（僅處理 H2 和 H3）
    let nestedHeadings = $derived.by(() => {
        const result: NestedHeading[] = [];
        let currentH2: NestedHeading | null = null;

        headings.forEach((h) => {
            if (h.level === 2) {
                currentH2 = { ...h, children: [] };
                result.push(currentH2);
            } else if (h.level === 3 && currentH2) {
                currentH2.children.push(h);
            } else if (h.level <= 2) {
                // H1 或其他，當作一般層級處理
                result.push({ ...h, children: [] });
                currentH2 = null;
            } else {
                // 孤立的 H3 等，直接放入
                result.push({ ...h, children: [] });
            }
        });
        return result;
    });

    $effect(() => {
        // 核心觀察邏輯：僅負責監測當前文章的標題進入視窗的狀態
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        activeId = entry.target.id;
                    }
                });
            },
            { rootMargin: '-100px 0% -80% 0%' }
        );

        tick().then(() => {
            headings.forEach((heading) => {
                const el = document.getElementById(heading.slug);
                if (el) observer.observe(el);
            });
        });

        return () => observer.disconnect();
    });

    const scrollTo = (e: MouseEvent, slug: string) => {
        e.preventDefault();
        const el = document.getElementById(slug);
        if (el) {
            const offset = 100; // 考量到固定導航列的高度
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = el.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // 手動更新 activeId，因為 smooth scroll 可能太快或太慢導致 observer 回報延遲
            activeId = slug;
            pushState(`#${slug}`, {});
        }
    };

    // 判斷該章節（H2）或其子項目（H3）是否處於活動狀態
    const isSectionActive = (section: NestedHeading) => {
        if (activeId === section.slug) return true;
        return section.children.some((child) => child.slug === activeId);
    };
</script>

<nav class="space-y-4">
    <p class="text-xs font-bold tracking-widest text-muted-foreground uppercase">文章目錄</p>
    <ul class="toc-root space-y-1">
        {#each nestedHeadings as section (section.slug)}
            <li>
                <a
                    href="#{section.slug}"
                    onclick={(e) => scrollTo(e, section.slug)}
                    class="block py-1.5 pl-4 text-sm transition-colors duration-200 hover:text-foreground
                    {activeId === section.slug
                        ? 'font-medium text-foreground'
                        : 'text-muted-foreground'}"
                >
                    {section.title}
                </a>

                {#if section.children.length > 0 && isSectionActive(section)}
                    <ul class="mt-1 mb-2 ml-4 space-y-1 border-l border-border">
                        {#each section.children as child (child.slug)}
                            <li>
                                <a
                                    href="#{child.slug}"
                                    onclick={(e) => scrollTo(e, child.slug)}
                                    class="block py-1 pl-4 text-xs transition-colors duration-200 hover:text-foreground
                                    {activeId === child.slug
                                        ? 'font-medium text-foreground'
                                        : 'text-muted-foreground'}"
                                >
                                    {child.title}
                                </a>
                            </li>
                        {/each}
                    </ul>
                {/if}
            </li>
        {/each}
    </ul>
</nav>

<style>
    /* 這裡可以加一些微調的樣式，例如左側的指示條 */
    .toc-root {
        border-left: 1px solid var(--border);
    }

    a {
        position: relative;
        display: block;
        width: 100%;
    }

    .text-foreground::before {
        content: '';
        position: absolute;
        left: -1px;
        top: 0;
        bottom: 0;
        width: 2px;
        background-color: var(--foreground);
        z-index: 10;
    }
</style>
