<script>
    import Arrow from '$lib/images/Next.webp';
    import { MAX_LEVELS, PCT, THRESHOLD } from './const';
    import { percent, onStart } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { _prompt, ss } from './state.svelte';
    import ToolButton from './Tool Button.svelte';
    import { post } from './utils';
    import Bonus from '$lib/images/Bonus.webp';

    const disabled = $derived(ss.level === MAX_LEVELS || ss.next || percent() < PCT);

    const onClick = () => {
        _sound.play('click');

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

<div class="next">
    {#if ss.level < MAX_LEVELS}
        <div class="circle {disabled ? '' : 'pulse'}">
            <ToolButton src={Arrow} {disabled} width={70} {onClick} />
        </div>
    {:else if percent() < PCT}
        <div class="last-round pulse">
            <span>LAST</span>
            <span>ROUND</span>
        </div>
    {:else}
        <div class="bonus pulse">
            <div class="bonus-icon">
                <ToolButton src={Bonus} width={40} {onClick} />
            </div>
            <div class="claim">CLAIM</div>
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
    }

    .circle {
        clip-path: circle(50%);
        /* background: #fff7; */
    }

    .last-round {
        display: grid;
        place-items: end;
        color: #f094e5c0;
        font-family: Roboto Condensed;
        font-size: 24px;
        margin: 0 3px 6px 0;
    }

    .bonus {
        display: grid;
        gap: 15px;
        margin: 0 5px 0 0;
        color: #c9bb92;
        font-family: Roboto Condensed;
    }

    .pulse {
        animation: pulse 0.2s alternate 8 ease-in-out;
    }

    @keyframes pulse {
        from {
            transform: scale(1);
        }
        to {
            transform: scale(0.7);
        }
    }
</style>
