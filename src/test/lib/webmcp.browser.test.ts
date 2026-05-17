import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { setupWebMcpBridge } from '../../lib/client/webmcp';

type RegisteredTool = {
    name: string;
    inputSchema?: Record<string, unknown>;
    annotations?: {
        readOnlyHint?: boolean;
    };
    execute: (input: Record<string, unknown>) => Promise<unknown>;
};

describe('setupWebMcpBridge', () => {
    const originalNavigator = globalThis.navigator;
    const originalSecureContext = globalThis.isSecureContext;
    const originalFetch = globalThis.fetch;

    beforeEach(() => {
        vi.restoreAllMocks();

        Object.defineProperty(globalThis, 'isSecureContext', {
            configurable: true,
            value: true
        });
    });

    afterEach(() => {
        Object.defineProperty(globalThis, 'navigator', {
            configurable: true,
            value: originalNavigator
        });
        Object.defineProperty(globalThis, 'isSecureContext', {
            configurable: true,
            value: originalSecureContext
        });
        Object.defineProperty(globalThis, 'fetch', {
            configurable: true,
            value: originalFetch
        });
    });

    it('skips registration when WebMCP is unavailable', () => {
        Object.defineProperty(globalThis, 'isSecureContext', {
            configurable: true,
            value: false
        });

        const cleanup = setupWebMcpBridge();
        expect(cleanup).toBeTypeOf('function');
    });

    it('registers three read-only tools and aborts them during cleanup', () => {
        const registerTool = vi.fn();
        Object.defineProperty(globalThis, 'navigator', {
            configurable: true,
            value: {
                modelContext: {
                    registerTool
                }
            }
        });

        const cleanup = setupWebMcpBridge();

        expect(registerTool).toHaveBeenCalledTimes(3);

        const registeredTools = registerTool.mock.calls.map(([tool]) => tool as RegisteredTool);
        expect(registeredTools.map((tool) => tool.name)).toEqual([
            'search_posts',
            'get_post',
            'find_related_posts'
        ]);
        expect(registeredTools.every((tool) => tool.annotations?.readOnlyHint === true)).toBe(true);

        const signal = registerTool.mock.calls[0]?.[1]?.signal as AbortSignal;
        expect(signal.aborted).toBe(false);

        cleanup();

        expect(signal.aborted).toBe(true);
    });

    it('skips registration when modelContext is missing or invalid', () => {
        Object.defineProperty(globalThis, 'navigator', {
            configurable: true,
            value: {
                modelContext: {}
            }
        });

        const cleanup = setupWebMcpBridge();
        expect(cleanup).toBeTypeOf('function');
    });

    it('aborts the previous registration when setup is called again', () => {
        const registerTool = vi.fn();
        Object.defineProperty(globalThis, 'navigator', {
            configurable: true,
            value: {
                modelContext: {
                    registerTool
                }
            }
        });

        const firstCleanup = setupWebMcpBridge();
        const firstSignal = registerTool.mock.calls[0]?.[1]?.signal as AbortSignal;

        setupWebMcpBridge();

        expect(firstSignal.aborted).toBe(true);

        firstCleanup();
    });

    it('calls the dedicated WebMCP routes with normalized query strings', async () => {
        const registerTool = vi.fn();
        Object.defineProperty(globalThis, 'navigator', {
            configurable: true,
            value: {
                modelContext: {
                    registerTool
                }
            }
        });

        const fetchMock = vi.fn(
            async () =>
                new Response(JSON.stringify({ ok: true }), {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
        );
        Object.defineProperty(globalThis, 'fetch', {
            configurable: true,
            value: fetchMock
        });

        setupWebMcpBridge();

        const tools = new Map(
            registerTool.mock.calls.map(([tool]) => [tool.name, tool as RegisteredTool])
        );

        await tools.get('search_posts')?.execute({
            query: '  svelte  ',
            topic: 'web',
            tag: 'mcp',
            limit: 99
        });
        await tools.get('get_post')?.execute({
            slug: 'post-slug'
        });
        await tools.get('find_related_posts')?.execute({
            slug: 'post-slug',
            limit: 99
        });

        expect(fetchMock).toHaveBeenNthCalledWith(
            1,
            '/api/webmcp/search-posts?query=svelte&topic=web&tag=mcp&limit=20',
            expect.objectContaining({
                headers: expect.objectContaining({
                    Accept: 'application/json'
                })
            })
        );
        expect(fetchMock).toHaveBeenNthCalledWith(
            2,
            '/api/webmcp/posts/post-slug',
            expect.objectContaining({
                headers: expect.objectContaining({
                    Accept: 'application/json'
                })
            })
        );
        expect(fetchMock).toHaveBeenNthCalledWith(
            3,
            '/api/webmcp/posts/post-slug/related?limit=10',
            expect.objectContaining({
                headers: expect.objectContaining({
                    Accept: 'application/json'
                })
            })
        );
    });

    it('omits empty filters and falls back to default limits in query strings', async () => {
        const registerTool = vi.fn();
        Object.defineProperty(globalThis, 'navigator', {
            configurable: true,
            value: {
                modelContext: {
                    registerTool
                }
            }
        });

        const fetchMock = vi.fn(
            async () =>
                new Response(JSON.stringify({ ok: true }), {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
        );
        Object.defineProperty(globalThis, 'fetch', {
            configurable: true,
            value: fetchMock
        });

        setupWebMcpBridge();

        const tools = new Map(
            registerTool.mock.calls.map(([tool]) => [tool.name, tool as RegisteredTool])
        );

        await tools.get('search_posts')?.execute({
            query: '   ',
            topic: 123,
            limit: 'bad-limit'
        });
        await tools.get('find_related_posts')?.execute({
            slug: 'post-slug',
            limit: 'bad-limit'
        });

        expect(fetchMock).toHaveBeenNthCalledWith(
            1,
            '/api/webmcp/search-posts?limit=5',
            expect.any(Object)
        );
        expect(fetchMock).toHaveBeenNthCalledWith(
            2,
            '/api/webmcp/posts/post-slug/related?limit=3',
            expect.any(Object)
        );
    });

    it('throws a readable error when required slug inputs are missing', async () => {
        const registerTool = vi.fn();
        Object.defineProperty(globalThis, 'navigator', {
            configurable: true,
            value: {
                modelContext: {
                    registerTool
                }
            }
        });

        setupWebMcpBridge();

        const tools = new Map(
            registerTool.mock.calls.map(([tool]) => [tool.name, tool as RegisteredTool])
        );

        await expect(tools.get('get_post')?.execute({})).rejects.toThrow(
            'WebMCP tool requires a valid string value for slug.'
        );
        await expect(tools.get('find_related_posts')?.execute({ slug: '   ' })).rejects.toThrow(
            'WebMCP tool requires a valid string value for slug.'
        );
    });

    it('surfaces API error messages from JSON and text responses', async () => {
        const registerTool = vi.fn();
        Object.defineProperty(globalThis, 'navigator', {
            configurable: true,
            value: {
                modelContext: {
                    registerTool
                }
            }
        });

        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce(
                new Response(JSON.stringify({ message: 'Post not found' }), {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            )
            .mockResolvedValueOnce(
                new Response(JSON.stringify({ error: 'Related posts unavailable' }), {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            )
            .mockResolvedValueOnce(
                new Response('Temporary outage', {
                    status: 503,
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                })
            )
            .mockResolvedValueOnce(
                new Response('', {
                    status: 502,
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                })
            );
        Object.defineProperty(globalThis, 'fetch', {
            configurable: true,
            value: fetchMock
        });

        setupWebMcpBridge();

        const tools = new Map(
            registerTool.mock.calls.map(([tool]) => [tool.name, tool as RegisteredTool])
        );

        await expect(
            tools.get('get_post')?.execute({ slug: 'missing-post' })
        ).rejects.toMatchObject({
            message: 'Post not found',
            status: 404
        });
        await expect(
            tools.get('find_related_posts')?.execute({ slug: 'missing-post' })
        ).rejects.toMatchObject({
            message: 'Related posts unavailable',
            status: 500
        });
        await expect(tools.get('search_posts')?.execute({ query: 'webmcp' })).rejects.toMatchObject(
            {
                message: 'Temporary outage',
                status: 503
            }
        );
        await expect(tools.get('search_posts')?.execute({ query: 'webmcp' })).rejects.toMatchObject(
            {
                message: 'WebMCP API request failed (502).',
                status: 502
            }
        );
    });
});
