<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import Blob from './Blob.svelte';
    import { CORNER_RADIUS, PAD } from './const';
    import Orb from './Orb.svelte';
    import { onPointerDown } from './shared.svelte';
    import { _prompt, ss } from './state.svelte';
    import { clientRect, range } from './utils';

    const doResize = () => {
        ss.playground = clientRect('.playground');

        const perim = Math.round(ss.playground.width + ss.playground.height);
        ss.velocity = 1 + (perim - 1100) / 1500;

        ss.corners = [
            { cx: -PAD, cy: -PAD, radius: CORNER_RADIUS },
            { cx: ss.playground.width - PAD, cy: -PAD, radius: CORNER_RADIUS },
            { cx: ss.playground.width - PAD, cy: ss.playground.height - PAD, radius: CORNER_RADIUS },
            { cx: -PAD, cy: ss.playground.height - PAD, radius: CORNER_RADIUS },
        ];

        ss.totalArea = ss.playground.width * ss.playground.height - Math.PI * Math.pow(CORNER_RADIUS, 2);
    };

    onMount(doResize);

    const onResize = () => {
        doResize();

        if (ss.level > 1 || ss.orbs.length) {
            ss.level = 1;
            ss.blobs = [];
            ss.orbs = [];
            ss.totalArea = 0;
            ss.solidArea = 0;
            ss.score = 0;
            ss.help = true;
            delete ss.over;
        }
    };

    $effect(() => {
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    });
</script>

<div class="playground" style="padding: {PAD}px">
    <div class="debug">
        debug info
    </div>
    <div class="clickable {ss.help || ss.over || _prompt.opacity ? 'disabled' : ''}" onpointerdown={onPointerDown}>
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
        overflow: hidden;
    }

    .clickable {
        grid-area: 1/1;
        display: grid;
        z-index: 1;
        cursor: crosshair;
        box-sizing: border-box;
        /* border: 1px solid #fff7; */
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

    .debug {
        display: none;
        grid-area: 1/1;
        place-self: end center;
        color: #ffffff40;
        font-family: Roboto Condensed;
        z-index: 5;
    }
</style>
