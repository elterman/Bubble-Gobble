<script>
    import Blob from './Blob.svelte';
    import { ss } from './state.svelte';

    const onPointerDown = (e) => {
        console.log(e);
        const blob = { cx: e.offsetX, cy: e.offsetY, r: 50 };
        ss.blobs.push(blob);
    };
</script>

<div class="game-page">
    <div class="inner" onpointerdown={onPointerDown}>
        {#each ss.blobs as blob, i (i)}
            <Blob {blob} />
        {/each}
    </div>
</div>

<style>
    .game-page {
        grid-area: 1/1;
        display: grid;
    }

    .inner {
        grid-area: 1/1;
        display: grid;
        margin: 20px;
        border: 1px solid #ffffff40;
    }
</style>
