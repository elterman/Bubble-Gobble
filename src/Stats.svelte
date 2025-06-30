<script>
    import NumberFlow from '@number-flow/svelte';
    import { _stats } from './state.svelte';
</script>

<div class="panel">
    <span class="label">PLAYS</span>
    <span class="value"><NumberFlow value={_stats.plays}/></span>
    <span class="label">  AVE</span>
    <span class="value"><NumberFlow value={_stats.ave()}/></span>
    <span class="label">  BEST</span>
    <span class="value"><NumberFlow value={_stats.best}/></span>
</div>

<style>
    .panel {
        place-self: center;
        grid-area: 1/1;
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        padding: 8px 5px 0;
        font-family: Roboto Condensed;
        gap: 7px;
    }

    .label {
        color: #ffffff80;
    }

    .value {
        color: #94e5f0;
    }
</style>
