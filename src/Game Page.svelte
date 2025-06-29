<script>
    import { PAD } from './const';
    import Corner from './Corner.svelte';
    import Gear from './Gear.svelte';
    import Next from './Next.svelte';
    import Percent from './Percent.svelte';
    import Playground from './Playground.svelte';
    import Score from './Score.svelte';
</script>

<div class="game-page">
    <Playground/>
    <div class="box" style="padding: {PAD}px"></div>
    <Corner pos='nw'/>
    <Corner pos='ne'/>
    <Corner pos='se'/>
    <Corner pos='sw'/>
    <Percent/>
    <Next/>
    <Gear/>
    <Score/>
</div>

<style>
    .game-page {
        grid-area: 1/1;
        display: grid;
        gap: 10px;
        padding: 10px;
    }

    .box {
        grid-area: 1/1;
        position: relative;
        box-sizing: border-box;
    }

    .box:before {
        content: '';
        position: absolute;
        inset: 0;
        background: #ff0055;
        mask:
            radial-gradient(100px at 100px 100px, #0000 calc(98% - 1px), #000 calc(100% - 1px) 98%, #0000) -100px -100px,
            linear-gradient(90deg, #000 2px, #0000 0) -1px 50% /100% calc(100% - 200px + 1px) repeat-x,
            linear-gradient(#000 2px, #0000 0) 50% -1px / calc(100% - 200px + 1px) 100% repeat-y;
    }
</style>
