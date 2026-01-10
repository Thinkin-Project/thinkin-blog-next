<script lang="ts">
    import type { SVGAttributes } from 'svelte/elements';

    let {
        size = 24,
        color = 'currentColor',
        strokeWidth = 2,
        class: className = '',
        ...rest
    }: SVGAttributes<SVGSVGElement> & {
        size?: number | string;
        color?: string;
        strokeWidth?: number | string;
    } = $props();
</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    stroke-width={strokeWidth}
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-x {className}"
    {...rest}
>
    <path d="M4 4l11.733 16H20L8.267 4H4z" />
    <path d="m20 4-6.765 7.67" />
    <path d="M4 20l6.765-7.67" />
</svg>
