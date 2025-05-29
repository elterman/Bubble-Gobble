<script>
    import { log } from './shared.svelte';

    const { blob } = $props();
    const { cx, cy, r } = blob;
    const x = $derived(cx - r);
    const y = $derived(cy - r);
    const transform = $derived(`translate(${x}px, ${y}px)`);

    $effect(() => {
        log(transform);
    });

    const onPointerDown = (e) => {
        e.stopPropagation();
    };
</script>

<div class="blob" style="width: {r * 2}px; transform: {transform};" onpointerdown={onPointerDown}></div>

<style>
    .blob {
        grid-area: 1/1;
        display: grid;
        border-radius: 50%;
        background: linear-gradient(135deg, #feb47b80, #ff7e5f80);
        aspect-ratio: 1;
    }
</style>
