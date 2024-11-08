import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { execSync } from 'child_process';

let version = process.env.GITHUB_SHA;

if (!version) {
    try {
        version = execSync('git rev-parse HEAD').toString().trim();
    } catch (_) {}
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    preprocess: [vitePreprocess({})],

    kit: {
        // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
        // If your environment is not supported or you settled on a specific environment, switch out the adapter.
        // See https://kit.svelte.dev/docs/adapters for more information about adapters.
        adapter: adapter({
            fallback: 'index.html'
        })
    },
    paths: {
        relative: false
    },
    version: {
        name: version,
        pollInterval: 1000 * 60 * 5
    }
};

export default config;
