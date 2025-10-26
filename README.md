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

## 🚀 Development

### Prerequisites
- Node.js 18+ and npm

### Installation
```bash
npm install
```

### Running the Development Server
```bash
npm run dev
```
Visit `http://localhost:5173` to see your application.

Note: AI chat functionality requires you to enter your Groq API key in the browser. Get your API key from: https://console.groq.com/keys

### Testing

#### Run All Tests
```bash
npm test              # Run unit tests and E2E tests
npm run test:all      # Same as above
```

#### Unit Tests (Vitest)
```bash
npm run test:unit           # Run unit tests once
npm run test:unit:watch     # Run in watch mode
npm run test:unit:ui        # Run with UI
npm run test:coverage       # Run with coverage report
```

Coverage reports are generated in `./coverage/vitest/` directory.

#### E2E Tests (Playwright)
```bash
npm run test:e2e            # Run E2E tests headless
npm run test:e2e:ui         # Run with Playwright UI
npm run test:e2e:headed     # Run with browser visible
npm run test:e2e:debug      # Run in debug mode
```