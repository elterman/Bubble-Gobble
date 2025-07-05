<script>
    import GamePage from '../Game Page.svelte';
    import Splash from '../Splash.svelte';
    import { post } from '../utils';

    $effect(() => {
        const disable = (e) => {
            e.preventDefault();
        };

        window.addEventListener('contextmenu', disable);
        window.addEventListener('dblclick', disable);

        return () => {
            window.removeEventListener('contextmenu', disable);
            window.removeEventListener('dblclick', disable);
        };
    });

    let splash = $state(true);
    post(() => (splash = false), 2000);
</script>

<div class="app">
    <div class="vignette"></div>
    <GamePage />

    {#if splash}
        <Splash />
    {/if}
</div>

<style>
    /* :root {
    } */

    :global {
        body {
            margin: 0;
            overflow: hidden;
            /* background: black; */
        }

        .button-base {
            box-sizing: border-box;
            cursor: pointer;
            display: grid;
            place-content: center;
            transition: transform 0.1s;
        }

        .button-base:focus {
            outline: none !important;
        }

        .no-highlight {
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .button-gradient {
            background: -webkit-linear-gradient(-90deg, #ede2c5, #ffe4ad 50%, #d8ac3c 100%);
            /* filter: hue-rotate(-145deg); */
        }
    }

    .app {
        display: grid;
        height: 100dvh;
        -webkit-user-select: none;
        user-select: none;
        overflow: hidden;
        touch-action: manipulation;
        outline: none !important;
        background: #202020;
        background-image: url('$lib/images/Pattern.webp');
        /* background-size: 200px; */
    }

    .vignette {
        grid-area: 1/1;
        background-image: radial-gradient(transparent, black 150%);
    }

    @font-face {
        font-family: Poppins;
        src: url('$lib/fonts/Poppins-Regular.ttf');
    }

    @font-face {
        font-family: 'Roboto Condensed';
        src: url('$lib/fonts/RobotoCondensed-Medium.ttf');
    }

    @font-face {
        font-family: 'Jelly Belly';
        src: url('$lib/fonts/JellyBellyFont-Regular.ttf');
    }
</style>
