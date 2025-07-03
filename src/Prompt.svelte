<script>
    import { PROMPT_RESET_STATS, PROMPT_START_OVER, X } from './const';
    import PromptPanel from './Prompt Panel.svelte';
    import { isGameOn, onStart, persist } from './shared.svelte';
    import { _prompt, _stats, ss } from './state.svelte';
    import { post, windowSize } from './utils';

    const label = $derived(_prompt.id);
    let scale = $state(1);

    const onStartOver = () => {
        ss.next = true;

        post(() => {
            delete ss.next;
            delete ss.tools;

            ss.orbs = [];
            ss.score = 0;
            ss.level = 1;

            onStart();
        }, 500);
    };

    const onResetStats = () => {
        if (isGameOn()) {
            _stats.plays = 1;
            _stats.best = ss.score;
        } else {
            _stats.plays = 0;
            _stats.best = 0;
        }

        persist();
    };

    $effect(() => {
        const onTransitionEnd = (e) => {
            const id = e.target.id;

            if (id !== 'prompt') {
                return false;
            }

            if (e.propertyName !== 'opacity') {
                return;
            }

            if (_prompt.opacity == 0) {
                _prompt.set(null);
            }
        };

        const onResize = () => {
            const { w } = windowSize();

            if (w < 500) {
                scale = w / 500;
            }
        };

        onResize();

        window.addEventListener('resize', onResize);
        window.addEventListener('transitionend', onTransitionEnd);

        return () => {
            window.rewindow.removeEventListener('resize', onResize);
            window.removeEventListener('transitionend', onTransitionEnd);
        };
    });
</script>

<div id="prompt" class="prompt {_prompt.opacity ? 'visible' : ''}" style="transform: scale({scale});">
    {#if label === PROMPT_START_OVER}
        <PromptPanel ops={[{ label, onClick: onStartOver }, { label: X }]} />
    {:else if label === PROMPT_RESET_STATS}
        <PromptPanel ops={[{ label, onClick: onResetStats }, { label: X }]} />
    {:else if label}
        <PromptPanel ops={[{ label }]} readOnly={true} />
    {:else}
        <div class="placeholder"></div>
    {/if}
</div>

<style>
    .prompt {
        grid-area: 1/1;
        place-self: center;
        margin-top: 15px;
        transform: scale(0);
        opacity: 0;
        z-index: 3;
        transition: 0.3s;
    }

    .visible {
        opacity: 1;
        transform: scale(1);
    }

    .placeholder {
        height: 36px;
    }
</style>
