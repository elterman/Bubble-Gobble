<script>
    import { onMount } from 'svelte';
    import { APP_STATE, PAD, PAGE_PAD } from './const';
    import Corner from './Corner.svelte';
    import Help from './Help.svelte';
    import Next from './Next.svelte';
    import Percent from './Percent.svelte';
    import Playground from './Playground.svelte';
    import Prompt from './Prompt.svelte';
    import Score from './Score.svelte';
    import { _stats } from './state.svelte';
    import Toolbar from './Toolbar.svelte';
    import Tools from './Tools.svelte';
    import { post } from './utils';

    onMount(() => {
        const loadGame = () => {
            const json = localStorage.getItem(APP_STATE);
            const job = JSON.parse(json);

            if (job) {
                _stats.plays = job.plays;
                _stats.best = job.best;
            }
        };

        post(loadGame);
    });
</script>

<div class="game-page" style='padding: {PAGE_PAD}px'>
    <Playground />
    <div class="box" style="padding: {PAD}px"></div>
    <Corner pos="nw" />
    <Corner pos="ne" />
    <Corner pos="se" />
    <Corner pos="sw" />
    <Percent />
    <Next />
    <Tools />
    <Toolbar />
    <Score />
    <Help />
    <Prompt />
</div>

<style>
    .game-page {
        grid-area: 1/1;
        display: grid;
        gap: 10px;
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
