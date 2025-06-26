<script>
    import { PAD } from './const';
    import { freezeBlob } from './shared.svelte';
    import { ss } from './state.svelte';
    import { blobId, bounceAngle, clientRect, overlap } from './utils';

    const { index } = $props();
    const orb = $derived(ss.orbs[index]);
    const { cx, cy, radius, deg = 0 } = $derived(orb);
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

            const solid = ss.blobs.find((blob) => blob.radius && overlap(orb, blob));

            if (solid) {
                // bounce off the solid blob
                ss.orbs[index].deg = bounceAngle(orb, solid);
            } else {
                // bounce off the blowing blob
                const bubble = ss.blowing ? ss.blobs[ss.blobs.length - 1] : null;

                const hitBubble = () => {
                    const r = clientRect(`#${blobId(bubble.cx, bubble.cy)}`);
                    const bubbleRadius = r.width / 2 - PAD;
                    return Math.hypot(cx - bubble.cx, cy - bubble.cy) < radius + bubbleRadius;
                };

                if (bubble && hitBubble()) {
                    ss.orbs[index].deg = bounceAngle(orb, bubble);
                    freezeBlob(ss.blobs.length - 1, false);
                } else {
                    // bounce off the other orbs
                    const other = ss.orbs.find((o, i) => i !== index && overlap(orb, o));

                    if (other) {
                        ss.orbs[index].deg = bounceAngle(orb, other);
                    }
                }
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
        z-index: 3;
    }
</style>
