<script lang="ts">
    import Footer from '$lib/components/Footer.svelte';
    import SocialLinks from '$lib/components/SocialLinks.svelte';
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { BLOG_CONFIG } from '$lib/constants/blog';
    import { SOCIAL_LINKS } from '$lib/constants/navigation';
</script>

<svelte:head>
    <title>聯絡我們 | {BLOG_CONFIG.name}</title>
</svelte:head>

<div class="container mx-auto max-w-4xl space-y-16 px-6 py-8 md:py-12">
    <!-- Header Section -->
    <section
        class="animate-in space-y-6 text-center delay-0 duration-700 fade-in slide-in-from-bottom-4"
    >
        <h1 class="text-3xl font-bold tracking-tight text-white">與我們聯絡</h1>
        <div class="mx-auto max-w-2xl space-y-4">
            <p class="text-lg leading-relaxed text-muted-foreground">
                有任何想法、問題，或想討論關於軟體開發與技術分享？我們很樂意收到你的訊息。
            </p>
            <p class="text-lg leading-relaxed text-muted-foreground">
                歡迎透過下方的表單傳送訊息，或經由社群平台與我們連結。
            </p>
        </div>
    </section>

    <!-- Contact Form -->
    <section
        class="mx-auto w-full max-w-xl animate-in delay-100 duration-700 fade-in slide-in-from-bottom-4"
    >
        <form class="space-y-8">
            <!-- Row 1: Inputs -->
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div class="flex w-full flex-col gap-2">
                    <label for="name" class="text-sm font-bold">姓名</label>
                    <Input
                        id="name"
                        placeholder="你的名字"
                        class="h-11 rounded-md border-zinc-800 bg-zinc-950! px-3 py-2 text-white transition-colors duration-300 placeholder:text-zinc-600 focus-visible:bg-zinc-900! focus-visible:ring-0"
                    />
                </div>
                <div class="flex w-full flex-col gap-2">
                    <label for="topic" class="text-sm font-bold">主題</label>
                    <Input
                        id="topic"
                        placeholder="例如：文章交流、技術諮詢"
                        class="h-11 rounded-md border-zinc-800 bg-zinc-950! px-3 py-2 text-white transition-colors duration-300 placeholder:text-zinc-600 focus-visible:bg-zinc-900! focus-visible:ring-0"
                    />
                </div>
            </div>

            <!-- Row 2: Message -->
            <div class="flex w-full flex-col gap-2">
                <label for="message" class="text-sm font-bold">訊息內容</label>
                <textarea
                    id="message"
                    placeholder="請輸入你想說的話..."
                    class="flex min-h-[160px] w-full resize-none rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white transition-colors duration-300 outline-none placeholder:text-zinc-600 focus-visible:border-ring focus-visible:bg-zinc-900 focus-visible:ring-0"
                ></textarea>
            </div>

            <!-- Row 3: Submit -->
            <Button
                type="submit"
                size="lg"
                class="h-12 w-full cursor-pointer rounded-md bg-white! font-medium text-black! transition-transform hover:bg-zinc-200! active:scale-95"
            >
                送出訊息
            </Button>
        </form>
    </section>

    <!-- Links Section -->
    {#if SOCIAL_LINKS.length > 0}
        <div
            class="flex animate-in justify-center pt-8 delay-200 duration-700 fade-in slide-in-from-bottom-4"
        >
            <SocialLinks links={SOCIAL_LINKS} title="社群連結" />
        </div>
    {/if}

    <!-- Footer Section -->
    <Footer />
</div>
