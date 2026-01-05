<script lang="ts">
    import { ArrowRight } from 'lucide-svelte';

    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
</script>

<section>
    <div class="space-y-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-8 md:p-12">
        <div class="flex items-baseline justify-between">
            <h2 class="text-3xl font-bold text-white">訂閱電子報</h2>
            <p class="text-zinc-400 italic">300+ 讀者</p>
        </div>
        <div class="w-full space-y-4">
            <div class="relative">
                <Input
                    type="email"
                    placeholder="你的電子郵件地址"
                    class="h-12 rounded-full border-zinc-800 bg-zinc-950 pr-32 text-white transition-colors duration-300 placeholder:text-zinc-500 focus-visible:bg-zinc-900 focus-visible:ring-0"
                />
                <Button
                    class="absolute top-1/2 right-2 flex h-auto -translate-y-1/2 cursor-pointer items-center gap-2 rounded-full bg-transparent px-4 py-1 text-zinc-500 transition-colors duration-300 hover:bg-transparent hover:text-white"
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
