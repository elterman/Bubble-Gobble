<script>
    import Arrow from '$lib/images/Next.webp';
    import { onStart, percent } from './shared.svelte';

    const disabled = $derived(percent() < 50);

    const onPointerDown = () => {
        onStart();
    };
</script>

<div class="next {disabled ? 'disabled' : ''}" onpointerdown={onPointerDown}>
    <img src={Arrow} alt='' width={70}/>
</div>

<style>
    .next {
        grid-area: 1/1;
        place-self: end;
        display: grid;
        margin: 0 5px 5px 0;
        cursor: pointer;
        z-index: 2;
        transition: opacity 0.3s;
        clip-path: circle(50%);
        /* background: #fff7; */
    }

    .disabled {
        pointer-events: none;
        filter: grayscale(1);
        opacity: 0.35;
    }
</style>
