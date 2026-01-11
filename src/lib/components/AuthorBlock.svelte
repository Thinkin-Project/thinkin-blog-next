<script lang="ts">
    import { Facebook, Github, Globe, Linkedin, X } from '$lib/components/icons';
    import * as Avatar from '$lib/components/ui/avatar';
    import { AUTHORS } from '$lib/constants/authors';
    import type { Author } from '$lib/types';

    let { authorIds = [] }: { authorIds?: string[] } = $props();

    // 獲取作者詳細資訊
    const postAuthors = $derived(
        authorIds
            .map((id) => AUTHORS[id])
            .filter((author): author is Author => author !== undefined)
    );
</script>

{#if postAuthors.length > 0}
    <div class="mt-16 border-t border-border pt-12">
        <h3 class="mb-6 text-sm font-semibold tracking-wider text-zinc-500 uppercase">
            {postAuthors.length > 1 ? '作者群' : '作者'}
        </h3>

        <div class="grid gap-8">
            {#each postAuthors as author}
                <div class="flex w-full flex-col gap-6 md:flex-row md:items-center">
                    <Avatar.Root
                        class="h-20 w-20 shrink-0 self-start border border-border md:self-auto"
                    >
                        <Avatar.Image src={author.avatar} alt={author.name} />
                        <Avatar.Fallback>{author.name.slice(0, 2).toUpperCase()}</Avatar.Fallback>
                    </Avatar.Root>

                    <div class="w-full flex-1 space-y-2">
                        <div class="flex items-center justify-between">
                            <h4 class="text-xl font-bold text-foreground">{author.name}</h4>
                            <div class="flex items-center gap-3">
                                {#if author.website}
                                    <a
                                        href={author.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        <Globe class="h-4 w-4" />
                                    </a>
                                {/if}
                                {#if author.github}
                                    <a
                                        href={author.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        <Github class="h-4 w-4" />
                                    </a>
                                {/if}
                                {#if author.linkedin}
                                    <a
                                        href={author.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        <Linkedin class="h-4 w-4" />
                                    </a>
                                {/if}
                                {#if author.facebook}
                                    <a
                                        href={author.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        <Facebook class="h-4 w-4" />
                                    </a>
                                {/if}
                                {#if author.x}
                                    <a
                                        href={author.x}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        <X class="h-4 w-4" />
                                    </a>
                                {/if}
                            </div>
                        </div>
                        <p class="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                            {author.bio}
                        </p>
                    </div>
                </div>
            {/each}
        </div>
    </div>
{/if}
