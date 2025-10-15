<script lang="ts">
	import { AIProviderService } from '../services/aiProvider';
	import type { RuleBook } from '../types/rulebook';
	import rulebookData from '../config/rulebook.json';
	import { tick } from 'svelte';

	let chatHistoryElement: HTMLDivElement;

	let userInput: string = '';
	let chatHistory: Array<{ role: string; content: string }> = [];
	let isLoading = false;
	let apiKey: string = '';
	let aiService: AIProviderService | null = null;

	function isRuleBook(obj: any): obj is RuleBook {
		return (
			obj &&
			typeof obj.ai === 'object' &&
			typeof obj.ai.providers === 'object' &&
			typeof obj.ai.defaultProvider === 'string' &&
			typeof obj.prompts === 'object'
		);
	}

	if (!isRuleBook(rulebookData)) {
		throw new Error('Invalid rulebook configuration');
	}

	function setApiKey() {
		if (apiKey.trim()) {
			aiService = new AIProviderService(rulebookData, apiKey.trim());
		}
	}

	async function sendMessage() {
		if (!userInput.trim() || isLoading || !aiService) return;

		chatHistory = [...chatHistory, { role: 'user', content: userInput }];
		const currentInput = userInput;
		userInput = '';
		isLoading = true;

		// ユーザーメッセージ送信後にスクロール
		await tick();
		scrollToBottom();

		try {
			const response = await aiService.generateResponse(currentInput);
			chatHistory = [...chatHistory, { role: 'assistant', content: response }];

			// AI応答後にスクロール
			await tick();
			scrollToBottom();
		} catch (error) {
			console.error('AI Error:', error);
			chatHistory = [
				...chatHistory,
				{ role: 'error', content: 'エラーが発生しました。APIキーを確認してください。' }
			];
			await tick();
			scrollToBottom();
		} finally {
			isLoading = false;
		}
	}

	function scrollToBottom() {
		if (chatHistoryElement) {
			chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	}
</script>

<div class="chat-container">
	{#if !aiService}
		<!-- APIキー未設定時 -->
		<div class="api-key-setup">
			<h3>🔐 APIキーを設定してください</h3>
			<input
				class="api-key-input"
				type="password"
				bind:value={apiKey}
				placeholder="Groq APIキーを入力"
				on:keypress={(e) => e.key === 'Enter' && setApiKey()}
			/>
			<button class="set-btn" on:click={setApiKey}> 開始 </button>
		</div>
	{:else}
		<!-- チャットUI -->
		<div class="chat-history" bind:this={chatHistoryElement}>
			{#each chatHistory as message}
				<div class="message {message.role}">
					<strong>{message.role === 'user' ? 'You' : 'AI'}:</strong>
					<p>{message.content}</p>
				</div>
			{/each}
			{#if isLoading}
				<div class="message loading">AI is thinking...</div>
			{/if}
		</div>

		<input
			class="chat-input"
			type="text"
			bind:value={userInput}
			on:keypress={handleKeyPress}
			placeholder="Chatting with AI... (Shift + Enter for newline)"
			disabled={isLoading}
		/>
	{/if}
</div>

<style>
	.chat-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 300px;
		max-height: 600px;
		width: 100%;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		overflow: hidden;
		background: white;
	}

	.api-key-setup {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
		padding: 1.5rem;
		gap: 0.75rem;
	}

	.api-key-setup h3 {
		margin: 0;
		color: #333;
		font-size: 1.1rem;
	}

	.api-key-input {
		width: 100%;
		max-width: 350px;
		padding: 0.6rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 0.9rem;
	}

	.set-btn {
		padding: 0.6rem 1.5rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-weight: 600;
		font-size: 0.9rem;
		transition: opacity 0.2s;
	}

	.set-btn:hover {
		opacity: 0.9;
	}

	.chat-history {
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		padding: 0.75rem;
		background: #fafafa;
		min-height: 0;
		scrollbar-width: thin;
		scrollbar-color: #ccc transparent;
	}

	/* Webkit用のスクロールバースタイル */
	.chat-history::-webkit-scrollbar {
		width: 6px;
	}

	.chat-history::-webkit-scrollbar-track {
		background: transparent;
	}

	.chat-history::-webkit-scrollbar-thumb {
		background: #ccc;
		border-radius: 3px;
	}

	.chat-history::-webkit-scrollbar-thumb:hover {
		background: #999;
	}

	.message {
		margin-bottom: 0.5rem;
		padding: 0.5rem 0.75rem;
		border-radius: 6px;
		word-wrap: break-word;
		font-size: 0.9rem;
		line-height: 1.4;
	}

	.message strong {
		font-size: 0.85rem;
		display: block;
		margin-bottom: 0.25rem;
	}

	.message p {
		margin: 0;
		white-space: pre-wrap;
	}

	.message.user {
		background: #e3f2fd;
		margin-left: 20%;
		text-align: right;
	}

	.message.assistant {
		background: #f1f8e9;
		margin-right: 20%;
	}

	.message.error {
		background: #ffebee;
		color: #c62828;
		margin: 0 10%;
	}

	.message.loading {
		background: #fff3e0;
		font-style: italic;
		text-align: center;
		padding: 0.4rem;
	}

	.chat-input {
		width: 100%;
		padding: 0.75rem;
		font-size: 0.9rem;
		border: none;
		border-top: 1px solid #e0e0e0;
		box-sizing: border-box;
		flex-shrink: 0;
		resize: none;
		font-family: inherit;
	}

	.chat-input:focus {
		outline: none;
		border-top-color: #667eea;
	}

	.chat-input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		background: #f5f5f5;
	}
</style>
