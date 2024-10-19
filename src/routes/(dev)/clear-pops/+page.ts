import { goto } from '$app/navigation';
import { localPop } from '$lib/localPop';

export function load() {
    localPop.set(0);
    goto('/', { replaceState: true });
}
