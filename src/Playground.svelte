<script>
    import Blob from './Blob.svelte';
    import { onPointerDown } from './shared.svelte';
    import { ss } from './state.svelte';
    import { clientRect, underMouse } from './utils';

    const mouse = $state({ x: 0, y: 0 });
    const pad = 20;
    let cursor = $state('crosshair');

    $effect(() => {
        ss.playground = clientRect('.playground');
    });

    const onPointerMove = (e) => {
        mouse.x = Math.floor(e.offsetX);
        mouse.y = Math.floor(e.offsetY);

        cursor = underMouse(e, ['.blob']) ? 'initial' : 'crosshair';
    };
</script>

<div class="playground" style="padding: {pad}px">
    <div class="mouse">{`x = ${mouse.x} • y = ${mouse.y} • blobs = ${ss.blobs.length}`}</div>
    <div class="clickable" onpointerdown={onPointerDown} onpointermove={onPointerMove} style="cursor: {cursor}"></div>
    {#each ss.blobs as blob (`${blob.cx}-${blob.cy}-${blob.radius || 0}`)}
        <Blob {blob} />
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
        /* cursor: crosshair; */
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
