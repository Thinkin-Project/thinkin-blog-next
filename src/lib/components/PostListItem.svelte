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
        class="flex flex-col md:flex-row md:items-center justify-between py-3 group-hover:bg-zinc-900/50 rounded-lg px-3 transition-colors -mx-3"
    >
        <div class="flex items-center gap-3 relative">
            <BookOpenText
                class="h-5 w-5 text-primary opacity-0 -translate-x-4 absolute left-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out"
            />
            <div
                class="space-y-1 transition-transform duration-300 ease-out group-hover:translate-x-8"
            >
                <p class="text-lg font-medium group-hover:text-primary transition-colors">
                    {title}
                </p>
                <p class="text-sm text-muted-foreground">{description || subtitle}</p>
            </div>
        </div>
        <span class="text-sm text-muted-foreground mt-2 md:mt-0 font-mono">{date}</span>
    </a>
</li>
