<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { Button } from '$lib/components/ui/button';
    import { Separator } from '$lib/components/ui/separator';
    import { Menu, X } from 'lucide-svelte';
    import { NAV_ITEMS, SOCIAL_LINKS } from '$lib/constants/navigation';
    import SocialLinks from '$lib/components/SocialLinks.svelte';

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
    class="md:hidden flex items-center justify-between p-6 border-b bg-background sticky top-0 z-50"
>
    <div class="flex items-center gap-3">
        <span class="font-bold text-lg">Thinkin Markdown</span>
    </div>
    <Button variant="ghost" size="icon" onclick={toggleMenu} class="cursor-pointer">
        <Menu class="h-6 w-6" />
    </Button>
</header>

<!-- Mobile Menu Overlay -->
{#if isMenuOpen}
    <div
        class="fixed inset-0 z-50 bg-background flex flex-col p-6 md:hidden animate-in slide-in-from-left duration-300"
    >
        <div class="flex items-center justify-between mb-8">
            <span class="font-bold text-lg">選單</span>
            <Button variant="ghost" size="icon" onclick={toggleMenu} class="cursor-pointer">
                <X class="h-6 w-6" />
            </Button>
        </div>

        <nav class="flex flex-col text-lg">
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

            <Separator class="bg-zinc-800 my-8" />

            <SocialLinks links={SOCIAL_LINKS} onclick={closeMenu} />
        </nav>
    </div>
{/if}

<!-- Left Sidebar (Desktop Profile) -->
<nav
    class="hidden md:flex w-full md:w-80 md:sticky md:top-0 md:h-screen z-40 border-b md:border-b-0 md:border-r bg-background/95 backdrop-blur p-8 flex-col justify-between"
>
    <div class="space-y-6">
        <div class="flex items-center gap-4">
            <div>
                <h2 class="text-xl font-bold tracking-tight">Thinkin Markdown</h2>
                <p class="text-sm text-muted-foreground">{currentTime}</p>
            </div>
        </div>

        <div>
            <p class="text-sm text-muted-foreground leading-relaxed">
                一個專注於記錄軟體開發經驗與知識，強調實用收穫與開放分享的部落格。
            </p>
        </div>

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
</nav>
