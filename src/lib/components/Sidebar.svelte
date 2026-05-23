<script lang="ts">
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';

    import { page } from '$app/state';

    import favicon from '$lib/assets/favicon.ico';
    import { ChevronsLeft, ChevronsRight, Menu, X } from 'lucide-svelte';

    import Donate from '$lib/components/Donate.svelte';
    import PostSearch from '$lib/components/PostSearch.svelte';
    import SocialLinks from '$lib/components/SocialLinks.svelte';
    import ThemeToggle from '$lib/components/ThemeToggle.svelte';
    import { Button } from '$lib/components/ui/button';
    import { Separator } from '$lib/components/ui/separator';
    import { BLOG_CONFIG } from '$lib/constants/blog';
    import { NAV_ITEMS, SOCIAL_LINKS } from '$lib/constants/navigation';
    import { STORAGE_KEYS, booleanStorage, readStorage, writeStorage } from '$lib/utils/storage';

    // Svelte 5 State
    let isMenuOpen = $state(false);
    let isDesktopSidebarCollapsed = $state(false);

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

    function closeMenu() {
        isMenuOpen = false;
    }

    function toggleDesktopSidebar(): void {
        isDesktopSidebarCollapsed = !isDesktopSidebarCollapsed;

        if (browser) {
            writeStorage(
                localStorage,
                STORAGE_KEYS.sidebarCollapsed,
                isDesktopSidebarCollapsed,
                booleanStorage.serialize
            );
        }
    }

    const desktopNavClass = (href: string): string =>
        `flex items-center font-medium transition-colors ${
            isDesktopSidebarCollapsed ? 'justify-center rounded-xl p-3' : 'gap-3'
        } ${
            page.url.pathname === href
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-primary'
        }`;

    let currentTime = $state('--:--:-- --');

    onMount(() => {
        if (browser) {
            const storedSidebarState = readStorage(
                localStorage,
                STORAGE_KEYS.sidebarCollapsed,
                booleanStorage.parse
            );

            if (storedSidebarState !== null) {
                isDesktopSidebarCollapsed = storedSidebarState;
            }
        }

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
        <ThemeToggle />
        <PostSearch variant="icon" />
        <Button
            variant="ghost"
            size="icon"
            onclick={toggleMenu}
            class="cursor-pointer text-muted-foreground hover:text-foreground"
        >
            <Menu class="h-5 w-5" />
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
            <Button
                variant="ghost"
                size="icon"
                onclick={toggleMenu}
                class="cursor-pointer text-muted-foreground hover:text-foreground"
            >
                <X class="h-5 w-5" />
            </Button>
        </div>

        <nav class="flex flex-1 flex-col text-lg">
            <div class="flex flex-col gap-6">
                {#each NAV_ITEMS as item (item.name)}
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

            <Separator class="my-8 bg-border" />

            <SocialLinks links={SOCIAL_LINKS} onclick={closeMenu} />

            <div class="mt-auto pt-8">
                <Donate variant="sidebar" />
            </div>
        </nav>
    </div>
{/if}

<!-- Left Sidebar (Desktop Profile) -->
<nav
    class="z-40 hidden w-full flex-col justify-between overflow-hidden border-b bg-background/95 backdrop-blur transition-[width,padding] duration-300 md:sticky md:top-0 md:flex md:h-screen md:flex-none md:shrink-0 md:border-r md:border-b-0 {isDesktopSidebarCollapsed
        ? 'md:w-24 md:p-4'
        : 'md:w-80 md:p-8'}"
>
    <div class={isDesktopSidebarCollapsed ? 'space-y-4' : 'space-y-6'}>
        <div class="flex items-start justify-between gap-3">
            {#if isDesktopSidebarCollapsed}
                <Button
                    variant="ghost"
                    size="icon"
                    onclick={toggleDesktopSidebar}
                    class="group relative mx-auto h-12 w-12 cursor-pointer rounded-2xl text-foreground hover:bg-accent"
                    aria-label="開啟側邊欄"
                    title="開啟側邊欄"
                >
                    <img
                        src={favicon}
                        alt={`${BLOG_CONFIG.name} favicon`}
                        class="h-6 w-6 transition-opacity duration-200 group-hover:opacity-0"
                    />
                    <ChevronsRight
                        class="absolute inset-0 m-auto h-5 w-5 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    />
                </Button>
            {:else}
                <div>
                    <h2 class="text-xl font-bold tracking-tight">{BLOG_CONFIG.name}</h2>
                    <p class="text-sm text-muted-foreground">{currentTime}</p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onclick={toggleDesktopSidebar}
                    class="cursor-pointer text-muted-foreground hover:text-foreground"
                    aria-label="關閉側邊欄"
                    title="關閉側邊欄"
                >
                    <ChevronsLeft class="h-5 w-5" />
                </Button>
            {/if}
        </div>

        {#if !isDesktopSidebarCollapsed}
            <div>
                <p class="text-sm leading-relaxed text-muted-foreground">
                    {BLOG_CONFIG.description}
                </p>
            </div>
        {/if}

        <div class={isDesktopSidebarCollapsed ? 'flex justify-center' : ''}>
            <PostSearch variant={isDesktopSidebarCollapsed ? 'icon' : 'default'} />
        </div>

        <!-- Navigation Links -->
        <div
            class="flex flex-col {isDesktopSidebarCollapsed
                ? 'items-center gap-2 pt-1'
                : 'gap-6 pt-2'}"
        >
            {#each NAV_ITEMS as item (item.name)}
                <a
                    href={item.href}
                    class={desktopNavClass(item.href)}
                    aria-label={isDesktopSidebarCollapsed ? item.name : undefined}
                    title={isDesktopSidebarCollapsed ? item.name : undefined}
                >
                    <item.icon class="h-4 w-4 shrink-0" />
                    {#if !isDesktopSidebarCollapsed}
                        <span>{item.name}</span>
                    {/if}
                </a>
            {/each}
        </div>
    </div>

    <div class={isDesktopSidebarCollapsed ? 'space-y-3 pt-6' : 'space-y-4 pt-8'}>
        <div class={isDesktopSidebarCollapsed ? 'flex justify-center' : ''}>
            <Donate variant={isDesktopSidebarCollapsed ? 'icon' : 'sidebar'} />
        </div>
        <div class={isDesktopSidebarCollapsed ? 'flex justify-center' : ''}>
            <ThemeToggle
                variant={isDesktopSidebarCollapsed ? 'icon' : 'full'}
                class={isDesktopSidebarCollapsed ? 'h-10 w-10 rounded-xl' : ''}
            />
        </div>
    </div>
</nav>
