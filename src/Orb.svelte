<script>
    import { ORB_RADIUS, PAD, PAGE_PAD, THRESHOLD } from './const';
    import { freezeBlob, setDelta } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { ss } from './state.svelte';
    import { bounceAngle, overlap, post, sameBlob } from './utils';

    const { index } = $props();
    const orb = $derived(ss.orbs[index]);
    const { lastBounce } = $derived(orb);
    const width = $derived(rad * 2);
    const rad = ORB_RADIUS + PAD;
    let _this = $state(null);
    let cx = $state(0);
    let cy = $state(0);
    let left = $derived(orb.cx + PAGE_PAD - ORB_RADIUS);
    let top = $derived(orb.cy + PAGE_PAD - ORB_RADIUS);

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
        if (cx + PAD - ORB_RADIUS <= 0) {
            return 4;
        }

        if (cx + PAD + ORB_RADIUS >= ss.playground.width) {
            return 2;
        }

        if (cy + PAD - ORB_RADIUS <= 0) {
            return 1;
        }

        if (cy + PAD + ORB_RADIUS >= ss.playground.height) {
            return 3;
        }

        return 0;
    };

    $effect(() => {
        post(() => {
            ss.orbs[index].cx += orb.delta.dx;
            ss.orbs[index].cy += orb.delta.dy;
        });
    });

    const onTransitionEnd = () => {
        const r = _this.getBoundingClientRect();
        cx = r.x + ORB_RADIUS - PAGE_PAD;
        cy = r.y + ORB_RADIUS - PAGE_PAD;
        const orbus = { cx, cy, radius: ORB_RADIUS };

        let angle = null;
        let bounce = null;

        // bounce off an edge?
        const edge = hitEdge();

        if (edge && !justBounced({ edge })) {
            bounce = { edge };

            if (edge === 4 || edge === 2) {
                angle = 180 - orb.deg;
            } else if (edge === 1 || edge === 3) {
                angle = -orb.deg;
            }
        }

        if (!bounce) {
            // bounce off a corner?
            const corner = ss.corners.find((corner) => overlap(orbus, corner));

            if (corner && !justBounced({ corner })) {
                bounce = { corner };
                angle = bounceAngle(orb, corner);
            }
        }

        if (!bounce) {
            // bounce off a blob?
            const blob = ss.blobs.find((blob) => overlap(orbus, blob));

            if (blob && !justBounced(blob)) {
                bounce = { cx: blob.cx, cy: blob.cy };
                angle = bounceAngle(orb, blob);

                if (!blob.radius) {
                    if (ss.level <= THRESHOLD) {
                        freezeBlob(blob, false);
                    } else if (!blob.dead) {
                        _sound.play('lost', { rate: 3 });
                        blob.dead = true;
                    }
                }
            }
        }

        if (!bounce) {
            // bounce off another orb?
            const i = ss.orbs.findIndex((o, i) => i !== index && overlap(orbus, { cx: o.cx, y: o.cy, radius: ORB_RADIUS }));

            if (i >= 0 && !justBounced({ otherIndex: i })) {
                bounce = { otherIndex: i };
                angle = bounceAngle(orb, ss.orbs[i]);
            }
        }

        if (bounce) {
            ss.orbs[index].lastBounce = bounce;
            ss.orbs[index].deg = angle;
        } else {
            post(() => delete orb.lastBounce);
        }

        setDelta(index);

        const d = orb.delta;
        ss.orbs[index].cx += d.dx;
        ss.orbs[index].cy += d.dy;
    };

    $effect(() => {
        if (!_this) {
            return;
        }

        _this.addEventListener('transitionend', onTransitionEnd);
        return () => _this.removeEventListener('transitionend', onTransitionEnd);
    });
</script>

{#if !ss.next}
    <div bind:this={_this} class="orb-outer" style="left: {left}px; top: {top}px; width: {width}px; padding: {PAD}px;">
        <div class="orb"></div>
    </div>
{/if}

<style>
    .orb-outer {
        /* grid-area: 1/1; */
        position: absolute;
        aspect-ratio: 1;
        z-index: 3;
        border-radius: 50%;
        box-sizing: border-box;
        /* border: 1px solid #fff7; */
        transition:
            left 2ms linear,
            top 2ms linear;
    }

    .orb {
        aspect-ratio: 1;
        border-radius: 50%;
        background: linear-gradient(135deg, yellow, #ff4500);
    }
</style>
