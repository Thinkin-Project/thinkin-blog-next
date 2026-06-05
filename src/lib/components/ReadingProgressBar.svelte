<script lang="ts">
    import { onMount } from 'svelte';

    let progress = $state(0);
    const ariaValueNow = $derived(Math.round(progress));

    function updateProgress() {
        const winScroll = document.documentElement.scrollTop;
        const height =
            document.documentElement.scrollHeight - document.documentElement.clientHeight;

        if (height <= 0) {
            progress = 0;
            return;
        }

        const scrolled = (winScroll / height) * 100;
        progress = Math.min(Math.max(scrolled, 0), 100);
    }

    onMount(() => {
        window.addEventListener('scroll', updateProgress);
        window.addEventListener('resize', updateProgress);

        // 使用 ResizeObserver 監控頁面高度變化 (例如圖片載入)
        const observer = new ResizeObserver(() => {
            updateProgress();
        });

        // 監控 document.body 的尺寸變化
        if (document.body) {
            observer.observe(document.body);
        }

        // 初始化時先更新一次
        updateProgress();

        return () => {
            window.removeEventListener('scroll', updateProgress);
            window.removeEventListener('resize', updateProgress);
            observer.disconnect();
        };
    });
</script>

<div
    class="fixed top-0 left-0 z-50 h-1 w-full bg-zinc-900/50 backdrop-blur-sm md:sticky md:z-40"
    role="progressbar"
    aria-valuenow={ariaValueNow}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-label="閱讀進度"
>
    <div
        class="h-full bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 transition-all duration-150 ease-out"
        style="width: {progress}%"
    ></div>
</div>
