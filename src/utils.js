import { PAD } from "./const";

export const windowSize = () => {
    const d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = e.clientWidth || g.clientWidth,
        y = e.clientHeight || g.clientHeight;

    return { x, y };
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
    const a = Math.atan2(other.cy - orb.cy, other.cx - orb.cx) * (180 / Math.PI);
    return (180 - orb.deg - a * 2) % 360;
};

export const overlap = (rob1, rob2) => {
    if (!rob1.radius) {
        const r = clientRect(`#${blobId(rob1.cx, rob1.cy)}`);
        rob1 = { ...rob1, radius: r.width / 2 - PAD };
    }

    if (!rob2.radius) {
        const r = clientRect(`#${blobId(rob2.cx, rob2.cy)}`);
        rob1 = { ...rob2, radius: r.width / 2 - PAD };
    }

    // const r1 = {
    //     x1: rob1.cx - rob1.radius,
    //     x2: rob1.cx + rob1.radius,
    //     y1: rob1.cy - rob1.radius,
    //     y2: rob1.cy + rob1.radius,
    // };

    // const r2 = {
    //     x1: rob2.cx - rob2.radius,
    //     x2: rob2.cx + rob2.radius,
    //     y1: rob2.cy - rob2.radius,
    //     y2: rob2.cy + rob2.radius,
    // };

    // if (r1.x1 > r2.x2 || r1.x2 < r1.x1 || r1.y1 > r2.y2 || r1.y2 < r2.y1) {
    //     return false;
    // }

    return Math.hypot(rob1.cx - rob2.cx, rob1.cy - rob2.cy) < rob1.radius + rob2.radius;
};
