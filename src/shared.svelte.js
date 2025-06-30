import { random } from 'lodash-es';
import { PAD } from './const';
import { ss } from './state.svelte';
import { blobId, clientRect } from './utils';
import { _sound } from './sound.svelte';

export const log = (value) => console.log($state.snapshot(value));

export const onStart = () => {
    if (ss.started) {
        return;
    }

    ss.started = true;
    ss.ticks = 0;
    ss.blobs = [];
    ss.solidArea = 0;
    ss.deadArea = 0;

    ss.orbs = [
        { cx: Math.round(ss.playground.width / 2), cy: Math.round(ss.playground.height / 2), radius: 7, deg: random(0, 360), },
    ];

    ss.timer = setInterval(() => (ss.ticks += 1), 1);
};

const onClear = () => {
    clearInterval(ss.timer);
    delete ss.timer;
    ss.blobs = [];
    ss.orbs = [];
    ss.started = false;
    ss.solidArea = 0;
    ss.deadArea = 0;
};

export const freezeBlob = (index, solid = true) => {
    delete ss.blowing;
    const blob = ss.blobs[index];
    const { cx, cy } = blob;
    ss.blobs.splice(index, 1);

    const r = clientRect(`#${blobId(cx, cy)}`);
    const radius = r.width / 2 - PAD;
    ss.blobs.push({ cx, cy, radius, solid });

    const area = radius * radius * Math.PI;
    const prev = percent();

    if (solid) {
        ss.solidArea += area;

        const pct = percent();
        ss.score += pct - prev;

        if (prev < 50 && pct >= 50) {
            _sound.play('won', { rate: 2 });
        }
    } else {
        ss.deadArea += area;
    }
};

export const onPointerDown = (e) => {
    if (e.ctrlKey) {
        onStart(e);
        return;
    }

    if (!ss.started) {
        return;
    }

    if (e.shiftKey) {
        onClear();
        return;
    }

    if (e.altKey) {
        ss.orbs.push({
            cx: Math.round(e.offsetX),
            cy: Math.round(e.offsetY),
            radius: 7,
            deg: random(0, 360),
        });

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
        const maxWidth = Math.min(cx, sz.x - cx) + PAD - 1;
        const maxHeight = Math.min(cy, sz.y - cy) + PAD - 1;
        let maxRadius = Math.min(maxWidth, maxHeight);
        let other = null;

        for (const rob of [...ss.blobs, ...ss.corners]) {
            const dist = Math.hypot(cx - rob.cx, cy - rob.cy);

            if (dist - rob.radius < maxRadius) {
                maxRadius = dist - rob.radius;
                other = rob;
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

export const percent = () => Math.floor((ss.solidArea / ss.totalArea) * 100);