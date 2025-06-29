<script>
    import { onMount } from 'svelte';
    import Blob from './Blob.svelte';
    import { CORNER_RADIUS, NORM_AREA, PAD } from './const';
    import Orb from './Orb.svelte';
    import { onPointerDown } from './shared.svelte';
    import { ss } from './state.svelte';
    import { clientRect, range } from './utils';

    const mouse = $state({ x: 0, y: 0 });
    let cursor = $state('crosshair');

    onMount(() => {
        ss.playground = clientRect('.playground');

        ss.corners = [
            { cx: -PAD, cy: -PAD, radius: CORNER_RADIUS },
            { cx: ss.playground.width - PAD, cy: -PAD, radius: CORNER_RADIUS },
            { cx: ss.playground.width - PAD, cy: ss.playground.height - PAD, radius: CORNER_RADIUS },
            { cx: -PAD, cy: ss.playground.height - PAD, radius: CORNER_RADIUS },
        ];

        ss.totalArea = ss.playground.width * ss.playground.height - Math.PI * Math.pow(CORNER_RADIUS, 2);

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
        {`orbs = ${ss.orbs.length} • dead = ${Math.round((ss.deadArea / ss.totalArea) * 100)}%`}
    </div>
    <div class="clickable" onpointerdown={onPointerDown} onpointermove={onPointerMove} style="cursor: {cursor}"></div>
    <div class="level">10</div>
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
        /* border: 1px solid #ff0055; */
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

    .level {
        grid-area: 1/1;
        place-self: center;
        color: #ffffff08;
        font-family: Roboto Condensed;
        font-size: 25dvh;
    }

    .mouse {
        grid-area: 1/1;
        place-self: end center;
        color: #ffffff40;
        font-family: Roboto Condensed;
        z-index: 5;
    }
</style>
