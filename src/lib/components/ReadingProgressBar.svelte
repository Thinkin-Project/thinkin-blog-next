<script lang="ts">
    import { onMount } from 'svelte';

    let progress = $state(0);

    function updateProgress() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height =
            document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progress = scrolled;
    }

    onMount(() => {
        window.addEventListener('scroll', updateProgress);
        return () => window.removeEventListener('scroll', updateProgress);
    });
</script>

<div class="fixed top-0 right-0 left-0 z-50 h-1 w-full bg-zinc-900/50 backdrop-blur-sm md:left-80">
    <div
        class="h-full bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 transition-all duration-150 ease-out"
        style="width: {progress}%"
    ></div>
</div>
