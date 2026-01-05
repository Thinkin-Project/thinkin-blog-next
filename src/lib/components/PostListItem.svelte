<script lang="ts">
    import { BookOpenText } from 'lucide-svelte';

    let { title, subtitle, description, date, link } = $props<{
        title: string;
        subtitle?: string;
        description?: string;
        date: string;
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
        <span class="mt-2 font-mono text-sm text-muted-foreground md:mt-0">{date}</span>
    </a>
</li>
