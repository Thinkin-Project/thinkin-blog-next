<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Separator } from '$lib/components/ui/separator';
    import * as Avatar from '$lib/components/ui/avatar';
    import { ArrowRight, ArrowUpRight, Menu, X } from 'lucide-svelte';

    const links = [
        { name: 'Medium', url: '#' },
        { name: 'Substack', url: '#' },
        { name: 'Twitter', url: '#' }
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
                        class="font-medium text-foreground hover:text-primary transition-colors"
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
                    class="text-sm font-medium text-foreground hover:text-primary transition-colors"
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
            <!-- Header Section -->
            <section class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 class="text-2xl font-bold tracking-tight text-white">Let’s connect!</h1>
                <div class="max-w-2xl space-y-6">
                    <p class="text-lg text-muted-foreground leading-relaxed">
                        Have a project in mind, a question, or just want to discuss the latest in AI
                        and design? I’d love to hear from you.
                    </p>
                    <p class="text-lg text-muted-foreground leading-relaxed">
                        Feel free to send a message below or connect via social media.
                    </p>
                </div>
            </section>

            <!-- Contact Form -->
            <section
                class="max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 w-full"
            >
                <form class="space-y-8">
                    <!-- Row 1: Inputs -->
                    <div class="flex flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="name" class="text-sm font-bold">Name</label>
                            <Input
                                id="name"
                                placeholder="Akim Perminov"
                                class="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 h-11 rounded-md focus-visible:ring-0 focus-visible:bg-zinc-900 transition-colors duration-300 py-2 px-3"
                            />
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                            <label for="topic" class="text-sm font-bold">Topic</label>
                            <Input
                                id="topic"
                                placeholder="Guest post"
                                class="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 h-11 rounded-md focus-visible:ring-0 focus-visible:bg-zinc-900 transition-colors duration-300 py-2 px-3"
                            />
                        </div>
                    </div>

                    <!-- Row 2: Message -->
                    <div class="flex flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="message" class="text-sm font-bold">Message</label>
                            <textarea
                                id="message"
                                placeholder="Your message"
                                class="flex w-full bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-600 outline-none min-h-[160px] rounded-md resize-none py-2 px-3 text-sm focus-visible:ring-0 focus-visible:border-ring transition-colors duration-300"
                            ></textarea>
                        </div>
                    </div>

                    <!-- Row 3: Submit -->
                    <div class="flex flex-row gap-6">
                        <Button
                            type="submit"
                            size="lg"
                            class="w-full bg-white! text-black! hover:bg-zinc-200! font-medium rounded-md h-12 cursor-pointer"
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </section>

            <!-- Links Section -->
            <section>
                <ul class="space-y-4">
                    <h2 class="text-2xl font-bold tracking-tight">Links</h2>
                    {#each links as link}
                        <li class="group">
                            <a
                                href={link.url}
                                class="flex items-center gap-2 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {link.name}
                                <ArrowRight
                                    class="h-4 w-4 transition-transform duration-300 group-hover:-rotate-45"
                                />
                            </a>
                        </li>
                    {/each}
                </ul>
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
