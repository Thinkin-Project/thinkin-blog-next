<script lang="ts">
    import { onMount } from 'svelte';

    import { goto } from '$app/navigation';

    import Fuse from 'fuse.js';
    import { Calendar, FileText, Folder, Tag as TagIcon } from '@lucide/svelte';

    import {
        CommandDialog,
        CommandGroup,
        CommandInput,
        CommandItem,
        CommandList
    } from '$lib/components/ui/command';
    import { getTagName } from '$lib/constants/tags';
    import { getTopicName } from '$lib/constants/topics';
    import { searchState } from '$lib/states/search.svelte';
    import type { ArticleMeta } from '$lib/types';

    let query = $state('');
    let posts = $state<ArticleMeta[]>([]);
    let results = $state<ArticleMeta[]>([]);
    let fuse = $state<Fuse<ArticleMeta> | null>(null);

    let handleKeyDown: (e: KeyboardEvent) => void;

    onMount(() => {
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
                    threshold: 0.3,
                    ignoreLocation: true
                });
            } catch (err) {
                console.error('Failed to load search index:', err);
            }
        };

        handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                searchState.toggle();
            }
        };

        init();
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
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
        searchState.close();
        query = '';
        // 手動重置捲軸，確保新文章從頂端開始，避開舊文章的滾動位置干擾
        window.scrollTo(0, 0);
        goto(`/posts/${slug}`);
    }
</script>

<CommandDialog bind:open={searchState.isOpen} shouldFilter={false}>
    <CommandInput placeholder="搜尋文章標題、描述或主題..." bind:value={query} />
    <CommandList>
        {#if results.length === 0 && query.trim() !== ''}
            <div class="py-6 text-center text-sm text-muted-foreground">找不到相關文章</div>
        {:else if results.length > 0}
            <CommandGroup heading={query.trim() === '' ? '最近文章' : '搜尋結果'}>
                {#each results as post (post.slug)}
                    <CommandItem
                        value={post.title}
                        onSelect={() => handleSelect(post.slug)}
                        class="cursor-pointer py-3"
                    >
                        <div class="flex w-full items-start gap-3">
                            <div class="mt-4 rounded-full bg-primary/10 p-2 text-primary">
                                <FileText class="h-4 w-4" />
                            </div>
                            <div class="flex flex-col gap-1 overflow-hidden text-left">
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
