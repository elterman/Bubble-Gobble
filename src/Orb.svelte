<script>
    import { fade } from 'svelte/transition';
    import { PAD, PI_OVER_180, THRESHOLD } from './const';
    import { freezeBlob } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { ss } from './state.svelte';
    import { bounceAngle, overlap, post, sameBlob } from './utils';

    const { index } = $props();
    const orb = $derived(ss.orbs[index]);
    const { cx, cy, radius, deg = 0, lastBounce } = $derived(orb);
    const rad = $derived(radius + PAD);
    const width = $derived(rad * 2);
    const style = $derived(`transform: translate(${cx - rad}px, ${cy - rad}px); width: ${width}px; padding: ${PAD}px;`);
    let ticks = $derived(orb.ticks);

    const justBounced = (ob) => {
        if (!lastBounce) {
            return false;
        }

        if (ob.edge !== undefined) {
            return ob.edge === lastBounce.edge;
        }

        if (ob.otherIndex !== undefined) {
            return ob.otherIndex === lastBounce.otherIndex;
        }

        return sameBlob(lastBounce, ob);
    };

    const hitEdge = () => {
        const x = orb.cx + PAD;
        const y = orb.cy + PAD;

        if (x - radius <= 0) {
            return 4;
        }

        if (x + radius >= ss.playground.width) {
            return 2;
        }

        if (y - radius <= 0) {
            return 1;
        }

        if (y + radius >= ss.playground.height) {
            return 3;
        }

        return 0;
    };

    $effect(() => {
        if (ss.ticks <= ticks) {
            return;
        }

        ticks = ss.ticks;

        const dx = Math.cos(-deg * PI_OVER_180) * 2;
        const dy = Math.sin(-deg * PI_OVER_180) * 2;

        ss.orbs[index].cx += dx;
        ss.orbs[index].cy += dy;

        // bounce off an edge?
        const edge = hitEdge();

        if (edge && !justBounced({ edge })) {
            ss.orbs[index].lastBounce = { edge };

            if (edge === 4 || edge === 2) {
                ss.orbs[index].deg = 180 - deg;
            } else if (edge === 1 || edge === 3) {
                ss.orbs[index].deg = -deg;
            }

            return;
        }

        // bounce off a corner?
        const corner = ss.corners.find((corner) => overlap(orb, corner));

        if (corner && !justBounced({ corner })) {
            ss.orbs[index].lastBounce = { corner };
            ss.orbs[index].deg = bounceAngle(orb, corner);
            return;
        }

        // bounce off a blob?
        const blob = ss.blobs.find((blob) => overlap(orb, blob));

        if (blob && !justBounced(blob)) {
            ss.orbs[index].lastBounce = { cx: blob.cx, cy: blob.cy };
            ss.orbs[index].deg = bounceAngle(orb, blob);

            if (blob.radius) {
                return;
            }

            if (ss.level <= THRESHOLD) {
                freezeBlob(blob, false);
            } else if (!blob.dead) {
                _sound.play('lost', { rate: 3 });
                blob.dead = true;
            }

            return;
        }

        // bounce off another orb?
        const i = ss.orbs.findIndex((o, i) => i !== index && overlap(orb, o));

        if (i >= 0 && !justBounced({ otherIndex: i })) {
            ss.orbs[index].lastBounce = { otherIndex: i };
            ss.orbs[index].deg = bounceAngle(orb, ss.orbs[i]);
            return;
        }

        post(() => {
            if (ss.orbs.length > index) {
                delete ss.orbs[index].lastBounce;
            }
        });
    });
</script>

{#if !ss.next}
    <div class="orb-outer" {style} transition:fade>
        <div class="orb"></div>
    </div>
{/if}

<style>
    .orb-outer {
        grid-area: 1/1;
        aspect-ratio: 1;
        z-index: 3;
        border-radius: 50%;
        box-sizing: border-box;
        /* border: 1px solid #fff7; */
    }

    .orb {
        aspect-ratio: 1;
        border-radius: 50%;
        background: linear-gradient(135deg, yellow, #ff4500);
    }
</style>
