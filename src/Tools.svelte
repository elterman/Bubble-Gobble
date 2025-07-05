<script>
    import Cog from '$lib/images/Settings.webp';
    import { _sound } from './sound.svelte';
    import { ss } from './state.svelte';
    import ToolButton from './Tool Button.svelte';

    const onClick = () => {
        ss.tools = !ss.tools;
        _sound.play(ss.tools ? 'cluck' : 'click');
    };
</script>

<div class="tools {ss.tools ? 'spin' : ''}">
    <ToolButton src={Cog} width={80} {onClick} />
</div>

<style>
    .tools {
        grid-area: 1/1;
        place-self: end start;
        display: grid;
        margin: 0 0 -1px -1px;
        z-index: 4;
        clip-path: circle(50%);
        /* background: #fff7; */
        transition: transform 0.3s;
    }

    .spin {
        transform: rotate(180deg);
    }
</style>
