<script lang="ts">
    import { BLOG_CONFIG } from '$lib/constants/blog';

    const blogNameParts = BLOG_CONFIG.name.split(' ');
    const firstPart = blogNameParts[0];
    const secondPart = blogNameParts.slice(1).join(' ');
</script>

<section class="space-y-8">
    <h1 class="text-5xl font-bold tracking-tighter text-white md:text-7xl">
        {firstPart} <span
            class="bg-linear-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
            >{secondPart}</span
        >
    </h1>
    <div class="max-w-2xl space-y-6">
        <p class="text-xl leading-relaxed font-light text-muted-foreground md:text-2xl">
            {BLOG_CONFIG.description.split('，')[0]}。
            <span class="font-medium text-foreground">所見、所聞、所覺、所知</span>。追求高效的
            <span class="text-blue-400">工程實踐</span>，熱衷於
            <span class="text-purple-400">技術分享</span>
            與 <span class="text-pink-400">持續學習</span>。
        </p>
    </div>
</section>
