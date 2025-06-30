export const ss = $state({
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
    steps: 0,
    plays: 0,
    total_score: 0,
    best: null,
    ave: () => _stats.plays ? Math.round(_stats.total_score / _stats.plays) : 0,
});