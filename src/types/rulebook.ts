export interface AIProvider {
    name: string;
    model: string;
    maxTokens: number;
    temperature: number;
    baseUrl: string;
    free: boolean;
    description: string;
}

export interface RuleBook {
    ai: {
        providers: Record<string, AIProvider>;
        defaultProvider: string;
    };
    prompts: {
        systemPrompt: string;
        userInput: string;
    }
}