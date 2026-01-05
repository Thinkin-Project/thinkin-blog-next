<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import Footer from '$lib/components/Footer.svelte';
    import SocialLinks from '$lib/components/SocialLinks.svelte';

    import { SOCIAL_LINKS } from '$lib/constants/navigation';
</script>

<div class="container max-w-4xl mx-auto px-6 py-8 md:py-12 space-y-16">
    <!-- Header Section -->
    <section class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-0 text-center">
        <h1 class="text-3xl font-bold tracking-tight text-white">與我們聯絡</h1>
        <div class="max-w-2xl mx-auto space-y-4">
            <p class="text-lg text-muted-foreground leading-relaxed">
                有任何想法、問題，或想討論關於軟體開發與技術分享？我們很樂意收到你的訊息。
            </p>
            <p class="text-lg text-muted-foreground leading-relaxed">
                歡迎透過下方的表單傳送訊息，或經由社群平台與我們連結。
            </p>
        </div>
    </section>

    <!-- Contact Form -->
    <section
        class="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 w-full"
    >
        <form class="space-y-8">
            <!-- Row 1: Inputs -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="flex flex-col gap-2 w-full">
                    <label for="name" class="text-sm font-bold">姓名</label>
                    <Input
                        id="name"
                        placeholder="你的名字"
                        class="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 h-11 rounded-md focus-visible:ring-0 focus-visible:bg-zinc-900 transition-colors duration-300 py-2 px-3"
                    />
                </div>
                <div class="flex flex-col gap-2 w-full">
                    <label for="topic" class="text-sm font-bold">主題</label>
                    <Input
                        id="topic"
                        placeholder="例如：文章交流、技術諮詢"
                        class="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 h-11 rounded-md focus-visible:ring-0 focus-visible:bg-zinc-900 transition-colors duration-300 py-2 px-3"
                    />
                </div>
            </div>

            <!-- Row 2: Message -->
            <div class="flex flex-col gap-2 w-full">
                <label for="message" class="text-sm font-bold">訊息內容</label>
                <textarea
                    id="message"
                    placeholder="請輸入你想說的話..."
                    class="flex w-full bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-600 outline-none min-h-[160px] rounded-md resize-none py-2 px-3 text-sm focus-visible:ring-0 focus-visible:border-ring transition-colors duration-300"
                ></textarea>
            </div>

            <!-- Row 3: Submit -->
            <Button
                type="submit"
                size="lg"
                class="w-full bg-white! text-black! hover:bg-zinc-200! font-medium rounded-md h-12 cursor-pointer transition-transform active:scale-95"
            >
                送出訊息
            </Button>
        </form>
    </section>

    <!-- Links Section -->
    {#if SOCIAL_LINKS.length > 0}
        <div class="flex justify-center pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <SocialLinks links={SOCIAL_LINKS} title="社群連結" />
        </div>
    {/if}

    <!-- Footer Section -->
    <Footer />
</div>
