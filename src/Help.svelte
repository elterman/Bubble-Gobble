<script>
    import { fade } from 'svelte/transition';
    import PromptButton from './Prompt Button.svelte';
    import { scrollClass, tapOrClick } from './utils';
    import { ss } from './state.svelte';
    import { onStart } from './shared.svelte';

    // const hi = '<span style=\'color: #65dbdc;\'>';
    const ul = '<ul style=\'margin: 15px 0 0 0;\'>';
    const li = '<li style=\'margin: 5px 0 0 -20px;\'>';

    const content = `<span style='margin-right: 10px;'>Fill at least 50% of the available space with bubbles to progress to the next level.</span>${ul}${li}${tapOrClick()} anywhere to start growing a bubble.</li>${li}${tapOrClick()} again to freeze it in place.</li>${li}Avoid the walls, flying balls, and existing bubbles.</li>${li}Collisions turn inflating bubbles into permenent dead zones.</li></ul>`;

    const onClick = () => {
        delete ss.help;

        if (!ss.orbs.length) {
            onStart();
        }
    };
</script>

{#if ss.help}
    <div class="help {ss.orbs.length ? '' : 'initial'}" transition:fade={{ duration: 200 }}>
        <div class="title">
            <span class="blue">BUBBLE</span>
            <span class="orange">GOBBLE</span>
        </div>
        <div class="content {scrollClass()}" tabindex="-1">
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html content}
        </div>
        <div class="buttons">
            <PromptButton op={{ label: ss.orbs.length ? 'RESUME' : 'PLAY', onClick }} />
        </div>
    </div>
{/if}

<style>
    .help {
        grid-area: 1/1;
        place-self: center;
        display: grid;
        justify-content: center;
        width: calc(min(80dvw, 500px));
        gap: 50px;
        background: #00000040;
        z-index: 3;
        padding: 40px 40px 40px 50px;
        backdrop-filter: blur(15px);
        border-radius: 50px;
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
        font-size: 28px;
        letter-spacing: 0.05em;
        display: grid;
        align-content: start;
    }

    .buttons {
        place-self: center;
    }
</style>
