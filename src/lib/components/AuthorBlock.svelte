<script lang="ts">
    import * as Avatar from '$lib/components/ui/avatar';
    import { authors } from '$lib/constants/authors';
    import type { Author } from '$lib/types';
    import { Github, Globe } from 'lucide-svelte';

    let { authorIds = [] }: { authorIds?: string[] } = $props();

    // 獲取作者詳細資訊
    const postAuthors = $derived(
        authorIds
            .map((id) => authors[id])
            .filter((author): author is Author => author !== undefined)
    );
</script>

{#if postAuthors.length > 0}
    <div
        class="mt-16 pt-8 border-t border-zinc-900"
    >
        <h3 class="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-6">
            {postAuthors.length > 1 ? '作者群' : '作者'}
        </h3>

        <div class="grid gap-8">
            {#each postAuthors as author}
                <div class="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <Avatar.Root class="w-20 h-20 border border-zinc-800">
                        <Avatar.Image src={author.avatar} alt={author.name} />
                        <Avatar.Fallback>{author.name.slice(0, 2).toUpperCase()}</Avatar.Fallback>
                    </Avatar.Root>

                    <div class="flex-1 space-y-2">
                        <div class="flex items-center justify-between">
                            <h4 class="text-xl font-bold text-white">{author.name}</h4>
                            <div class="flex items-center gap-3">
                                {#if author.website}
                                    <a
                                        href={author.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="text-zinc-500 hover:text-white transition-colors"
                                    >
                                        <Globe class="w-4 h-4" />
                                    </a>
                                {/if}
                                {#if author.github}
                                    <a
                                        href={author.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="text-zinc-500 hover:text-white transition-colors"
                                    >
                                        <Github class="w-4 h-4" />
                                    </a>
                                {/if}
                            </div>
                        </div>
                        <p class="text-zinc-400 text-sm leading-relaxed max-w-2xl">
                            {author.bio}
                        </p>
                    </div>
                </div>
            {/each}
        </div>
    </div>
{/if}
