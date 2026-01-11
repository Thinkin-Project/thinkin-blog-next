<script lang="ts">
    import { ChevronLeft, ChevronRight } from 'lucide-svelte';

    interface Props {
        currentPage: number;
        totalPages: number;
    }

    let { currentPage, totalPages }: Props = $props();

    // 分頁邏輯：顯示第一頁、最後一頁、當前頁及其前後各一頁
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const range = 1; // 當前頁前後顯示的數量

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 || // 第一頁
                i === totalPages || // 最後一頁
                (i >= currentPage - range && i <= currentPage + range) // 當前頁鄰近範圍
            ) {
                if (pages.length > 0 && typeof pages[pages.length - 1] === 'number') {
                    const lastNum = pages[pages.length - 1] as number;
                    if (i - lastNum === 2) {
                        pages.push(i - 1); // 補齊細微差距，避免出現 1 ... 3 這種情況
                    } else if (i - lastNum > 2) {
                        pages.push('...');
                    }
                }
                pages.push(i);
            }
        }
        return pages;
    };

    const pages = $derived(getPageNumbers());
</script>

{#if totalPages > 1}
    <div class="mt-12 flex items-center justify-center gap-4">
        <a
            href={currentPage > 1 ? `?page=${currentPage - 1}` : undefined}
            class="group inline-flex items-center justify-center rounded-md border border-input bg-card px-2 py-1 text-sm font-medium whitespace-nowrap text-muted-foreground ring-offset-background transition-colors hover:bg-secondary hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 {currentPage ===
            1
                ? 'pointer-events-none opacity-50'
                : ''}"
        >
            <ChevronLeft class="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            上一頁
        </a>

        <div class="flex items-center gap-1">
            {#each pages as pageNum}
                {#if pageNum === '...'}
                    <span class="flex h-8 w-8 items-center justify-center text-zinc-500">
                        ...
                    </span>
                {:else}
                    <a
                        href="?page={pageNum}"
                        class="flex h-8 w-8 items-center justify-center rounded-md border text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 {currentPage ===
                        pageNum
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-transparent text-muted-foreground hover:bg-secondary'}"
                    >
                        {pageNum}
                    </a>
                {/if}
            {/each}
        </div>

        <a
            href={currentPage < totalPages ? `?page=${currentPage + 1}` : undefined}
            class="group inline-flex items-center justify-center rounded-md border border-input bg-card px-2 py-1 text-sm font-medium whitespace-nowrap text-muted-foreground ring-offset-background transition-colors hover:bg-secondary hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 {currentPage ===
            totalPages
                ? 'pointer-events-none opacity-50'
                : ''}"
        >
            下一頁
            <ChevronRight class="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
    </div>
{/if}
