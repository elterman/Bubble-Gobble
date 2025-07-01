<script>
    const { src, width, height, disabled, onClick } = $props();
</script>

<div class="button no-highlight {disabled ? 'disabled' : ''}" style="width: {width}px; height: {height || width}px;" onpointerdown={onClick}>
    <img {src} alt="" width={width || 'unset'} />
</div>

<style>
    .button {
        grid-area: 1/1;
        filter: drop-shadow(0 5px 5px #000000);
        cursor: pointer;
        box-sizing: border-box;
        transition: opacity 0.3s;
    }

    .button:hover {
        filter: drop-shadow(0 0 10px #ffffffa0);
    }

    .disabled {
        pointer-events: none;
        filter: grayscale(1);
        opacity: 0.35;
    }
</style>
