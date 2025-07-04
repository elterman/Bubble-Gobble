<script>
    import { fade } from 'svelte/transition';
    import { ORB_RADIUS, PAD, PAGE_PAD, THRESHOLD } from './const';
    import { freezeBlob, log, setDelta } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { ss } from './state.svelte';
    import { bounceAngle, overlap, post, sameBlob } from './utils';

    const { index } = $props();
    const orb = $derived(ss.orbs[index]);
    const { cx, cy, deg, delta, lastBounce } = $derived(orb);
    const width = $derived(rad * 2);
    let ticks = $derived(orb.ticks);
    const pad = PAGE_PAD + PAD;
    const rad = ORB_RADIUS + PAD;
    let _this = $state(null);

    // const style = $derived(`left: ${cx + pad}px; top: ${cy + pad}px; width: ${width}px; padding: ${PAD}px;`);
    let left = $derived(cx + pad);
    let top = $derived(cy + pad);

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
        const r = _this.getBoundingClientRect();
        const x = r.x + r.width / 2 - PAD;
        const y = r.y + r.height / 2 - PAD;
        // log({ x, y });

        if (x - ORB_RADIUS <= 0) {
            return 4;
        }

        if (x + ORB_RADIUS >= ss.playground.width) {
            return 2;
        }

        if (y - ORB_RADIUS <= 0) {
            return 1;
        }

        if (y + ORB_RADIUS >= ss.playground.height) {
            return 3;
        }

        return 0;
    };

    $effect(() => {
        post(() => {
            ss.orbs[index].cx += delta.dx;
            ss.orbs[index].cy += delta.dy;
        });
    });

    $effect(() => {
        if (ss.ticks <= ticks) {
            return;
        }

        ticks = ss.ticks;

        let angle = null;
        let bounce = null;

        // bounce off an edge?
        const edge = hitEdge();

        if (edge && !justBounced({ edge })) {
            bounce = { edge };

            if (edge === 4 || edge === 2) {
                angle = 180 - deg;
            } else if (edge === 1 || edge === 3) {
                angle = -deg;
            }
        }

        if (!bounce) {
            // bounce off a corner?
            const corner = ss.corners.find((corner) => overlap(orb, corner));

            if (corner && !justBounced({ corner })) {
                bounce = { corner };
                angle = bounceAngle(orb, corner);
            }
        }

        if (!bounce) {
            // bounce off a blob?
            const blob = ss.blobs.find((blob) => overlap(orb, blob));

            if (blob && !justBounced(blob)) {
                bounce = { cx: blob.cx, cy: blob.cy };
                angle = bounceAngle(orb, blob);

                if (blob.radius) {
                    return;
                }

                if (ss.level <= THRESHOLD) {
                    freezeBlob(blob, false);
                } else if (!blob.dead) {
                    _sound.play('lost', { rate: 3 });
                    blob.dead = true;
                }
            }
        }

        if (!bounce) {
            // bounce off another orb?
            const i = ss.orbs.findIndex((o, i) => i !== index && overlap(orb, o));

            if (i >= 0 && !justBounced({ otherIndex: i })) {
                bounce = { otherIndex: i };
                angle = bounceAngle(orb, ss.orbs[i]);
            }
        }

        if (bounce) {
            ss.orbs[index].lastBounce = bounce;
            ss.orbs[index].deg = angle;
        }

        setDelta(index);

        post(() => delete ss.orbs[index].lastBounce);
    });

    $effect(() => {
        const onTransitionEnd = () => {
            let angle = null;
            let bounce = null;

            // bounce off an edge?
            const edge = hitEdge();

            if (edge && !justBounced({ edge })) {
                bounce = { edge };

                if (edge === 4 || edge === 2) {
                    angle = 180 - deg;
                } else if (edge === 1 || edge === 3) {
                    angle = -deg;
                }
            }

            if (bounce) {
                ss.orbs[index].lastBounce = bounce;
                ss.orbs[index].deg = angle;
            } else {
                post(() => delete ss.orbs[index].lastBounce);
            }

            setDelta(index);

            const d = ss.orbs[index].delta;
            ss.orbs[index].cx += d.dx;
            ss.orbs[index].cy += d.dy;
        };

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
        /* border: 1px solid #ffffff80; */
        transition: left 1ms linear, top 1ms linear;
    }

    .orb {
        aspect-ratio: 1;
        border-radius: 50%;
        background: linear-gradient(135deg, yellow, #ff4500);
    }
</style>
