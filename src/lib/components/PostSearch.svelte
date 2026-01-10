<script lang="ts">
    import { onMount } from 'svelte';
    import {
        CommandDialog,
        CommandInput,
        CommandList,
        CommandEmpty,
        CommandGroup,
        CommandItem
    } from '$lib/components/ui/command';
    import { Button } from '$lib/components/ui/button';
    import { getTopicName } from '$lib/constants/topics';
    import { getTagName } from '$lib/constants/tags';
    import { Search, FileText, Calendar, Tag as TagIcon, Folder } from 'lucide-svelte';
    import Fuse from 'fuse.js';
    import type { ArticleMeta } from '$lib/types';
    import { goto } from '$app/navigation';
    import { cn } from '$lib/utils';

    interface Props {
        variant?: 'default' | 'icon';
    }

    let { variant = 'default' }: Props = $props();

    let open = $state(false);
    let query = $state('');
    let posts = $state<ArticleMeta[]>([]);
    let results = $state<ArticleMeta[]>([]);
    let fuse = $state<Fuse<ArticleMeta> | null>(null);

    onMount(() => {
        let handleKeyDown: (e: KeyboardEvent) => void;

        const init = async () => {
            try {
                const response = await fetch('/api/posts');
                posts = await response.json();

                fuse = new Fuse(posts, {
                    keys: [
                        { name: 'title', weight: 1.0 },
                        { name: 'description', weight: 0.7 },
                        { name: 'topic', weight: 0.5 },
                        { name: 'tags', weight: 0.5 }
                    ],
                    threshold: 0.3, // 更嚴格一點，提升精準度
                    ignoreLocation: true
                });

                handleKeyDown = (e: KeyboardEvent) => {
                    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        open = !open;
                    }
                };

                document.addEventListener('keydown', handleKeyDown);
            } catch (err) {
                console.error('Failed to load search index:', err);
            }
        };

        init();

        return () => {
            if (handleKeyDown) {
                document.removeEventListener('keydown', handleKeyDown);
            }
        };
    });

    $effect(() => {
        if (!fuse) return;
        if (query.trim() === '') {
            results = posts.slice(0, 5); // 預設顯示最近 5 篇
        } else {
            const fuseResults = fuse.search(query);
            results = fuseResults.map((r) => r.item);
        }
    });

    function handleSelect(slug: string) {
        open = false;
        query = '';
        goto(`/posts/${slug}`);
    }
</script>

{#if variant === 'default'}
    <button
        onclick={() => (open = true)}
        class="flex w-full cursor-pointer items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
    >
        <Search class="h-4 w-4" />
        <span>搜尋文章...</span>
        <kbd
            class="pointer-events-none ml-auto hidden h-5 items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex"
        >
            <span class="text-xs">⌘</span>K
        </kbd>
    </button>
{:else}
    <Button
        variant="ghost"
        size="icon"
        onclick={() => (open = true)}
        class="cursor-pointer"
        aria-label="搜尋文章"
    >
        <Search class="h-6 w-6" />
    </Button>
{/if}

<CommandDialog bind:open shouldFilter={false}>
    <CommandInput placeholder="搜尋文章標題、描述或主題..." bind:value={query} />
    <CommandList>
        {#if results.length === 0 && query.trim() !== ''}
            <div class="py-6 text-center text-sm text-muted-foreground">找不到相關文章</div>
        {:else if results.length > 0}
            <CommandGroup heading={query.trim() === '' ? '最近文章' : '搜尋結果'}>
                {#each results as post}
                    <CommandItem
                        value={post.title}
                        onSelect={() => handleSelect(post.slug)}
                        class="cursor-pointer py-3"
                    >
                        <div class="flex w-full items-start gap-3">
                            <div class="mt-4 rounded-full bg-primary/10 p-2 text-primary">
                                <FileText class="h-4 w-4" />
                            </div>
                            <div class="flex flex-col gap-1 overflow-hidden">
                                <span class="truncate font-bold text-foreground">{post.title}</span>
                                <span class="line-clamp-1 text-xs text-muted-foreground">
                                    {post.description}
                                </span>
                                <div
                                    class="mt-1 flex items-center gap-3 text-[10px] text-muted-foreground"
                                >
                                    <span class="flex items-center gap-1 uppercase">
                                        <Calendar class="h-3 w-3" />
                                        {post.date}
                                    </span>
                                    <span class="flex items-center gap-1">
                                        <Folder class="h-3 w-3" />
                                        {getTopicName(post.topic)}
                                    </span>
                                    {#if post.tags && post.tags.length > 0}
                                        <span class="flex items-center gap-1">
                                            <TagIcon class="h-3 w-3" />
                                            {post.tags.slice(0, 2).map(getTagName).join(', ')}
                                        </span>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    </CommandItem>
                {/each}
            </CommandGroup>
        {/if}
    </CommandList>
</CommandDialog>
