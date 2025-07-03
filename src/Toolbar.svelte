<script>
    import { fly } from 'svelte/transition';
    import HelpTool from './Help Tool.svelte';
    import RestartTool from './Restart Tool.svelte';
    import SoundTool from './Sound Tool.svelte';
    import { ss } from './state.svelte';
    import StatsTool from './Stats Tool.svelte';
    import Stats from './Stats.svelte';
    import { windowSize } from './utils';

    let wide = $state(true);

    $effect(() => {
        const onResize = () => {
            const { x: w } = windowSize();
            wide = w > 650;
        };

        onResize();

        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    });
</script>

{#if wide}
    {#if ss.tools}
        <div class="toolbar wide" transition:fly={{ x: -300, duration: 700 }}>
            <Stats />
            <StatsTool />
            <RestartTool />
            <SoundTool />
            <HelpTool />
        </div>
    {/if}
{:else if ss.tools}
    <div class="toolbar narrow" transition:fly={{ x: -300, duration: 700 }}>
        <div><Stats /></div>
        <div class="tools">
            <StatsTool />
            <RestartTool />
            <SoundTool />
            <HelpTool />
        </div>
    </div>
{/if}

<style>
    .toolbar {
        grid-area: 1/1;
        place-self: end start;
        z-index: 3;
        margin: 0 0 10px 100px;
        display: grid;
        background: #00000040;
        backdrop-filter: blur(15px);
        border-radius: 3vh;
        padding: 1px 10px;
        align-items: center;
        transform-origin: 0 50%;
    }

    .wide {
        grid-auto-flow: column;
        gap: 10px;
    }

    .narrow {
        justify-items: start;
    }

    .tools {
        display: grid;
        grid-auto-flow: column;
        gap: 10px;
    }
</style>
