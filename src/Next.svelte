<script>
    import Arrow from '$lib/images/Next.webp';
    import { onStart, percent } from './shared.svelte';
    import { _prompt, ss } from './state.svelte';
    import ToolButton from './Tool Button.svelte';
    import { post } from './utils';

    const disabled = $derived(ss.next || percent() < 50);

    const onClick = () => {
        ss.next = true;

        post(() => {
            delete ss.next;
            onStart();

            if (ss.orbs.length === 6) {
                ss.help = 'challenge';
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
