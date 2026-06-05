<script lang="ts">
    import { Calendar, Clock, Pin } from '@lucide/svelte';

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

<a
    href={link}
    class="group relative block bg-card p-4 transition-colors duration-300 hover:bg-secondary/50"
>
    <div class="relative z-10 flex items-center justify-between">
        <div class="space-y-1">
            {#if tags && tags.length > 0}
                <div class="mb-2 flex flex-wrap gap-2">
                    {#each tags as tag (tag)}
                        <span
                            class="inline-flex items-center justify-center rounded-md border border-border bg-background px-2 py-0.5 text-xs font-medium whitespace-nowrap text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:text-primary"
                        >
                            {getTagName(tag)}
                        </span>
                    {/each}
                </div>
            {/if}
            <h3
                class="text-xl font-medium text-foreground/90 transition-colors group-hover:text-foreground"
            >
                {title}
            </h3>
            <p class="text-base text-muted-foreground">{description || subtitle}</p>
            <div class="flex items-center gap-2">
                <p class="flex items-center gap-2 text-sm text-muted-foreground/80">
                    <Calendar class="h-3 w-3" />
                    {date}
                </p>
                {#if readingTime}
                    <p class="flex items-center gap-2 text-sm text-muted-foreground/80">
                        <Clock class="h-3 w-3" />
                        {readingTime} 分鐘
                    </p>
                {/if}
            </div>
        </div>
        <Pin
            class="h-5 w-5 text-muted-foreground/60 transition-transform duration-300 group-hover:rotate-270 group-hover:text-foreground"
        />
    </div>
</a>
