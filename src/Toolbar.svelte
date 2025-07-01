<script>
    import { fly } from 'svelte/transition';
    import HelpTool from './Help Tool.svelte';
    import RestartTool from './Restart Tool.svelte';
    import SoundTool from './Sound Tool.svelte';
    import { ss } from './state.svelte';
    import StatsTool from './Stats Tool.svelte';
    import Stats from './Stats.svelte';
    import { windowSize } from './utils';

    let scale = $state(1);

    $effect(() => {
        const onResize = () => {
            const { x: w } = windowSize();
            scale = w < 680 ? w / 680 : 1;
        };

        onResize();

        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    });
</script>

{#if ss.tools}
    <div class="toolbar" style="transform: scale({scale});" transition:fly={{ x: -300, duration: 700 }}>
        <Stats />
        <StatsTool />
        <RestartTool />
        <SoundTool />
        <HelpTool />
    </div>
{/if}

<style>
    .toolbar {
        grid-area: 1/1;
        place-self: end start;
        z-index: 3;
        margin: 0 0 10px 100px;
        display: grid;
        grid-auto-flow: column;
        gap: 10px;
        background: #00000040;
        backdrop-filter: blur(15px);
        border-radius: 3vh;
        padding: 1px 10px;
        align-items: center;
        transform-origin: 0 50%;
    }
</style>
