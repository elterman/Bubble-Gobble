<script>
    import { MIN_BLOB_RADIUS } from './const';
    import { ss } from './state.svelte';
    import { post } from './utils';

    const { blob, } = $props();
    const { cx, cy, maxRadius } = blob;
    let x = $derived(cx - MIN_BLOB_RADIUS);
    let y = $derived(cy - MIN_BLOB_RADIUS);
    const transform = $derived(`translate(${x}px, ${y}px)`);
    let width = $derived(MIN_BLOB_RADIUS * 2 - 1);
    const transition = $derived(`${maxRadius / 100}s linear`);
    let _this = $state(null);

    $effect(() => {
        post(() => {
            width = maxRadius * 2 - 1;
            x = cx - maxRadius;
            y = cy - maxRadius;
        });

        const onTransitionEnd = () => {
            ss.blobs.find(b => b.cx === cx && b.cy === cy).radius = maxRadius;
        };

        _this.addEventListener('transitionend', onTransitionEnd);
        return () => _this.removeEventListener('transitionend', onTransitionEnd);
    });

    const onPointerDown = (e) => {
        e.stopPropagation();
    };
</script>

<div bind:this={_this} class="blob" style="width: {width}px; transform: {transform}; transition: {transition};" onpointerdown={onPointerDown}></div>

<style>
    .blob {
        grid-area: 1/1;
        display: grid;
        border-radius: 50%;
        background: linear-gradient(135deg, #feb47b80, #ff7e5f80);
        aspect-ratio: 1;
        box-sizing: border-box;
    }
</style>
