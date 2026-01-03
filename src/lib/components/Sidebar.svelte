<script lang="ts">
    import { page } from '$app/state';
    import { Button } from '$lib/components/ui/button';
    import { Separator } from '$lib/components/ui/separator';
    import * as Avatar from '$lib/components/ui/avatar';
    import { Menu, X } from 'lucide-svelte';
    import SocialLinks from '$lib/components/SocialLinks.svelte';

    const links = [
        { name: 'Medium', url: '/' },
        { name: 'Substack', url: '/' },
        { name: 'Twitter', url: '/' }
    ];

    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'All posts', href: '/posts' },
        { name: 'Contact', href: '/contact' }
    ];

    // Svelte 5 State
    let isMenuOpen = $state(false);

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

    function closeMenu() {
        isMenuOpen = false;
    }
</script>

<!-- Mobile Header (Visible only on mobile) -->
<header
    class="md:hidden flex items-center justify-between p-6 border-b bg-background sticky top-0 z-50"
>
    <div class="flex items-center gap-3">
        <Avatar.Root class="h-10 w-10 cursor-pointer hover:opacity-80 transition-opacity">
            <Avatar.Image
                src="https://github.com/shadcn.png"
                alt="Frank Price"
                class="object-cover"
            />
            <Avatar.Fallback>FP</Avatar.Fallback>
        </Avatar.Root>
        <span class="font-bold text-lg">Frank Price</span>
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
            <span class="font-bold text-lg">Menu</span>
            <Button variant="ghost" size="icon" onclick={toggleMenu} class="cursor-pointer">
                <X class="h-6 w-6" />
            </Button>
        </div>

        <nav class="flex flex-col text-lg">
            <div class="flex flex-col gap-4">
                {#each navItems as item}
                    <a
                        href={item.href}
                        class="font-medium transition-colors {page.url.pathname === item.href
                            ? 'text-foreground'
                            : 'text-muted-foreground hover:text-primary'}"
                        onclick={closeMenu}>{item.name}</a
                    >
                {/each}
            </div>

            <Separator class="bg-zinc-800 my-8" />

            <SocialLinks {links} title="Socials" onclick={closeMenu} />

            <div class="mt-8">
                <Button
                    variant="default"
                    size="lg"
                    class="w-full rounded-full bg-[#ec4899] hover:bg-[#db2777] text-white font-semibold shadow-sm cursor-pointer"
                >
                    Subscribe
                </Button>
            </div>
        </nav>
    </div>
{/if}

<!-- Left Sidebar (Desktop Profile) -->
<nav
    class="hidden md:flex w-full md:w-80 md:sticky md:top-0 md:h-screen z-40 border-b md:border-b-0 md:border-r bg-background/95 backdrop-blur p-8 flex-col justify-between"
>
    <div class="space-y-6">
        <div class="flex items-center gap-4">
            <Avatar.Root class="h-12 w-12 cursor-pointer hover:opacity-80 transition-opacity">
                <Avatar.Image
                    src="https://github.com/shadcn.png"
                    alt="Frank Price"
                    class="object-cover"
                />
                <Avatar.Fallback>FP</Avatar.Fallback>
            </Avatar.Root>
            <div>
                <h2 class="text-xl font-bold tracking-tight">Frank Price</h2>
                <p class="text-sm text-muted-foreground">Updated Now</p>
            </div>
        </div>

        <div class="space-y-2 pt-6">
            <p class="text-sm text-muted-foreground leading-relaxed">
                Designer by day, writer by night. Crafting intuitive user experiences at the
                intersection of design, engineering, and AI.
            </p>
        </div>

        <!-- Navigation Links -->
        <div class="flex flex-col gap-3 pt-2">
            {#each navItems as item}
                <a
                    href={item.href}
                    class="text-sm font-medium transition-colors {page.url.pathname === item.href
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-primary'}">{item.name}</a
                >
            {/each}
        </div>
    </div>

    <div class="mt-8 md:mt-auto pt-6 space-y-4">
        <Button
            variant="default"
            size="sm"
            class="w-full rounded-full bg-[#ec4899] hover:bg-[#db2777] text-white font-semibold shadow-sm cursor-pointer"
        >
            Subscribe
        </Button>
    </div>
</nav>
