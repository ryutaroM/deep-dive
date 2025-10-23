# Deep Dive - AI-Powered Markdown Editor

A modern markdown editor with integrated AI chat capabilities. Built with SvelteKit and powered by Groq's LLM API.

## ✨ Features

### 📝 Rich Markdown Support
- **Syntax Highlighting** - Beautiful code blocks with language-specific highlighting
- **Live Preview** - See your formatted content in real-time
- **Auto-save** - Your work is automatically saved to local storage

### 🤖 AI Chat Integration
- Get instant help from AI while you write
- Multiple LLM models available (Llama 3.1, Mixtral)
- Seamless workflow without switching apps

### 🎨 Code Examples

Here's a beautiful Haskell implementation of the Fibonacci sequence:

```haskell
fibonacci :: [Integer]
fibonacci = 0 : 1 : zipWith (+) fibonacci (tail fibonacci)
