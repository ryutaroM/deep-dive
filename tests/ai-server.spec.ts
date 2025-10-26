import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, OPTIONS } from '../src/routes/ai/+server';

interface ErrorResponse {
    error: string;
    details?: unknown;
    message?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.fetch = vi.fn() as any;

describe('/ai +server.ts', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('POST', () => {
        it('should return 400 when apiKey is missing', async () => {
            const request = new Request('http://localhost/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'llama-3.1-8b-instant',
                    messages: [{ role: 'user', content: 'test' }]
                })
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await POST({ request } as any);
            const data = (await response.json()) as ErrorResponse;

            expect(response.status).toBe(400);
            expect(data.error).toBe('API key is required');
        });

        it('should return 400 when model is missing', async () => {
            const request = new Request('http://localhost/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey: 'test-key',
                    messages: [{ role: 'user', content: 'test' }]
                })
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await POST({ request } as any);
            const data = (await response.json()) as ErrorResponse;

            expect(response.status).toBe(400);
            expect(data.error).toBe('Invalid request format');
        });

        it('should return 400 when messages is missing', async () => {
            const request = new Request('http://localhost/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey: 'test-key',
                    model: 'llama-3.1-8b-instant'
                })
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await POST({ request } as any);
            const data = (await response.json()) as ErrorResponse;

            expect(response.status).toBe(400);
            expect(data.error).toBe('Invalid request format');
        });

        it('should call Groq API with correct parameters', async () => {
            const mockAIResponse = {
                choices: [
                    {
                        message: { content: 'AI response' },
                        index: 0,
                        finish_reason: 'stop'
                    }
                ],
                id: 'test-id',
                model: 'llama-3.1-8b-instant',
                created: 1234567890
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => mockAIResponse
            });

            const request = new Request('http://localhost/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey: 'test-api-key',
                    model: 'llama-3.1-8b-instant',
                    messages: [{ role: 'user', content: 'Hello' }],
                    max_tokens: 1000,
                    temperature: 0.7
                })
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await POST({ request } as any);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual(mockAIResponse);
            expect(global.fetch).toHaveBeenCalledWith(
                'https://api.groq.com/openai/v1/chat/completions',
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer test-api-key'
                    })
                })
            );
        });

        it('should return error when Groq API fails', async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (global.fetch as any).mockResolvedValueOnce({
                ok: false,
                status: 401,
                json: async () => ({ error: 'Invalid API key' })
            });

            const request = new Request('http://localhost/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey: 'invalid-key',
                    model: 'llama-3.1-8b-instant',
                    messages: [{ role: 'user', content: 'test' }],
                    max_tokens: 1000,
                    temperature: 0.7
                })
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await POST({ request } as any);
            const data = (await response.json()) as ErrorResponse;

            expect(response.status).toBe(401);
            expect(data.error).toBe('AI API call failed');
        });

        it('should use correct baseUrl from rulebook for different models', async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    choices: [{ message: { content: 'test' }, index: 0, finish_reason: 'stop' }],
                    id: 'test',
                    model: 'llama-3.1-70b-versatile',
                    created: 123
                })
            });

            const request = new Request('http://localhost/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey: 'test-key',
                    model: 'llama-3.1-70b-versatile',
                    messages: [{ role: 'user', content: 'test' }],
                    max_tokens: 1000,
                    temperature: 0.7
                })
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await POST({ request } as any);

            // rulebook設定に基づいてbaseUrlが選択されることを確認
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('https://api.groq.com'),
                expect.any(Object)
            );
        });
    });

    describe('OPTIONS', () => {
        it('should return 204 with CORS headers', async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await OPTIONS({} as any);

            expect(response.status).toBe(204);
            expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
            expect(response.headers.get('Access-Control-Allow-Methods')).toBe('POST, OPTIONS');
            expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type');
        });
    });
});
