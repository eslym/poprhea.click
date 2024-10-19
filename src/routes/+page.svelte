<script lang="ts">
    import { PUBLIC_TURBO_CPS } from '$env/static/public';
    import { localPop } from '$lib/localPop';
    import { onMount } from 'svelte';

    import audioOpen from '$lib/audio/open.ogg';
    import audioShut from '$lib/audio/shut.ogg';

    import { derived } from 'svelte/store';

    const BASE_FAST = Number.parseFloat(PUBLIC_TURBO_CPS);

    let FAST = BASE_FAST;

    let interval = undefined;
    let latestPop = $localPop;
    let pps = 0;
    let open = false;

    let audioOpenEl: HTMLAudioElement = undefined as any;
    let audioShutEl: HTMLAudioElement = undefined as any;

    let subtitle = derived(localPop, (pop: number) => {
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
    });

    $: turbo = pps > FAST;

    onMount(() => {
        setInterval(() => {
            pps = ($localPop - latestPop) / 5;
            latestPop = $localPop;
        }, 5000);
        return () => clearInterval(interval);
    });

    function onDown(ev: MouseEvent) {
        if (ev.buttons === 1) {
            down();
        }
    }

    function onUp(ev: MouseEvent) {
        if (ev.buttons !== 1) {
            end();
            FAST = BASE_FAST;
        }
    }

    function down() {
        open = true;
        audioOpenEl.play();
    }

    function end() {
        if (open) {
            audioShutEl.play();
            open = false;
            $localPop++;
            FAST = BASE_FAST * 1.8;
        }
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

<svelte:body
    on:selectstart|preventDefault|stopPropagation={() => {}}
    on:touchstart={down}
    on:touchend|preventDefault|stopPropagation={end}
    on:mousedown={onDown}
    on:mouseup={onUp}
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
    <div class="rhea">
        <enhanced:img
            class="rhea"
            class:hide={!open || turbo}
            alt=""
            src="$lib/images/rhea_open.png?w=600;800&format=png"
        />
        <enhanced:img
            class="rhea"
            class:hide={open || turbo}
            alt=""
            src="$lib/images/rhea_shut.png?w=600;800&format=png"
        />
        <enhanced:img
            class="rhea"
            class:hide={!open || !turbo}
            alt=""
            src="$lib/images/turbo_rhea_open.png?w=600;800&format=png"
        />
        <enhanced:img
            class="rhea"
            class:hide={open || !turbo}
            alt=""
            src="$lib/images/turbo_rhea_shut.png?w=600;800&format=png"
        />
    </div>
    {#if $subtitle}
        <div class="subtitle">{$subtitle}</div>
    {/if}
</div>
