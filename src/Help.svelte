<script>
    import { fade } from 'svelte/transition';
    import PromptButton from './Prompt Button.svelte';
    import { onStart } from './shared.svelte';
    import { ss } from './state.svelte';
    import { tapOrClick, windowSize } from './utils';
    import { THRESHOLD } from './const';
    import { _sound } from './sound.svelte';
    THRESHOLD;
    const ul = '<ul style="margin: 15px 0 0 0;">';
    const li = '<li style="margin: 5px 0 0 -20px;">';
    const click = tapOrClick();

    const CONTENT = `
        <span>Inflate greedy blobs to claim space.</span>
        <span>Fill at least 50% of the playfield to unlock the next level.</span>
        ${ul}
        ${li}${click} anywhere to start growing a bubble.</li>
        ${li}${click} again to fix it in place.</li>
        ${li}Avoid the walls, flying balls, and existing bubbles.</li>
        ${li}Collisions turn inflating bubbles into permanent dead zones.</li>
        </ul>`;

    const CHALLENGE = `
        <span>So far so good! From now on:</span>
        ${ul}
        ${li}When two bubbles collide, both become dead zones.</li>
        ${li}When struck by a ball, a new bubble becomes a dead zone but continues to grow.</li>
        </ul>`;

    const CURRENT_CHALLENGE = `
        <span>The current challenge:</span>
        ${ul}
        ${li}When two bubbles collide, both become dead zones.</li>
        ${li}When struck by a ball, a new bubble becomes a dead zone but continues to grow.</li>
        </ul>`;

    const onClick = () => {
        _sound.play('click');
        delete ss.help;

        if (!ss.orbs.length) {
            onStart();
            return;
        }
    };

    let scale = $state(1);

    $effect(() => {
        const onResize = () => {
            let scx = 1;
            let scy = 1;

            const { w, h } = windowSize();

            if (w < 600) {
                scx = w / 600;
            }

            if (h < 850) {
                scy = h / 850;
            }

            scale = Math.min(scx, scy);
        };

        onResize();

        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    });
</script>

{#if ss.help}
    <div class="help {ss.orbs.length ? '' : 'initial'}" style="transform: scale({scale});" transition:fade={{ duration: 200 }}>
        <div class="title">
            <span class="blue">BUBBLE</span>
            <span class="orange">GOBBLE</span>
        </div>
        <div class="content" tabindex="-1">
            {#if ss.help === 'CHALLENGE'}
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {@html CHALLENGE}
            {:else if ss.level > THRESHOLD}
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {@html CURRENT_CHALLENGE}
            {:else}
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {@html CONTENT}
            {/if}
        </div>
        <div class="buttons">
            <PromptButton op={{ label: ss.orbs.length ? 'CONTINUE' : 'PLAY', onClick }} />
        </div>
    </div>
{/if}

<style>
    .help {
        position: absolute;
        grid-area: 1/1;
        place-self: center;
        display: grid;
        justify-content: center;
        box-sizing: border-box;
        width: 550px;
        gap: 50px;
        z-index: 3;
        padding: calc(min(40px, 8%)) calc(min(40px, 8%)) calc(min(40px, 8%)) calc(min(50px, 10%));
        background: #00000040;
        backdrop-filter: blur(15px);
        border-radius: 50px;
        /* border: 1px solid #fff7; */
    }

    .initial {
        background: none;
        backdrop-filter: none;
    }

    .title {
        font-family: Jelly Belly;
        font-size: 96px;
        display: grid;
        line-height: 0.9em;
        color: black;
        text-shadow: -1px -1px white;
        place-self: center;
    }

    .blue {
        filter: drop-shadow(0 0 6px #65dbdc);
    }

    .orange {
        filter: drop-shadow(0 0 6px #fdcb13);
    }

    .content {
        color: #ffffffa0;
        font-family: Jelly Belly;
        font-size: 26px;
        letter-spacing: 0.05em;
        display: grid;
        align-content: start;
    }

    .buttons {
        place-self: center;
    }
</style>
