import { PAD } from './const';
import { ss } from './state.svelte';
import { clientRect } from './utils';

export const log = (value) => console.log($state.snapshot(value));

export const onPointerDown = (e) => {
    if (e.ctrlKey) {
        ss.blobs = [];
        return;
    }

    if (ss.blowing && ss.blobs.length > 0) {
        delete ss.blowing;
        const blob = ss.blobs[ss.blobs.length - 1];
        const { cx, cy } = blob;
        ss.blobs.pop();

        const r = clientRect(`#blob-${cx}-${cy}`);
        const radius = r.width / 2 - PAD;
        ss.blobs.push({ cx, cy, radius });

        return;
    }

    if (e.target.className.startsWith('blob')) {
        return;
    }

    const calcMaxRadius = (cx, cy) => {
        const sz = { x: ss.playground.width - 2 * PAD, y: ss.playground.height - 2 * PAD };
        const maxWidth = Math.min(cx, sz.x - cx) + PAD;
        const maxHeight = Math.min(cy, sz.y - cy) + PAD;
        let maxRadius = Math.min(maxWidth, maxHeight);
        let other = null;

        for (const blob of ss.blobs) {
            const dx = Math.abs(cx - blob.cx);
            const dy = Math.abs(cy - blob.cy);
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist - blob.radius < maxRadius) {
                maxRadius = dist - blob.radius;
                other = blob;
            }
        }

        return { maxRadius, other };
    };

    const cx = Math.round(e.offsetX);
    const cy = Math.round(e.offsetY);
    const { maxRadius, other } = calcMaxRadius(cx, cy);
    const blob = { cx, cy, maxRadius, other };
    ss.blobs.push(blob);
};
