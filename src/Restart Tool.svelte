<script>
    import Restart from '$lib/images/Restart.webp';
    import { PROMPT_START_OVER } from './const';
    import { _sound } from './sound.svelte';
    import { _prompt, ss } from './state.svelte';
    import ToolButton from './Tool Button.svelte';

    const onClick = () => {
        if (_prompt.id == PROMPT_START_OVER) {
            _prompt.opacity = 0;
            return;
        }

        _sound.play('plop');
        _prompt.set(PROMPT_START_OVER);
    };
</script>

<div class="restart-tool">
    <ToolButton src={Restart} width={45} {onClick} disabled={ss.level === 1 && ss.blobs.length === 0}/>
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
