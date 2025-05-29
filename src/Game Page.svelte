<script>
    import Playground from './Playground.svelte';
</script>

<div class="game-page">
    <div></div>
    <Playground/>
</div>

<style>
    .game-page {
        grid-area: 1/1;
        display: grid;
        grid: auto 1fr / auto;
        gap: 10px;
        padding: 10px;
    }
</style>
