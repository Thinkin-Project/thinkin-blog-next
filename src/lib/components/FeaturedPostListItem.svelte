<script lang="ts">
    import { Pin } from 'lucide-svelte';

    let { title, subtitle, description, link } = $props<{
        title: string;
        subtitle?: string;
        description?: string;
        link: string;
    }>();
</script>

<a
    href={link}
    class="group relative block bg-zinc-900 p-4 transition-colors duration-300 hover:bg-zinc-800"
>
    <div class="relative z-10 flex items-center justify-between">
        <div class="space-y-1">
            <h3 class="text-xl font-medium text-foreground/90 transition-colors group-hover:text-foreground">
                {title}
            </h3>
            <p class="text-base text-muted-foreground">{description || subtitle}</p>
        </div>
        <Pin
            class="h-5 w-5 text-muted-foreground/60 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-foreground"
        />
    </div>
</a>
