<script lang="ts">
    import { ArrowRight } from 'lucide-svelte';

    let { title, subtitle, link } = $props<{
        title: string;
        subtitle: string;
        link: string;
    }>();
</script>

<a
    href={link}
    class="block group relative bg-zinc-900 hover:bg-zinc-800 transition-colors duration-300 p-4"
>
    <div class="flex items-center justify-between z-10 relative">
        <div class="space-y-1">
            <h3 class="text-xl font-medium text-zinc-100 group-hover:text-white transition-colors">
                {title}
            </h3>
            <p class="text-zinc-500 text-base">{subtitle}</p>
        </div>
        <ArrowRight
            class="h-5 w-5 text-zinc-600 group-hover:text-white transition-transform duration-300 group-hover:translate-x-1"
        />
    </div>
</a>
