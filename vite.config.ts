import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		globals: true,
		environment: 'node',
		include: [
			'tests/ai-server.spec.ts',
			'src/**/*.spec.ts'
		],
		exclude: [
			'src/**/*.svelte.spec.ts',
			'tests/editor-*.spec.ts',
			'tests/seed.spec.ts',
			'tests/example.spec.ts'
		]
	}
});
