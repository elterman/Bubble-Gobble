<script>
    import { CORNER_RADIUS, PAD } from './const';

    const { pos } = $props();
    const radius = CORNER_RADIUS + PAD;
    const width = radius * 2;
    const transform = $derived(`translate(${pos[1] === 'w' ? '-' : ''}${radius}px, ${pos[0] === 'n' ? '-' : ''}${radius}px)`);
</script>

<div class="corner {pos}" style='width: {width}px; transform: {transform}'></div>

<style>
    .corner {
        display: grid;
    }

    .corner {
        grid-area: 1/1;
        width: 224px;
        aspect-ratio: 1;
        border-radius: 50%;
        /* background: #fff8; */
        z-index: 1;
    }

    .nw {
        place-self: start;
    }

    .ne {
        place-self: start end;
    }

    .se {
        place-self: end;
    }

    .sw {
        place-self: end start;
    }
</style>
