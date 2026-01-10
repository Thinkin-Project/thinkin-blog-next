<script lang="ts">
    import { BookOpenText, Clock } from 'lucide-svelte';

    let { title, subtitle, description, date, readingTime, link } = $props<{
        title: string;
        subtitle?: string;
        description?: string;
        date: string;
        readingTime?: number;
        link: string;
    }>();
</script>

<li class="group list-none">
    <a
        href={link}
        class="-mx-3 flex flex-col justify-between rounded-lg px-3 py-3 transition-colors group-hover:bg-zinc-900/50 md:flex-row md:items-center"
    >
        <div class="relative flex items-center gap-3">
            <BookOpenText
                class="absolute left-0 h-5 w-5 -translate-x-4 text-primary opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100"
            />
            <div
                class="space-y-1 transition-transform duration-300 ease-out group-hover:translate-x-8"
            >
                <p class="text-lg font-medium transition-colors group-hover:text-primary">
                    {title}
                </p>
                <p class="text-sm text-muted-foreground">{description || subtitle}</p>
            </div>
        </div>
        <div
            class="mt-2 flex flex-col font-mono text-xs text-muted-foreground md:mt-0 md:items-end md:gap-1"
        >
            <span class="text-sm">{date}</span>
            {#if readingTime}
                <span class="flex items-center gap-2 text-sm opacity-80">
                    <Clock class="h-3 w-3" />
                    {readingTime} 分鐘
                </span>
            {/if}
        </div>
    </a>
</li>
