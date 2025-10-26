<script lang="ts">
	import Header from '../components/Header.svelte';
	import Chat from '../components/Chat.svelte';
	import Editor from '../components/Editor.svelte';
	import rulebookData from '../config/rulebook.json' assert { type: 'json' };
	import type { RuleBook } from '../types/rulebook';

	const ruleBook = rulebookData as RuleBook;
</script>

<div class="app-container">
	<Header />
	<main class="markdown-workspace">
		<section class="editor-section">
			<Editor />
		</section>
		<section class="chat-section">
			<Chat {ruleBook} />
		</section>
	</main>
	<footer class="footer">
		<p>© 2025 Deep Dive. All rights reserved.</p>
	</footer>
</div>

<style>
	:global(:root) {
		/* Primary Colors - ヘッダーグラデーション */
		--primary-start: #667eea;
		--primary-end: #764ba2;

		/* Border Colors - 薄紫系に統一 */
		--border-light: rgba(102, 126, 234, 0.15);
		--border-medium: rgba(102, 126, 234, 0.25);

		/* Background Colors */
		--bg-primary: #ffffff;
		--bg-secondary: rgba(102, 126, 234, 0.02);
		--bg-footer: linear-gradient(180deg, #fafbff 0%, #f5f6ff 100%);

		/* Shadows */
		--shadow-sm: 0 2px 4px rgba(102, 126, 234, 0.1);
		--shadow-md: 0 4px 8px rgba(102, 126, 234, 0.15);

		/* Border Radius */
		--radius: 8px;
	}

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
		border-radius: var(--radius);
		overflow: hidden;
		border: 1px solid var(--border-light);
		box-shadow: var(--shadow-md);
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
		background: var(--bg-footer);
		border-top: 1px solid var(--border-light);
		margin-top: auto; /* フッターを下に押し下げる */
	}
</style>
