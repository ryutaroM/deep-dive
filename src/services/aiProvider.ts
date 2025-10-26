
import type {
    RuleBook,
    AIProvider
} from '../types/rulebook';

interface AIResponse {
    choices: Array<{
        message: {
            content: string;
        };
        index: number;
        finish_reason: string;
    }>;
    id: string;
    model: string;
    created: number;
}

export class AIProviderService {
    private ruleBook: RuleBook;
    private apiKey: string;
    private provider: AIProvider;

    constructor(ruleBook: RuleBook, apiKey: string) {
        this.ruleBook = ruleBook;
        this.apiKey = apiKey;
        this.provider = this.getProvider();
    }

    private getProvider(): AIProvider {
        const providerName = this.ruleBook.ai.defaultProvider;
        const provider = this.ruleBook.ai.providers[providerName];
        if (!provider) {
            throw new Error(`AI Provider "${providerName}" not found in rulebook.`);
        }
        return provider;
    }

    setApiKey(apiKey: string) {
        this.apiKey = apiKey;
    }

    getApiKey(): string {
        return this.apiKey;
    }

    getAvailableProviders(): Record<string, AIProvider> {
        return this.ruleBook.ai.providers;
    }

    getProviderDetails(): AIProvider {
        return this.provider;
    }

    getRuleBook(): RuleBook {
        return this.ruleBook;
    }

    private generatePrompt(userInput: string): string {
        const systemPrompt = this.ruleBook.prompts.systemPrompt;

        return `${systemPrompt}\n\nUser Input: ${userInput}`;
    }

    private async callAIModel(userInput: string): Promise<string> {
        if (!this.apiKey) {
            throw new Error('API key is not set.');
        }

        const response = await fetch('/ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                apiKey: this.apiKey,
                model: this.provider.model,
                messages: [
                    { role: 'system', content: this.ruleBook.prompts.systemPrompt },
                    { role: 'user', content: userInput }
                ],
                max_tokens: this.provider.maxTokens,
                temperature: this.provider.temperature
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`AI Model call failed: ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json() as AIResponse;

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid response format from AI API');
        }

        return data.choices[0].message.content;
    }

    async generateResponse(userInput: string): Promise<string> {
        return await this.callAIModel(userInput);
    }
}
