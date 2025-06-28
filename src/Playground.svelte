<script>
    import { onMount } from 'svelte';
    import Blob from './Blob.svelte';
    import { NORM_AREA, PAD } from './const';
    import Orb from './Orb.svelte';
    import { onPointerDown } from './shared.svelte';
    import { ss } from './state.svelte';
    import { clientRect, range } from './utils';

    const mouse = $state({ x: 0, y: 0 });
    let cursor = $state('crosshair');

    onMount(() => {
        ss.playground = clientRect('.playground');
        ss.totalArea = ss.playground.width * ss.playground.height;
        const max = Math.max(ss.playground.width, ss.playground.height);
        ss.speed = NORM_AREA / max;
    });

    const onPointerMove = (e) => {
        mouse.x = Math.floor(e.offsetX);
        mouse.y = Math.floor(e.offsetY);
    };
</script>

<div class="playground" style="padding: {PAD}px">
    <div class="mouse">
        {`blobs = ${ss.blobs.length} • orbs = ${ss.orbs.length} • dead = ${Math.round((ss.deadArea / ss.totalArea) * 100)}% • claimed = ${Math.round((ss.solidArea / ss.totalArea) * 100)}%`}
    </div>
    <div class="clickable" onpointerdown={onPointerDown} onpointermove={onPointerMove} style="cursor: {cursor}"></div>
    {#each ss.blobs as blob (`${blob.cx}-${blob.cy}-${blob.radius || 0}`)}
        <Blob {blob} />
    {/each}
    <!-- {#each ss.orbs as orb, i (i)} -->
    {#each range(ss.orbs.length) as i (i)}
        <Orb index={i - 1} />
    {/each}
</div>

<style>
    .playground {
        grid-area: 1/1;
        display: grid;
        border: 1px solid #ff0055;
        box-sizing: border-box;
    }

    .clickable {
        grid-area: 1/1;
        display: grid;
        z-index: 1;
        cursor: crosshair;
        box-sizing: border-box;
        /* border: 1px solid #ffffff80; */
    }

    .mouse {
        grid-area: 1/1;
        place-self: end;
        color: white;
        margin: 10px;
        font-family: Roboto Condensed;
        transform: translate(20px, 28px);
        font-size: 14px;
        z-index: 5;
    }
</style>
