import { PAD } from './const';
import { ss } from './state.svelte';
import { blobId, clientRect } from './utils';

export const log = (value) => console.log($state.snapshot(value));

const onStart = () => {
    if (ss.started) {
        return;
    }

    ss.started = true;
    ss.ticks = 0;
    ss.blobs = [];
    ss.orbs = [{ cx: 100, cy: 100, radius: 7 }];

    ss.timer = setInterval(() => {
        ss.ticks += 1;
    }, 1);
};

const onClear = () => {
    clearInterval(ss.timer);
    delete ss.timer;
    ss.blobs = [];
    ss.orbs = [];
    ss.started = false;
};

export const freezeBlob = (index, solid = true) => {
    delete ss.blowing;
    const blob = ss.blobs[index];
    const { cx, cy } = blob;
    ss.blobs.splice(index, 1);

    const r = clientRect(`#${blobId(cx, cy)}`);
    const radius = r.width / 2 - PAD;
    ss.blobs.push({ cx, cy, radius, solid });
};

export const onPointerDown = (e) => {
    if (e.ctrlKey) {
        onStart();
        return;
    }

    if (!ss.started) {
        return;
    }

    if (e.shiftKey) {
        onClear();
        return;
    }

    if (ss.blowing && ss.blobs.length > 0) {
        freezeBlob(ss.blobs.length - 1);
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
