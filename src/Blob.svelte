<script>
    import Blue from '$lib/images/Bubble Blue.webp';
    import Orange from '$lib/images/Bubble Orange.webp';
    import { fade } from 'svelte/transition';
    import { MIN_BLOB_RADIUS, PAD, THRESHOLD1 } from './const';
    import { freezeBlob, onPointerDown, percent, updateScore } from './shared.svelte';
    import { ss } from './state.svelte';
    import { blobId, overlap, post } from './utils';

    const { blob } = $props();
    const { cx, cy, maxRadius, radius, solid, dead } = $derived(blob);
    const rad = $derived((radius || MIN_BLOB_RADIUS) + PAD);
    let x = $derived(cx - rad);
    let y = $derived(cy - rad);
    const transform = $derived(`translate(${x}px, ${y}px)`);
    let width = $derived(rad * 2);
    const transition = $derived(radius ? 'initial' : `${maxRadius / 100}s linear`);
    let _this = $state(null);
    let ticks = $derived(blob.ticks);

    $effect(() => {
        if (ss.ticks <= ticks) {
            return;
        }

        ticks = ss.ticks;

        if (radius) {
            return;
        }

        const other = ss.blobs.find((b) => b !== blob && !b.radius && overlap(blob, b));

        if (other) {
            freezeBlob(blob, false);
        }
    });

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
            //
        };

        const onTransitionEnd = () => {
            if (radius) {
                return;
            }

            freezeBlob(blob, false);

            if (ss.level > THRESHOLD1) {
                const other = blob.other;

                if (other) {
                    delete other.solid;

                    const prev = percent();

                    const area = other.radius * other.radius * Math.PI;
                    ss.solidArea = Math.max(ss.solidArea - area, 0);
                    ss.deadArea += area;

                    updateScore(percent() - prev);
                }
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

{#if !ss.next}
    <div
        id={blobId(cx, cy)}
        bind:this={_this}
        class="blob-outer"
        style="width: {width}px; padding: {PAD}px; transform: {transform}; transition: {transition};"
        onpointerdown={onPointerDown}
        transition:fade>
        {#if solid}
            <img src={Blue} alt="" class="blob solid" />
        {:else if radius || dead}
            <div class="blob dead"></div>
        {:else}
            <img src={Orange} alt="" class="blob" />
        {/if}
    </div>
{/if}

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
        filter: drop-shadow(0 0 calc(10%) red);
    }

    .solid {
        /* background: linear-gradient(135deg, #c0c0c080, #60606080); */
        background: linear-gradient(135deg, #8b6493, #70538a);
    }

    .dead {
        background: none;
        border: 2px solid #ff0055;
    }
</style>
