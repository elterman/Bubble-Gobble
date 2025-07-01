<script>
    import imgX from '$lib/images/X.webp';
    import { X } from './const';
    import { _prompt } from './state.svelte';
    import { post } from './utils';

    const { op } = $props();

    let scale = $state(1);
    const x = $derived(op.label === X);
    const style = $derived(`transform: scale(${scale})`);

    $effect(() => {
        const onTransitionEnd = (e) => {
            if (e.target.id !== op.label) {
                return;
            }

            if (scale < 1) {
                scale = 1;
            } else {
                post(op.onClick);
                _prompt.opacity = 0;
            }
        };

        window.addEventListener('transitionend', onTransitionEnd);
        return () => window.removeEventListener('transitionend', onTransitionEnd);
    });
</script>

<div
    id={op.label}
    class={['button-base no-highlight button gradient-blue', { x }]}
    style={`${op.style}; ${style}`}
    onpointerdown={() => (scale = 0.8)}>
    {#if x}
        <img src={imgX} alt="X" width={18} />
    {:else}
        {op.label}
    {/if}
</div>

<style>
    .button {
        cursor: pointer;
        /* height: 36px; */
        border-radius: 50vh;
        box-sizing: border-box;
        padding: 0px 20px 3px 20px;
        font-family: Jelly Belly;
        font-size: 32px;
        color: #000;
        opacity: 0.8;
        letter-spacing: 0.07em;
        border: 5px solid black;
    }

    .button:hover {
        filter: sepia(1);
    }

    .x {
        width: 36px;
        padding-bottom: 1px;
        font-weight: normal;
    }
</style>
