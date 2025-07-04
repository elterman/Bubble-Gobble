import adapter from '@sveltejs/adapter-vercel';
// import adapter from '@sveltejs/adapter-static';
// import adapter from '@sveltejs/adapter-auto';

// static ops
let ops = {
	// default options are shown. On some platforms these options are set automatically — see below
	pages: 'build',
	assets: 'build',
	fallback: undefined,
	precompress: false,
	strict: true
};

// vercel ops
ops = {};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(ops)
	}
};

export default config;
