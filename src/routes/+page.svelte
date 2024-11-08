<script lang="ts">
    import { PUBLIC_TURBO_CPS } from '$env/static/public';
    import { localPop } from '$lib/localPop';
    import { onMount } from 'svelte';

    import audioOpen from '$lib/audio/open.ogg';
    import audioShut from '$lib/audio/shut.ogg';

    const BASE_FAST = Number.parseFloat(PUBLIC_TURBO_CPS);

    let FAST = $state(BASE_FAST);

    let interval = undefined;
    let latestPop = $localPop;
    let pps = $state(0);
    let open = $state(false);

    let audioOpenEl: HTMLAudioElement = $state(undefined as any);
    let audioShutEl: HTMLAudioElement = $state(undefined as any);

    let screenWidth = $state(window.innerWidth);

    let subtitle = $derived(mapSubtitle($localPop));

    let turbo = $derived(pps > FAST);

    let scale = $derived(Math.min(1400, screenWidth * 0.9) / 800);

    onMount(() => {
        setInterval(() => {
            pps = ($localPop - latestPop) / 5;
            latestPop = $localPop;
        }, 5000);
        return () => clearInterval(interval);
    });

    function mapSubtitle(pop: number) {
        if (pop === 1) {
            return '是什麼讓你覺得這東西真的存在？';
        }
        if (pop >= 5 && pop < 10) {
            return '都說沒東西了';
        }
        if (pop >= 10 && pop < 20) {
            return '你到底是在期待什麼？';
        }
        if (pop >= 20 && pop < 23) {
            return '好吧';
        }
        if (pop >= 100 && pop < 120) {
            return '你這麼無聊為何不去看Youtube？';
        }
        return undefined;
    }

    function onDown(ev: MouseEvent) {
        if (ev.buttons === 1) {
            down();
        }
    }

    function onUp(ev: MouseEvent) {
        if (ev.buttons !== 1) {
            end(ev);
            FAST = BASE_FAST;
        }
    }

    function down() {
        open = true;
        audioOpenEl.play();
    }

    function end(ev: Event) {
        ignore(ev);
        if (open) {
            audioShutEl.play();
            open = false;
            $localPop++;
            FAST = BASE_FAST * 1.8;
        }
    }

    function ignore(ev: Event) {
        ev.preventDefault();
        ev.stopPropagation();
    }
</script>

<svelte:head>
    <title>PopRhea (1 click = 1 rhea)</title>

    <style>
        body {
            cursor: pointer;
        }
    </style>
</svelte:head>

<svelte:window bind:innerWidth={screenWidth} />

<svelte:body
    onselectstart={ignore}
    ontouchstart={down}
    ontouchend={end}
    onmousedown={onDown}
    onmouseup={onUp}
/>

<audio src={audioOpen} bind:this={audioOpenEl} style="display:none;"></audio>
<audio src={audioShut} bind:this={audioShutEl} style="display:none;"></audio>

<div class:sky={true} class:turbo>
    {#if $localPop >= 10}
        <div class="popCount" class:large={open}>
            {$localPop.toLocaleString('en-US')}
            <div class="unit">Rhea Corey</div>
        </div>
    {/if}
    <div class="locator">
        <div class="rhea" style:--scale={scale}>
            <enhanced:img
                class="rhea"
                class:hide={!open || turbo}
                alt=""
                src="$lib/images/rhea_open.png?w=400;600;800&format=png"
            />
            <enhanced:img
                class="rhea"
                class:hide={open || turbo}
                alt=""
                src="$lib/images/rhea_shut.png?w=400;600;800&format=png"
            />
            <enhanced:img
                class="rhea"
                class:hide={!open || !turbo}
                alt=""
                src="$lib/images/turbo_rhea_open.png?w=400;600;800&format=png"
            />
            <enhanced:img
                class="rhea"
                class:hide={open || !turbo}
                alt=""
                src="$lib/images/turbo_rhea_shut.png?w=600;800&format=png"
            />
        </div>
    </div>
    {#if subtitle}
        <div class="subtitle">{subtitle}</div>
    {/if}
</div>
