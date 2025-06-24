<script>
    import { PAD } from './const';
    import { ss } from './state.svelte';

    const { index } = $props();
    const orb = $derived(ss.orbs[index]);
    const { cx, cy, radius = 7, deg = 30 } = $derived(orb);
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

            const hitSolid = () => {
                for (let i = 0; i < ss.blobs.length; i++) {
                    const blob = ss.blobs[i];

                    if (blob.radius) {
                        const dist = Math.hypot(ss.orbs[index].cx - blob.cx, ss.orbs[index].cy - blob.cy);

                        if (dist < blob.radius + radius) {
                            return i;
                        }
                    }
                }

                return -1;
            };

            const dx = Math.cos(-deg * (Math.PI / 180)) * 2;
            const dy = Math.sin(-deg * (Math.PI / 180)) * 2;

            ss.orbs[index].cx += dx;
            ss.orbs[index].cy += dy;

            if (hitWall()) {
                //
            }

            if (hitSolid() !== -1) {
                // bounce off the solid blob
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
