import type { RequestHandler } from './$types';

interface AIRequest {
    apiKey: string;
    model: string;
    messages: Array<{
        role: 'system' | 'user' | 'assistant';
        content: string;
    }>;
    max_tokens: number;
    temperature: number;
}

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

export const POST: RequestHandler = async ({ request }) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    try {
        const requestData = (await request.json()) as AIRequest;

        if (!requestData.apiKey || typeof requestData.apiKey !== 'string') {
            return new Response(JSON.stringify({ error: 'API key is required' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        if (!requestData.model || !requestData.messages || !Array.isArray(requestData.messages)) {
            return new Response(JSON.stringify({ error: 'Invalid request format' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${requestData.apiKey}`,
            },
            body: JSON.stringify({
                model: requestData.model,
                messages: requestData.messages,
                max_tokens: requestData.max_tokens,
                temperature: requestData.temperature,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return new Response(JSON.stringify({ error: 'AI API call failed', details: errorData }), {
                status: response.status,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const data = (await response.json()) as AIResponse;
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
            }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
        );
    }
};

export const OPTIONS: RequestHandler = async () => {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
};
