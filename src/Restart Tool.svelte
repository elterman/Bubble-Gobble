<script>
    import ToolButton from './Tool Button.svelte';
    import Restart from '$lib/images/Restart.webp';
    import { ss } from './state.svelte';

    const onClick = () => {
        //
    };
</script>

<div class="restart-tool">
    <ToolButton src={Restart} width={45} {onClick} />
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
