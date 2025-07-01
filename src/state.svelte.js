
export const ss = $state({
    level: 1,
    blobs: [],
    orbs: [],
    totalArea: 0,
    solidArea: 0,
    deadArea: 0,
    score: 0,
    help: true,
});

export const _prompt = $state({
    id: '',
    opacity: 1,

    set: (id) => {
        _prompt.id = id;
        _prompt.opacity = id ? 1 : 0;
    }
});

export const _stats = $state({
    plays: 0,
    best: 0,
});