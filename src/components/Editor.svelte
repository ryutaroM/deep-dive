<script lang="ts">
	import { Editor } from 'bytemd';
	import gfm from '@bytemd/plugin-gfm';
	import 'highlight.js/styles/default.css';
	import highlight from '@bytemd/plugin-highlight';
	import 'bytemd/dist/index.css';
	import breaks from '@bytemd/plugin-breaks';
	import copyPlugin from '$lib/plugins/copy';
	import gemoji from '@bytemd/plugin-gemoji';
	import { onMount } from 'svelte';

	// reactive editor data
	let editorData: string = $state('');
	let saveTimeout: ReturnType<typeof setTimeout> | null = null;
	let isInitialized = $state(false);

	function handleChange(e: CustomEvent) {
		editorData = e.detail.value;
	}

	const LocalDataKey = 'editor-data';
	onMount(() => {
		const saved = localStorage.getItem(LocalDataKey);
		if (saved) editorData = saved;
		isInitialized = true;
	});

	$effect(() => {
		// track necessary state variables
		const currentData = editorData;
		const initialized = isInitialized;

		if (!initialized) return;

		if (saveTimeout) clearTimeout(saveTimeout);

		saveTimeout = setTimeout(() => {
			localStorage.setItem(LocalDataKey, currentData);
		}, 500);
	});

	const plugins = [gfm(), highlight(), breaks(), copyPlugin(), gemoji()];
</script>

<Editor value={editorData} {plugins} on:change={handleChange} />
