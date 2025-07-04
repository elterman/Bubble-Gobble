import { PAD, PI_OVER_180 } from './const';

export const windowSize = () => {
    const d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        w = e.clientWidth || g.clientWidth,
        h = e.clientHeight || g.clientHeight;

    return { w, h };
};

export const clientRect = selector => {
    const ob = document.querySelector(selector);
    const r = ob?.getBoundingClientRect();

    return r;
};

export const underMouse = (event, selectors) => {
    for (const selector of selectors) {
        const r = clientRect(selector);

        if (!r) {
            continue;
        }

        const x = event.clientX;
        const y = event.clientY;

        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
            return true;
        }
    }

    return false;
};

export const focusOnApp = () => {
    document.querySelector('.app')?.focus();
};

export const isTouchable = () => navigator.maxTouchPoints > 0;

export const tapOrClick = (lower = false) => {
    const verb = isTouchable() ? 'Tap' : 'Click';
    return lower ? verb.toLowerCase() : verb;
};

export const isAppleDevice = () => /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export const scrollClass = () => `root-scroll ${isTouchable() ? 'root-scroll-mobile' : ''}`;

export const post = (fn, ms) => setTimeout(fn, ms);

export const range = (n) => [...Array(n + 1).keys()].slice(1);

export const sameBlob = (b1, b2) => b1.cx === b2.cx && b1.cy === b2.cy;

export const blobId = (cx, cy) => `blob-${cx}-${cy}`;

export const bounceAngle = (orb, other) => {
    const a = Math.atan2(other.cy - orb.cy, other.cx - orb.cx) / PI_OVER_180;
    return (180 - orb.deg - a * 2) % 360;
};

export const overlap = (rob1, rob2) => {
    if (!rob1.radius) {
        const r = clientRect(`#${blobId(rob1.cx, rob1.cy)}`);
        rob1 = { ...rob1, radius: r.width / 2 - PAD };
    }

    if (!rob2.radius) {
        const r = clientRect(`#${blobId(rob2.cx, rob2.cy)}`);
        rob2 = { ...rob2, radius: r.width / 2 - PAD };
    }

    return Math.hypot(rob1.cx - rob2.cx, rob1.cy - rob2.cy) < rob1.radius + rob2.radius;
};
