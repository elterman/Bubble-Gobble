<script>
    import Blob from './Blob.svelte';
    import { ss } from './state.svelte';
    import { clientRect } from './utils';

    const mouse = $state({ x: 0, y: 0 });

    $effect(() => {
        ss.playground = clientRect('.playground');
    });

    const onPointerDown = (e) => {
        const cx = Math.floor(e.offsetX);
        const cy = Math.floor(e.offsetY);
        const maxWidth = Math.floor(Math.min(cx, ss.playground.width - cx));
        const maxHeight = Math.floor(Math.min(cy, ss.playground.height - cy));
        const blob = { cx, cy, maxRadius: Math.min(maxWidth, maxHeight) };
        ss.blobs.push(blob);
    };
</script>

<div
    class="playground"
    onpointerdown={onPointerDown}
    onpointermove={(e) => {
        mouse.x = Math.floor(e.offsetX);
        mouse.y = Math.floor(e.offsetY);
    }}>
    <div class="mouse">{`x: ${mouse.x}; y: ${mouse.y}`}</div>
    {#each ss.blobs as blob, i (i)}
        <Blob {blob} />
    {/each}
</div>

<style>
    .playground {
        display: grid;
        border: 1px solid #ff0055;
    }

    .mouse {
        grid-area: 1/1;
        color: white;
        margin: 10px;
        font-family: Roboto Condensed;
    }
</style>
