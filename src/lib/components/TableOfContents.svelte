<script lang="ts">
    import { tick } from 'svelte';

    import { pushState } from '$app/navigation';

    interface Heading {
        level: number;
        title: string;
        slug: string;
    }

    let { headings = [] }: { headings: Heading[] } = $props();

    let activeId = $state('');

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
</script>

<nav class="space-y-4">
    <p class="text-xs font-bold tracking-widest text-muted-foreground uppercase">文章目錄</p>
    <ul class="space-y-2.5">
        {#each headings as heading}
            <li>
                <a
                    href="#{heading.slug}"
                    onclick={(e) => scrollTo(e, heading.slug)}
                    class="block text-sm transition-colors duration-200 hover:text-foreground
                    {heading.level === 3 ? 'pl-8' : 'pl-4'}
                    {activeId === heading.slug
                        ? 'font-medium text-foreground'
                        : 'text-muted-foreground'}"
                >
                    {heading.title}
                </a>
            </li>
        {/each}
    </ul>
</nav>

<style>
    /* 這裡可以加一些微調的樣式，例如左側的指示條 */
    ul {
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
