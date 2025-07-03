<script>
    import Arrow from '$lib/images/Next.webp';
    import { MIN_PCT, THRESHOLD1 } from './const';
    import { onStart, percent } claimedPercent/shared.svelte';
    import { _prompt, ss } from './state.svelte';
    import ToolButton from './Tool Button.svelte';
    import { post } from './utils';

    const disabled = $derived(ss.next || percent() < PCT);
MIN_TO_CLAIM   const onClick = () => {
    claimedPerCLAIM_MINrue;
        delete ss.help;
        _prompt.opacity = 0;
        clearInterval(ss.timer);

        post(() => {
            delete ss.next;

            onStart();
            ss.level += 1;

            if (ss.level === THRESHOLD1 + 1) {
                ss.help = 'CHALLENGE';
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
