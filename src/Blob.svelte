<script>
    import { MIN_BLOB_RADIUS, PAD, SHRINK_MS } from './const';
    import { onPointerDown } from './shared.svelte';
    import { ss } from './state.svelte';
    import { blobId, post, sameBlob } from './utils';

    const { blob } = $props();
    const { cx, cy, maxRadius, radius, other, shrink } = $derived(blob);
    const rad = $derived((radius || MIN_BLOB_RADIUS) + PAD);
    let x = $derived(shrink ? cx : cx - rad);
    let y = $derived(shrink ? cy : cy - rad);
    const transform = $derived(`translate(${x}px, ${y}px)`);
    let width = $derived(shrink ? 0 : rad * 2);
    const transition = $derived(width === 0 ? `${SHRINK_MS}ms linear` : radius ? 'initial' : `${maxRadius / 100}s linear`);
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
                delete ss.blowing;

                post(() => {
                    x = cx;
                    y = cy;
                    width = 0;

                    post(() => ss.blobs.pop(), SHRINK_MS);

                    if (other) {
                        const i = ss.blobs.findIndex((b) => sameBlob(b, other));
                        ss.blobs[i].shrink = true;
                        post(() => ss.blobs.splice(i, 1), SHRINK_MS);
                    }
                }, 50);
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
    <div class="blob {radius && width ? 'solid' : ''}"></div>
</div>

<style>
    .blob-outer {
        grid-area: 1/1;
        display: grid;
        border-radius: 50%;
        z-index: 2;
        box-sizing: border-box;
        /* border: 1px solid #ffffff80; */
        aspect-ratio: 1;
    }

    .blob {
        border-radius: 50%;
        background: linear-gradient(135deg, #feb47b80, #ff7e5f80);
        filter: hue-rotate(-100deg);
    }

    .solid {
        background: linear-gradient(135deg, #c0c0c080, #60606080);
    }
</style>
