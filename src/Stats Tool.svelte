<script>
    import ToolButton from './Tool Button.svelte';
    import Stats from '$lib/images/Stats.webp';
    import { ss } from './state.svelte';

    const onClick = () => {
        //
    };
</script>

<div class="restart-tool">
    <ToolButton src={Stats} width={45} {onClick} />
</div>

<style>
    .restart-tool {
        place-self: end start;
        display: grid;
        z-index: 2;
        clip-path: circle(50%);
        /* background: #fff; */
    }
</style>
