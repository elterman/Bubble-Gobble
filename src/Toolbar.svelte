<script>
    import { fade, fly } from 'svelte/transition';
    import HelpTool from './Help Tool.svelte';
    import RestartTool from './Restart Tool.svelte';
    import SoundTool from './Sound Tool.svelte';
    import { ss } from './state.svelte';
    import StatsTool from './Stats Tool.svelte';
    import Stats from './Stats.svelte';
</script>

{#if ss.tools}
    <div class="toolbar" transition:fly={{ x: -300 }}>
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
    }
</style>
