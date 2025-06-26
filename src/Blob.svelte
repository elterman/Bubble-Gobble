<script>
    import { MIN_BLOB_RADIUS, PAD } from './const';
    import { freezeBlob, onPointerDown } from './shared.svelte';
    import { ss } from './state.svelte';
    import { blobId, post, sameBlob } from './utils';

    const { blob } = $props();
    const { cx, cy, maxRadius, radius, solid, other } = $derived(blob);
    const rad = $derived((radius || MIN_BLOB_RADIUS) + PAD);
    let x = $derived(cx - rad);
    let y = $derived(cy - rad);
    const transform = $derived(`translate(${x}px, ${y}px)`);
    let width = $derived(rad * 2);
    const transition = $derived(radius ? 'initial' : `${maxRadius / 100}s linear`);
    let _this = $state(null);

    $effect(() => {
        if (radius) {
            return;
        }

        post(() => {
            const r = maxRadius + PAD;
            width = r * 2;
            x = cx - r;
            y = cy - r;
        });

        const onTransitionStart = () => {
            if (width) {
                ss.blowing = true;
            }
        };

        const onTransitionEnd = () => {
            if (ss.blowing) {
                freezeBlob(ss.blobs.length - 1, false);

                // if (other) {
                //     const i = ss.blobs.findIndex((b) => sameBlob(b, other));
                //     freezeBlob(i, false);
                // }
            }
        };

        _this.addEventListener('transitionstart', onTransitionStart);
        _this.addEventListener('transitionend', onTransitionEnd);

        return () => {
            _this.removeEventListener('transitionstart', onTransitionStart);
            _this.removeEventListener('transitionend', onTransitionEnd);
        };
    });
</script>

<div
    id={blobId(cx, cy)}
    bind:this={_this}
    class="blob-outer"
    style="width: {width}px; padding: {width ? PAD : 0}px; transform: {transform}; transition: {transition};"
    onpointerdown={onPointerDown}>
    <div class="blob {radius ? (solid ? 'solid' : 'hollow') : ''}"></div>
</div>

<style>
    .blob-outer {
        grid-area: 1/1;
        display: grid;
        border-radius: 50%;
        z-index: 2;
        box-sizing: border-box;
        border: 1px solid #ffffff80;
        aspect-ratio: 1;
    }

    .blob {
        border-radius: 50%;
        background: linear-gradient(135deg, #8b6493, #70538a);
        box-sizing: border-box;
    }

    .solid {
        /* background: linear-gradient(135deg, #c0c0c080, #60606080); */
    }

    .hollow {
        background: none;
        border: 1px solid #ff0055;
    }
</style>
