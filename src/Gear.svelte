<script>
    import Cog from '$lib/images/Settings.webp';
</script>

<div class="gear">
    <img src={Cog} alt='' width={80}/>
</div>

<style>
    .gear {
        grid-area: 1/1;
        place-self: end start;
        display: grid;
        margin: 0 0 -1px -1px;
        cursor: pointer;
        z-index: 2;
        clip-path: circle(50%);
        /* background: #fff7; */
    }
</style>
