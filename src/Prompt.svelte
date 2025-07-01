<script>
    import { PROMPT_RESET_STATS, PROMPT_START_OVER, X } from './const';
    import PromptPanel from './Prompt Panel.svelte';
    import { onStart } from './shared.svelte';
    import { _prompt, ss } from './state.svelte';
    import { post } from './utils';

    const label = $derived(_prompt.id);

    const onStartOver = () => {
        ss.next = true;

        post(() => {
            delete ss.next;
            delete ss.tools;

            ss.orbs = [];
            ss.score = 0;

            onStart();
        }, 500);
    };

    const onResetStats = () => {
        //
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

        window.addEventListener('transitionend', onTransitionEnd);
        return () => window.removeEventListener('transitionend', onTransitionEnd);
    });
</script>

<div id="prompt" class="prompt {_prompt.opacity ? 'visible' : ''}">
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
