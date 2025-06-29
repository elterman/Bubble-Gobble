<script>
    import Blue from '$lib/images/Bubble Blue.webp';
    import Orange from '$lib/images/Bubble Orange.webp';
    import { MIN_BLOB_RADIUS, PAD } from './const';
    import { freezeBlob, onPointerDown } from './shared.svelte';
    import { ss } from './state.svelte';
    import { blobId, post } from './utils';

    const { blob } = $props();
    const { cx, cy, maxRadius, radius, solid } = $derived(blob);
    const rad = $derived((radius || MIN_BLOB_RADIUS) + PAD);
    let x = $derived(cx - rad);
    let y = $derived(cy - rad);
    const transform = $derived(`translate(${x}px, ${y}px)`);
    let width = $derived(rad * 2);
    const transition = $derived(radius ? 'initial' : `${(maxRadius / 100) * ss.speed}s linear`);
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
            ss.blowing = true;
        };

        const onTransitionEnd = () => {
            if (ss.blowing) {
                freezeBlob(ss.blobs.length - 1, false);
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
    style="width: {width}px; padding: {PAD}px; transform: {transform}; transition: {transition};"
    onpointerdown={onPointerDown}>
    {#if solid}
        <img src={Blue} alt="" class="blob solid"/>
    {:else if radius}
        <div class="blob dead"></div>
    {:else}
        <img src={Orange} alt="" class="blob"/>
    {/if}
</div>

<style>
    .blob-outer {
        grid-area: 1/1;
        display: grid;
        border-radius: 50%;
        z-index: 2;
        box-sizing: border-box;
        /* border: 1px solid #ffffff20; */
        aspect-ratio: 1;
    }

    .blob {
        border-radius: 50%;
        background: linear-gradient(135deg, #8b6493, #70538a);
        box-sizing: border-box;
        width: 100%;
    }

    .solid {
        /* background: linear-gradient(135deg, #c0c0c080, #60606080); */
        background: linear-gradient(135deg, #8b6493, #70538a);
    }

    .dead {
        background: none;
        border: 1px solid #ff0055;
    }
</style>
