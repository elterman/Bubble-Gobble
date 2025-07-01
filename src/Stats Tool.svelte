<script>
    import Stats from '$lib/images/Stats.webp';
    import { PROMPT_RESET_STATS } from './const';
    import { _sound } from './sound.svelte';
    import { _prompt } from './state.svelte';
    import ToolButton from './Tool Button.svelte';

    const onClick = () => {
        if (_prompt.id == PROMPT_RESET_STATS) {
            _prompt.opacity = 0;
            return;
        }

        _sound.play('plop');
        _prompt.set(PROMPT_RESET_STATS);
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
