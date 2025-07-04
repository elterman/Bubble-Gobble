<script>
    import Arrow from '$lib/images/Next.webp';
    import { PCT, THRESHOLD } from './const';
    import { percent, onStart } from './shared.svelte';
    import { _prompt, ss } from './state.svelte';
    import ToolButton from './Tool Button.svelte';
    import { post } from './utils';

    const disabled = $derived(ss.level === 10 || ss.next || percent() < PCT);

    const onClick = () => {
        ss.next = true;
        delete ss.help;
        _prompt.opacity = 0;
        clearInterval(ss.timer);

        post(() => {
            delete ss.next;

            if (ss.level === THRESHOLD) {
                ss.orbs = [];
            }

            onStart();
            ss.level += 1;

            if (ss.level === THRESHOLD + 1) {
                ss.help = 'CHALLENGE';
                _prompt.opacity = 0;
            }
        }, 500);
    };
</script>

<div class="next {ss.level < 10 ? 'circle' : ''}">
    {#if ss.level < 10}
        <ToolButton src={Arrow} {disabled} width={70} {onClick} />
    {:else}
        <div class="last-round">
            <span>LAST</span>
            <span>ROUND</span>
        </div>
    {/if}
</div>

<style>
    .next {
        grid-area: 1/1;
        place-self: end;
        display: grid;
        margin: 0 5px 5px 0;
        z-index: 2;
        /* background: #fff7; */
    }

    .circle {
        clip-path: circle(50%);
    }

    .last-round {
        display: grid;
        place-items: end;
        color: #f094e5c0;
        font-family: Roboto Condensed;
        font-size: 24px;
        margin: 0 3px 6px 0;
    }
</style>
