<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />

	<!-- Basic Meta Tags -->
	<title>Deep Dive</title>
	<meta
		name="description"
		content="An AI-powered markdown editor with integrated chat. Write, edit, and collaborate with AI assistance in real-time."
	/>

	<!-- Open Graph / Social Media -->
	<meta property="og:title" content="Deep Dive" />
	<meta
		property="og:description"
		content="An AI-powered markdown editor with integrated chat. Write, edit, and collaborate with AI assistance in real-time."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://deep-dive-7zi.pages.dev/og-image.png" />
	<meta property="og:url" content="https://deep-dive-7zi.pages.dev/" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Deep Dive" />
	<meta
		name="twitter:description"
		content="An AI-powered markdown editor with integrated chat. Write, edit, and collaborate with AI assistance in real-time."
	/>
	<meta name="twitter:image" content="https://deep-dive-7zi.pages.dev/og-image.png" />
</svelte:head>

{@render children?.()}
