<script>
    import ToolButton from './Tool Button.svelte';
    import SoundOff from '$lib/images/Sound Off.webp';
    import SoundOn from '$lib/images/Sound On.webp';
    import { ss } from './state.svelte';
    import { _sound } from './sound.svelte';

    const onClick = () => {
        _sound.on = !_sound.on;

        if (_sound.on) {
            _sound.play('won', { rate: 4 });
        }
    };
</script>

<div class="sound-tool">
    <ToolButton src={_sound.on ? SoundOn : SoundOff} width={45} {onClick} />
</div>

<style>
    .sound-tool {
        place-self: end start;
        display: grid;
        z-index: 2;
        clip-path: circle(50%);
        /* background: #fff; */
    }
</style>
