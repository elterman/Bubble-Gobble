<script>
    import Question from '$lib/images/Question.webp';
    import { _prompt, ss } from './state.svelte';
    import ToolButton from './Tool Button.svelte';

    const onClick = () => {
        ss.help = !ss.help;

        if (ss.help) {
            delete ss.tools;
            _prompt.opacity = 0;
        }
    };
</script>

<div class="help-tool">
    <ToolButton src={Question} width={45} {onClick} />
</div>

<style>
    .help-tool {
        place-self: end start;
        display: grid;
        z-index: 2;
        clip-path: circle(50%);
        /* background: #fff; */
    }
</style>
