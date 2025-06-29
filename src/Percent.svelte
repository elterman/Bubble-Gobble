<script>
    import NumberFlow from '@number-flow/svelte';
    import { percent } from './shared.svelte';

    const value = $derived(percent());
</script>

<div class="percent {value < 50 ? '' : 'threshold'}">
    <NumberFlow value={value} />%
</div>

<style>
    .percent {
        grid-area: 1/1;
        place-self: start end;
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        color: #ffffff80;
        font-family: Roboto Condensed;
        font-size: 40px;
        margin: 10px 10px 0 0;
        transform: rotate(45deg);
        transition: color 0.3s linear;
    }

    .threshold {
        color: #80DC5D;
    }
</style>
