<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { ArrowRight } from 'lucide-svelte';
</script>

<section>
    <div class="rounded-3xl bg-zinc-900 border border-zinc-800 p-8 md:p-12 space-y-8">
        <div class="flex items-baseline justify-between">
            <h2 class="text-3xl font-bold text-white">訂閱電子報</h2>
            <p class="text-zinc-400 italic">300+ 讀者</p>
        </div>
        <div class="w-full space-y-4">
            <div class="relative">
                <Input
                    type="email"
                    placeholder="你的電子郵件地址"
                    class="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-500 h-12 pr-32 rounded-full focus-visible:ring-0 focus-visible:bg-zinc-900 transition-colors duration-300"
                />
                <Button
                    class="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent text-zinc-500 hover:text-white transition-colors duration-300 rounded-full px-4 h-auto py-1 flex items-center gap-2 cursor-pointer"
                >
                    <ArrowRight class="h-4 w-4" />
                    訂閱
                </Button>
            </div>
            <p class="text-sm text-zinc-400">
                “喜歡程式設計或者能幫助你解決問題的文章嗎？訂閱我的電子報吧！”
            </p>
        </div>
    </div>
</section>
