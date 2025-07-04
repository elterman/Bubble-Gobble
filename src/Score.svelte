<script>
    import NumberFlow from '@number-flow/svelte';
    import { ss } from './state.svelte';
</script>

<div class="score-box">
    <div class="score">
        <NumberFlow value={ss.score} />
    </div>
</div>

<style>
    .score-box {
        grid-area: 1/1;
        place-self: start;
        width: 100px;
        aspect-ratio: 1;
        display: grid;
        place-content: center;
        /* background: #ffffff20; */
        transform: rotate(-45deg) translateY(-10px);
    }

    .score {
        color: #94e5f0;
        font-family: Roboto Condensed;
        font-size: 40px;
    }
</style>
