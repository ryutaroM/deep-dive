<script lang="ts">
	import Header from '../components/Header.svelte';
	import Chat from '../components/Chat.svelte';
	import Editor from '../components/Editor.svelte';
</script>

<div class="app-container">
	<Header />
	<main class="markdown-workspace">
		<section class="editor-section">
			<Editor />
		</section>
		<section class="chat-section">
			<Chat />
		</section>
	</main>
	<footer class="footer">
		<p>© 2025 Deep Dive. All rights reserved.</p>
	</footer>
</div>

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		height: 100%;
		box-sizing: border-box;
	}

	:global(*, *::before, *::after) {
		box-sizing: inherit;
	}

	:global(.bytemd) {
		height: calc(80vh - 200px);
		width: 100%;
	}

	.app-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
	}

	.markdown-workspace {
		flex: 1; /* 残りのスペースを埋める */
		display: flex;
		flex-direction: column;
	}

	.editor-section {
		flex: 1;
		padding: 1rem;
	}

	.chat-section {
		display: flex;
		justify-content: flex-end; /* 右端に寄せる */
		padding: 1rem;
	}

	.footer {
		text-align: center;
		padding: 1rem;
		background-color: #f8f9fa;
		border-top: 1px solid #e9ecef;
		margin-top: auto; /* フッターを下に押し下げる */
	}
</style>
