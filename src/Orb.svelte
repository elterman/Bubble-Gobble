<script>
    import { PAD } from './const';
    import { ss } from './state.svelte';
    import { overlap } from './utils';

    const { index } = $props();
    const orb = $derived(ss.orbs[index]);
    const { cx, cy, radius, deg = 30 } = $derived(orb);
    const width = $derived(radius * 2);
    const style = $derived(`transform: translate(${cx - radius}px, ${cy - radius}px); width: ${width}px;`);
    let ticks = $state(0);

    $effect(() => {
        if (ss.ticks > ticks) {
            ticks = ss.ticks;

            const hitWall = () => {
                const { playground } = ss;
                const x = orb.cx + PAD;
                const y = orb.cy + PAD;

                if (x - radius < 0 || x + radius > playground.width) {
                    ss.orbs[index].deg = 180 - deg;
                } else if (y - radius < 0 || y + radius > playground.height) {
                    ss.orbs[index].deg = -deg;
                }
            };

            const dx = Math.cos(-deg * (Math.PI / 180)) * 2;
            const dy = Math.sin(-deg * (Math.PI / 180)) * 2;

            ss.orbs[index].cx += dx;
            ss.orbs[index].cy += dy;

            if (hitWall()) {
                return;
            }

            const solid = ss.blobs.find(blob => blob.radius && overlap(orb, blob));

            if (solid) {
                // bounce of the solid blob
                const a = Math.atan2(solid.cy - orb.cy, solid.cx - orb.cx) * (180 / Math.PI);
                ss.orbs[index].deg = 180 - deg - a * 2;
            }
        }
    });
</script>

<div class="orb" {style}></div>

<style>
    .orb {
        grid-area: 1/1;
        aspect-ratio: 1;
        border-radius: 50%;
        background: linear-gradient(135deg, yellow, #ff4500);
    }
</style>
