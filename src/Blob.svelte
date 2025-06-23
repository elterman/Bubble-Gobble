<script>
    import { MIN_BLOB_RADIUS } from './const';
    import { ss } from './state.svelte';
    import { post } from './utils';

    const { blob } = $props();
    const { cx, cy, maxRadius, radius } = blob;
    const id = $derived(`blob-${cx}-${cy}`);
    let x = $derived(cx - (radius || MIN_BLOB_RADIUS));
    let y = $derived(cy - (radius || MIN_BLOB_RADIUS));
    const transform = $derived(`translate(${x}px, ${y}px)`);
    let width = $derived((radius || MIN_BLOB_RADIUS) * 2 - 1);
    const transition = $derived(radius ? 'initial' : `${maxRadius / 100}s linear`);
    let _this = $state(null);

    $effect(() => {
        if (radius) {
            return;
        }

        post(() => {
            width = maxRadius * 2 - 1;
            x = cx - maxRadius;
            y = cy - maxRadius;
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
    style="width: {width}px; transform: {transform}; transition: {transition};">
</div>

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
