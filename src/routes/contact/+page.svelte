<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import Footer from '$lib/components/Footer.svelte';
    import SocialLinks from '$lib/components/SocialLinks.svelte';

    const links = [
        { name: 'Medium', url: '/' },
        { name: 'Substack', url: '/' },
        { name: 'Twitter', url: '/' }
    ];
</script>

<div class="container max-w-4xl mx-auto px-6 py-8 md:py-12 space-y-12">
    <!-- Header Section -->
    <section class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 class="text-2xl font-bold tracking-tight text-white">Let’s connect!</h1>
        <div class="max-w-2xl space-y-6">
            <p class="text-lg text-muted-foreground leading-relaxed">
                Have a project in mind, a question, or just want to discuss the latest in AI and
                design? I’d love to hear from you.
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
    <SocialLinks {links} />

    <!-- Footer Section -->
    <Footer />
</div>
