<script lang="ts">
    import { onMount } from 'svelte';

    import { page } from '$app/state';

    import { Menu, X } from 'lucide-svelte';

    import Donate from '$lib/components/Donate.svelte';
    import PostSearch from '$lib/components/PostSearch.svelte';
    import SocialLinks from '$lib/components/SocialLinks.svelte';
    import { Button } from '$lib/components/ui/button';
    import { Separator } from '$lib/components/ui/separator';
    import { BLOG_CONFIG } from '$lib/constants/blog';
    import { NAV_ITEMS, SOCIAL_LINKS } from '$lib/constants/navigation';

    // Svelte 5 State
    let isMenuOpen = $state(false);

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

    function closeMenu() {
        isMenuOpen = false;
    }

    let currentTime = $state('--:--:-- --');

    onMount(() => {
        const updateTime = () => {
            const now = new Date();
            currentTime = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    });
</script>

<!-- Mobile Header (Visible only on mobile) -->
<header
    class="sticky top-0 z-50 flex items-center justify-between border-b bg-background p-6 md:hidden"
>
    <div class="flex items-center gap-3">
        <span class="text-lg font-bold">{BLOG_CONFIG.name}</span>
    </div>
    <div class="flex items-center gap-2">
        <PostSearch variant="icon" />
        <Button variant="ghost" size="icon" onclick={toggleMenu} class="cursor-pointer">
            <Menu class="h-6 w-6" />
        </Button>
    </div>
</header>

<!-- Mobile Menu Overlay -->
{#if isMenuOpen}
    <div
        class="fixed inset-0 z-50 flex animate-in flex-col bg-background p-6 duration-300 slide-in-from-left md:hidden"
    >
        <div class="mb-8 flex items-center justify-between">
            <span class="text-lg font-bold">選單</span>
            <Button variant="ghost" size="icon" onclick={toggleMenu} class="cursor-pointer">
                <X class="h-6 w-6" />
            </Button>
        </div>

        <nav class="flex flex-1 flex-col text-lg">
            <div class="flex flex-col gap-6">
                {#each NAV_ITEMS as item}
                    <a
                        href={item.href}
                        class="flex items-center gap-3 font-medium transition-colors {page.url
                            .pathname === item.href
                            ? 'text-foreground'
                            : 'text-muted-foreground hover:text-primary'}"
                        onclick={closeMenu}
                    >
                        <item.icon class="h-5 w-5" />
                        {item.name}
                    </a>
                {/each}
            </div>

            <Separator class="my-8 bg-zinc-800" />

            <SocialLinks links={SOCIAL_LINKS} onclick={closeMenu} />

            <div class="mt-auto pt-8">
                <Donate variant="sidebar" />
            </div>
        </nav>
    </div>
{/if}

<!-- Left Sidebar (Desktop Profile) -->
<nav
    class="z-40 hidden w-full flex-col justify-between border-b bg-background/95 p-8 backdrop-blur md:sticky md:top-0 md:flex md:h-screen md:w-80 md:border-r md:border-b-0"
>
    <div class="space-y-6">
        <div class="flex items-center gap-4">
            <div>
                <h2 class="text-xl font-bold tracking-tight">{BLOG_CONFIG.name}</h2>
                <p class="text-sm text-muted-foreground">{currentTime}</p>
            </div>
        </div>

        <div>
            <p class="text-sm leading-relaxed text-muted-foreground">
                {BLOG_CONFIG.description}
            </p>
        </div>

        <PostSearch />

        <!-- Navigation Links -->
        <div class="flex flex-col gap-6 pt-2">
            {#each NAV_ITEMS as item}
                <a
                    href={item.href}
                    class="flex items-center gap-3 font-medium transition-colors {page.url
                        .pathname === item.href
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-primary'}"
                >
                    <item.icon class="h-4 w-4" />
                    {item.name}
                </a>
            {/each}
        </div>
    </div>

    <div class="pt-8">
        <Donate variant="sidebar" />
    </div>
</nav>
