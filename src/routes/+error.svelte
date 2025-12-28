<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Separator } from '$lib/components/ui/separator';
    import * as Avatar from '$lib/components/ui/avatar';
    import { ArrowRight, Menu, X } from 'lucide-svelte';
    import { page } from '$app/stores';

    const links = [
        { name: 'Medium', url: '#' },
        { name: 'Substack', url: '#' },
        { name: 'Twitter', url: '#' }
    ];

    const featuredPosts = [
        {
            title: 'Demystifying Continuous Integration',
            subtitle: 'How CI improves development workflows',
            url: '/posts/demystifying-continuous-integration'
        },
        {
            title: 'The Philosophy of AI Ethics',
            subtitle: 'Can machines make moral decisions?',
            url: '/posts/ai-ethics'
        },
        {
            title: 'The Role of Empathy in Design',
            subtitle: 'Why empathy is the key to great design.',
            url: '/posts/empathy-in-design'
        }
    ];

    // Svelte 5 State
    let isMenuOpen = $state(false);

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }
</script>

<div class="flex min-h-screen w-full flex-col md:flex-row bg-background text-foreground">
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
                    <a
                        href="/"
                        class="font-medium text-muted-foreground hover:text-primary transition-colors"
                        onclick={toggleMenu}>Home</a
                    >
                    <a
                        href="/posts"
                        class="font-medium text-muted-foreground hover:text-primary transition-colors"
                        onclick={toggleMenu}>All posts</a
                    >
                    <a
                        href="/contact"
                        class="font-medium text-muted-foreground hover:text-primary transition-colors"
                        onclick={toggleMenu}>Contact</a
                    >
                </div>

                <Separator class="bg-zinc-800 my-8" />

                <div class="space-y-4">
                    <p class="font-bold text-lg">Socials</p>
                    {#each links as link}
                        <a
                            href={link.url}
                            class="flex items-center gap-2 font-medium text-muted-foreground hover:text-foreground transition-colors group"
                            onclick={toggleMenu}
                        >
                            {link.name}
                            <ArrowRight
                                class="h-4 w-4 transition-transform duration-300 group-hover:-rotate-45"
                            />
                        </a>
                    {/each}
                </div>

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
                <a
                    href="/"
                    class="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >Home</a
                >
                <a
                    href="/posts"
                    class="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >All posts</a
                >
                <a
                    href="/contact"
                    class="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >Contact</a
                >
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

    <!-- Main Content -->
    <main class="flex-1">
        <div class="container max-w-4xl mx-auto px-6 py-8 md:py-12 space-y-12">
            <!-- Error Message Section -->
            <section class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 class="text-4xl md:text-5xl font-bold tracking-tight">
                    404 – This page doesn't exist
                </h1>

                <a
                    href="/"
                    class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-zinc-900 hover:bg-zinc-800 hover:text-accent-foreground px-2 py-1 text-zinc-400 group"
                >
                    <ArrowRight
                        class="mr-2 h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1"
                    />
                    Homepage
                </a>
            </section>

            <Separator class="bg-zinc-800" />

            <!-- Featured Posts (Styled as Home Page 'Featured Posts') -->
            <section
                class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100"
            >
                <h2 class="text-2xl font-bold tracking-tight">Featured posts</h2>
                <div
                    class="flex flex-col gap-px bg-zinc-800 rounded-3xl overflow-hidden border border-zinc-800"
                >
                    {#each featuredPosts as post}
                        <a
                            href={post.url}
                            class="block group relative bg-zinc-900 hover:bg-zinc-800 transition-colors duration-300 p-4"
                        >
                            <div class="flex items-center justify-between z-10 relative">
                                <div class="space-y-1">
                                    <h3
                                        class="text-xl font-medium text-zinc-100 group-hover:text-white transition-colors"
                                    >
                                        {post.title}
                                    </h3>
                                    <p class="text-zinc-500 text-base">{post.subtitle}</p>
                                </div>
                                <ArrowRight
                                    class="h-5 w-5 text-zinc-600 group-hover:text-white transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </div>
                        </a>
                    {/each}
                </div>
            </section>

            <!-- Footer Section -->
            <footer class="pt-8 border-t border-border space-y-8">
                <div class="flex flex-row justify-between gap-8">
                    <div class="flex flex-col justify-end text-sm text-muted-foreground text-right">
                        <p>From Boston with ♡</p>
                    </div>
                    <div class="flex flex-col justify-end text-sm text-muted-foreground text-right">
                        <p>© 2025 Frank Price</p>
                    </div>
                </div>
            </footer>
        </div>
    </main>
</div>
