<script>
    import Blob from './Blob.svelte';
    import { log } from './shared.svelte';
    import { ss } from './state.svelte';
    import { clientRect } from './utils';

    const mouse = $state({ x: 0, y: 0 });
    const pad = 20;

    $effect(() => {
        ss.playground = clientRect('.playground');
    });

    const onPointerDown = (e) => {
        if (e.ctrlKey) {
            ss.blobs = [];
            return;
        }

        const calcMaxRadius = (cx, cy) => {
            const sz = { x: ss.playground.width - 2 * pad, y: ss.playground.height - 2 * pad };
            const maxWidth = Math.min(cx, sz.x - cx) + pad;
            const maxHeight = Math.min(cy, sz.y - cy) + pad;
            let maxRadius = Math.min(maxWidth, maxHeight);

            for (const blob of ss.blobs) {
                const dx = Math.abs(cx - blob.cx);
                const dy = Math.abs(cy - blob.cy);
                const dist = Math.sqrt(dx * dx + dy * dy);
                maxRadius = Math.min(maxRadius, dist - blob.radius);
            }

            return maxRadius;
        };

        const cx = Math.round(e.offsetX);
        const cy = Math.round(e.offsetY);
        const maxRadius = calcMaxRadius(cx, cy);
        const blob = { cx, cy, maxRadius };
        ss.blobs.push(blob);
    };

    const onPointerMove = (e) => {
        mouse.x = Math.floor(e.offsetX);
        mouse.y = Math.floor(e.offsetY);
    };
</script>

<div class="playground" style="padding: {pad}px">
    <div class="mouse">{`x = ${mouse.x} • y = ${mouse.y} • blobs = ${ss.blobs.length}`}</div>
    <div class="clickable" onpointerdown={onPointerDown} onpointermove={onPointerMove}></div>
    {#each ss.blobs as blob, i (i)}
        <Blob {blob} index={i} />
    {/each}
</div>

<style>
    .playground {
        grid-area: 1/1;
        display: grid;
        border: 1px solid #ff0055;
        box-sizing: border-box;
        padding: 20px;
    }

    .clickable {
        grid-area: 1/1;
        display: grid;
        cursor: crosshair;
        z-index: 1;
    }

    .mouse {
        grid-area: 1/1;
        place-self: end;
        color: white;
        margin: 10px;
        font-family: Roboto Condensed;
        transform: translate(20px, 20px);
    }
</style>
