<script>
    import Arrow from '$lib/images/Next.webp';
    import { THRESHOLD1, THRESHOLD2 } from './const';
    import { onStart, percent } from './shared.svelte';
    import { _prompt, ss } from './state.svelte';
    import ToolButton from './Tool Button.svelte';
    import { post } from './utils';

    const disabled = $derived(ss.next || percent() < 50);

    const onClick = () => {
        ss.next = true;
        delete ss.help;
        _prompt.opacity = 0;

        post(() => {
            delete ss.next;

            if (ss.level === THRESHOLD2) {
                ss.orbs = [];
            }

            onStart();
            ss.level += 1;

            if (ss.level === THRESHOLD1 + 1) {
                ss.help = 'challenge1';
                _prompt.opacity = 0;
            } else if (ss.level === THRESHOLD2 + 1) {
                ss.help = 'challenge2';
                _prompt.opacity = 0;
            }
        }, 500);
    };
</script>

<div class="next">
    <ToolButton src={Arrow} {disabled} width={70} {onClick} />
</div>

<style>
    .next {
        grid-area: 1/1;
        place-self: end;
        display: grid;
        margin: 0 5px 5px 0;
        z-index: 2;
        clip-path: circle(50%);
        /* background: #fff7; */
    }
</style>
