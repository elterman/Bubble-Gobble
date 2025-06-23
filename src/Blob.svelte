<script>
    import { MIN_BLOB_RADIUS, PAD } from './const';
    import { onPointerDown } from './shared.svelte';
    import { ss } from './state.svelte';
    import { post } from './utils';

    const { blob } = $props();
    const { cx, cy, maxRadius, radius } = blob;
    const id = $derived(`blob-${cx}-${cy}`);
    let x = $derived(cx - ((radius || MIN_BLOB_RADIUS) + PAD));
    let y = $derived(cy - ((radius || MIN_BLOB_RADIUS) + PAD));
    const transform = $derived(`translate(${x}px, ${y}px)`);
    let width = $derived(((radius || MIN_BLOB_RADIUS) + PAD) * 2 - 1);
    const transition = $derived(radius ? 'initial' : `${maxRadius / 100}s linear`);
    let _this = $state(null);

    $effect(() => {
        if (radius) {
            return;
        }

        post(() => {
            const r = maxRadius + PAD;
            width = r * 2 - 1;
            x = cx - r;
            y = cy - r;
        });

        const onTransitionStart = () => {
            ss.blowing = true;
        };

        const onTransitionEnd = () => {
            ss.blowing = false;
            const blob = ss.blobs.find((b) => b.cx === cx && b.cy === cy);

            if (blob && !blob.radius) {
                blob.radius = maxRadius;
            }
        };

        _this.addEventListener('transitionstart', onTransitionStart);
        _this.addEventListener('transitionend', onTransitionEnd);

        return () => {
            _this.removeEventListener('transitionend', onTransitionStart);
            _this.removeEventListener('transitionstart', onTransitionEnd);
        };
    });
</script>

<div
    {id}
    bind:this={_this}
    class="blob"
    style="width: {width}px; padding: {PAD}px; transform: {transform}; transition: {transition};"
    onpointerdown={onPointerDown}>
    <div class="inner"></div>
</div>

<style>
    .blob {
        grid-area: 1/1;
        display: grid;
        border-radius: 50%;
        z-index: 2;
        box-sizing: border-box;
        border: 1px solid #ffffff80;
        aspect-ratio: 1;
    }

    .inner {
        border-radius: 50%;
        background: linear-gradient(135deg, #feb47b80, #ff7e5f80);
    }
</style>
