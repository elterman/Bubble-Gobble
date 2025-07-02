import { random } from 'lodash-es';
import { APP_STATE, CORNER_RADIUS, MIN_BLOB_RADIUS, PAD, THRESHOLD2 } from './const';
import { _sound } from './sound.svelte';
import { _stats, ss } from './state.svelte';
import { blobId, clientRect, overlap } from './utils';

export const log = (value) => console.log($state.snapshot(value));

const createOrbs = () => {
    const count = ss.orbs.length + 1;
    // const count = Math.max(ss.orbs.length, 9) + 1;
    ss.orbs = [];

    const width = ss.playground.width - PAD * 2;
    const height = ss.playground.height - PAD * 2;

    for (let i = 0; i < count; i++) {
        const orb = { cx: random(width), cy: random(height), radius: 7, deg: random(0, 360), ticks: 0 };
        ss.orbs.push(orb);
    }
};

export const onStart = () => {
    _sound.play('dice');

    delete ss.blowing;
    ss.ticks = 0;
    ss.blobs = [];
    ss.solidArea = 0;
    ss.deadArea = 0;

    createOrbs();

    clearInterval(ss.timer);
    ss.timer = setInterval(() => (ss.ticks += 1), 1);
};

export const freezeBlob = (index, solid = true) => {
    delete ss.blowing;
    const blob = ss.blobs[index];
    const { cx, cy } = blob;
    ss.blobs.splice(index, 1);

    const r = clientRect(`#${blobId(cx, cy)}`);
    const radius = r.width / 2 - PAD;
    ss.blobs.push({ cx, cy, radius, solid });

    let area = radius * radius * Math.PI;
    const prev = percent();

    if (solid) {
        ss.solidArea += area;

        const pct = percent();
        const gain = pct - prev;

        _sound.play(gain < 5 ? 'coin1' : gain < 15 ? 'coin2' : 'coins');
        updateScore(gain);

        if (prev < 50 && pct >= 50) {
            _sound.play('won', { rate: 2 });
        }
    } else {
        if (!blob.dead) {
            _sound.play('lost', { rate: 3 });
        }

        ss.deadArea += area;
    }
};

export const randomBubble = () => {
    const w = Math.floor(ss.playground.width - PAD * 2);
    const h = Math.floor(ss.playground.height - PAD * 2);

    let cx;
    let cy;

    while (true) {
        cx = random(0, w);
        cy = random(0, h);

        if (cx < CORNER_RADIUS && cy < CORNER_RADIUS) {
            continue;
        }

        if (cx < CORNER_RADIUS && cy > h -CORNER_RADIUS) {
            continue;
        }

        if (cx > w - CORNER_RADIUS && cy < CORNER_RADIUS) {
            continue;
        }

        if (cx > w - CORNER_RADIUS && cy > h - CORNER_RADIUS) {
            continue;
        }

        if (ss.blobs.find(b => overlap(b, {cx, cy, radius: MIN_BLOB_RADIUS}))) {
            continue;
        }

        break;
    }

    createBubble(Math.round(cx), Math.round(cy));
};

export const createBubble = (cx, cy) => {
    const calcMaxRadius = () => {
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

    const { maxRadius, other } = calcMaxRadius(cx, cy);
    const blob = { cx, cy, maxRadius, other };
    ss.blobs.push(blob);
};

export const onPointerDown = (e) => {
    if (ss.blowing) {
        const bi = ss.blobs.length - 1;
        freezeBlob(bi, !ss.blobs[bi].dead);
        return;
    }

    if (ss.level > THRESHOLD2) {
        randomBubble();
        return;
    }

    if (e.target.className.startsWith('blob')) {
        return;
    }

    createBubble(Math.round(e.offsetX), Math.round(e.offsetY));

    if (ss.level === 1 && ss.blobs.length === 1) {
        _stats.plays += 1;
        persist();
    }
};

export const updateScore = (gain) => {
    ss.score += gain;

    if (ss.score > _stats.best) {
        _stats.best = ss.score;
        persist();
    }
};

export const persist = () => {
    localStorage.setItem(APP_STATE, JSON.stringify({ ..._stats }));
};

export const percent = () => Math.floor((ss.solidArea / ss.totalArea) * 100);

export const isGameOn = () => ss.level > 1 || ss.blobs.length > 0;