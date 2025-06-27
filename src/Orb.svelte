<script>
    import { PAD } from './const';
    import { freezeBlob } from './shared.svelte';
    import { ss } from './state.svelte';
    import { blobId, bounceAngle, clientRect, overlap, post, sameBlob } from './utils';

    const { index } = $props();
    const orb = $derived(ss.orbs[index]);
    const { cx, cy, radius, deg = 0, lastBounce } = $derived(orb);
    const rad = $derived(radius + PAD);
    const width = $derived(rad * 2);
    const style = $derived(`transform: translate(${cx - rad}px, ${cy - rad}px); width: ${width}px; padding: ${PAD}px;`);
    let ticks = $state(0);

    $effect(() => {
        if (ss.ticks > ticks) {
            // if (false) {
            ticks = ss.ticks;

            const hitWall = () => {
                const { playground } = ss;
                const x = orb.cx + PAD;
                const y = orb.cy + PAD;

                if (x - radius <= 0 || x + radius >= playground.width) {
                    ss.orbs[index].deg = 180 - deg;
                } else if (y - radius <= 0 || y + radius >= playground.height) {
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

            const justBounced = (ob) => {
                if (!lastBounce) {
                    return false;
                }

                if (ob.otherIndex !== undefined) {
                    return ob.otherIndex === lastBounce.otherIndex;
                }

                return sameBlob(lastBounce, ob);
            };

            // bounce off the bubble?
            const bubble = ss.blowing ? ss.blobs[ss.blobs.length - 1] : null;

            if (bubble && !justBounced(bubble)) {
                const r = clientRect(`#${blobId(bubble.cx, bubble.cy)}`);
                const bubbleRadius = r.width / 2 - PAD;

                if (Math.hypot(cx - bubble.cx, cy - bubble.cy) < radius + bubbleRadius) {
                    ss.orbs[index].lastBounce = { cx: bubble.cx, cy: bubble.cy };
                    ss.orbs[index].deg = bounceAngle(orb, bubble);
                    freezeBlob(ss.blobs.length - 1, false);
                    return;
                }
            }

            // bounce off a solid blob?
            const solid = ss.blobs.find((blob) => blob.radius && overlap(orb, blob));

            if (solid && !justBounced(solid)) {
                ss.orbs[index].lastBounce = { cx: solid.cx, cy: solid.cy };
                ss.orbs[index].deg = bounceAngle(orb, solid);
                return;
            }

            // bounce off another orb?
            const otherIndex = ss.orbs.findIndex((o, i) => i !== index && overlap(orb, o));

            if (otherIndex >= 0 && !justBounced({ otherIndex })) {
                ss.orbs[index].lastBounce = { otherIndex };
                ss.orbs[index].deg = bounceAngle(orb, ss.orbs[otherIndex]);
                return;
            }

            post(() => delete ss.orbs[index].lastBounce);
        }
    });
</script>

<div class="orb-outer" {style}>
    <div class="orb"></div>
</div>

<style>
    .orb-outer {
        grid-area: 1/1;
        aspect-ratio: 1;
        z-index: 3;
        border-radius: 50%;
        box-sizing: border-box;
        /* border: 1px solid #ffffff80; */
    }

    .orb {
        aspect-ratio: 1;
        border-radius: 50%;
        background: linear-gradient(135deg, yellow, #ff4500);
    }
</style>
