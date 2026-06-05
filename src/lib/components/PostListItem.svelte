<script lang="ts">
    import { BookOpenText, Calendar, Clock } from '@lucide/svelte';

    import { getTagName } from '$lib/constants/tags';

    let {
        title,
        subtitle,
        description,
        date,
        readingTime,
        link,
        tags = []
    } = $props<{
        title: string;
        subtitle?: string;
        description?: string;
        date: string;
        readingTime?: number;
        link: string;
        tags?: string[];
    }>();
</script>

<li class="group list-none">
    <a
        href={link}
        class="-mx-3 flex flex-col justify-between rounded-lg px-3 py-3 transition-colors hover:bg-secondary/50 md:flex-row md:items-center"
    >
        <div class="relative flex items-center gap-3">
            <BookOpenText
                class="absolute left-0 h-5 w-5 -translate-x-4 text-primary opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100"
            />
            <div
                class="space-y-1 transition-transform duration-300 ease-out group-hover:translate-x-8"
            >
                {#if tags && tags.length > 0}
                    <div class="flex flex-wrap gap-2">
                        {#each tags as tag (tag)}
                            <span
                                class="inline-flex items-center justify-center rounded-md border border-border bg-card px-2 py-0.5 text-xs font-medium whitespace-nowrap text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:text-primary"
                            >
                                {getTagName(tag)}
                            </span>
                        {/each}
                    </div>
                {/if}
                <p class="text-lg font-medium transition-colors group-hover:text-primary">
                    {title}
                </p>
                <p class="text-sm text-muted-foreground">{description || subtitle}</p>
            </div>
        </div>
        <div
            class="mt-2 flex flex-col font-mono text-xs text-muted-foreground md:mt-0 md:items-end md:gap-1"
        >
            <span class="flex items-center gap-2 text-sm opacity-80">
                <Calendar class="h-3 w-3" />
                {date}
            </span>
            {#if readingTime}
                <span class="flex items-center gap-2 text-sm opacity-80">
                    <Clock class="h-3 w-3" />
                    {readingTime} 分鐘
                </span>
            {/if}
        </div>
    </a>
</li>
