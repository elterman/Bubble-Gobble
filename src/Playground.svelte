<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import Blob from './Blob.svelte';
    import { CORNER_RADIUS, PAD } from './const';
    import Orb from './Orb.svelte';
    import { onPointerDown } from './shared.svelte';
    import { _prompt, ss } from './state.svelte';
    import { clientRect, range } from './utils';

    const mouse = $state({ x: 0, y: 0 });

    const onResize = () => {
        ss.playground = clientRect('.playground');

        ss.corners = [
            { cx: -PAD, cy: -PAD, radius: CORNER_RADIUS },
            { cx: ss.playground.width - PAD, cy: -PAD, radius: CORNER_RADIUS },
            { cx: ss.playground.width - PAD, cy: ss.playground.height - PAD, radius: CORNER_RADIUS },
            { cx: -PAD, cy: ss.playground.height - PAD, radius: CORNER_RADIUS },
        ];

        ss.totalArea = ss.playground.width * ss.playground.height - Math.PI * Math.pow(CORNER_RADIUS, 2);
    };

    onMount(onResize);

    $effect(() => {
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
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
    <div class="clickable {ss.help || _prompt.opacity ? 'disabled' : ''}" onpointerdown={onPointerDown} onpointermove={onPointerMove}>
        {#if ss.orbs.length}
            {#key ss.orbs.length}
                <div class="level" transition:fade>{ss.level}</div>
            {/key}
        {/if}
    </div>
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
        color: white;
        opacity: 0.08;
        font-family: Roboto Condensed;
        font-size: 25dvh;
        pointer-events: none;
    }

    .disabled {
        pointer-events: none;
    }

    .mouse {
        display: none;
        grid-area: 1/1;
        place-self: end center;
        color: #ffffff40;
        font-family: Roboto Condensed;
        z-index: 5;
    }
</style>
