import { writable } from 'svelte/store';

const STORAGE_KEY = 'local_pop';

function ensurePop(pop: number) {
    return Number.isNaN(pop) || !Number.isInteger(pop) || pop < 0 ? 0 : pop;
}

export const localPop = writable<number>(
    import.meta.env.SSR
        ? 0
        : ensurePop(Number.parseInt(localStorage.getItem(STORAGE_KEY) as string))
);

if (!import.meta.env.SSR) {
    localPop.subscribe((pop) => {
        localStorage.setItem(STORAGE_KEY, pop.toString());
    });

    window.addEventListener('storage', (ev) => {
        if (ev.key === STORAGE_KEY) {
            localPop.set(ensurePop(Number.parseInt(ev.newValue as string)));
        }
    });
}
