import { goto } from '$app/navigation';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { setupWebMcpBridge } from '../../lib/client/webmcp';

type RegisteredTool = {
    name: string;
    inputSchema?: Record<string, unknown>;
    annotations?: {
        readOnlyHint?: boolean;
    };
    execute: (
        input: Record<string, unknown>,
        client?: {
            requestUserInteraction?: <T>(callback: () => Promise<T>) => Promise<T>;
        }
    ) => Promise<unknown>;
};

describe('setupWebMcpBridge', () => {
    const originalNavigator = globalThis.navigator;
    const originalSecureContext = globalThis.isSecureContext;
    const originalFetch = globalThis.fetch;
    let assignLocationMock: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        vi.restoreAllMocks();

        Object.defineProperty(globalThis, 'isSecureContext', {
            configurable: true,
            value: true
        });

        assignLocationMock = vi.spyOn(window.location, 'assign').mockImplementation(() => {});
        vi.mocked(goto).mockReset();
        vi.mocked(goto).mockResolvedValue(undefined);
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

    it('registers the WebMCP tools and aborts them during cleanup', () => {
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

        expect(registerTool).toHaveBeenCalledTimes(4);

        const registeredTools = registerTool.mock.calls.map(([tool]) => tool as RegisteredTool);
        expect(registeredTools.map((tool) => tool.name)).toEqual([
            'search_posts',
            'get_post',
            'find_related_posts',
            'navigate_post'
        ]);
        expect(
            registeredTools.slice(0, 3).every((tool) => tool.annotations?.readOnlyHint === true)
        ).toBe(true);
        expect(registeredTools[3]?.annotations?.readOnlyHint).toBeUndefined();

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
        const navigateResult = await tools.get('navigate_post')?.execute({
            slug: 'post-slug'
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
        expect(fetchMock).toHaveBeenNthCalledWith(
            4,
            '/api/webmcp/posts/post-slug',
            expect.objectContaining({
                headers: expect.objectContaining({
                    Accept: 'application/json'
                })
            })
        );
        expect(goto).toHaveBeenCalledWith('/posts/post-slug');
        expect(assignLocationMock).not.toHaveBeenCalled();
        expect(navigateResult).toEqual({
            success: true,
            slug: 'post-slug',
            url: '/posts/post-slug'
        });
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
        await expect(tools.get('navigate_post')?.execute({ slug: '   ' })).rejects.toThrow(
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

    it('only navigates after the target post is verified to exist', async () => {
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
                new Response(JSON.stringify({ slug: 'verified-post' }), {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            )
            .mockResolvedValueOnce(
                new Response(JSON.stringify({ message: 'Post not found' }), {
                    status: 404,
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

        await expect(
            tools.get('navigate_post')?.execute({
                slug: 'verified-post'
            })
        ).resolves.toEqual({
            success: true,
            slug: 'verified-post',
            url: '/posts/verified-post'
        });

        await expect(
            tools.get('navigate_post')?.execute({
                slug: 'missing-post'
            })
        ).rejects.toMatchObject({
            message: 'Post not found',
            status: 404
        });

        expect(goto).toHaveBeenCalledTimes(1);
        expect(goto).toHaveBeenCalledWith('/posts/verified-post');
        expect(assignLocationMock).not.toHaveBeenCalled();
    });

    it('uses requestUserInteraction when available for navigation side effects', async () => {
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
                new Response(JSON.stringify({ slug: 'interactive-post' }), {
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
        const requestUserInteractionCalls = vi.fn();
        const requestUserInteraction = async <T>(callback: () => Promise<T>): Promise<T> => {
            requestUserInteractionCalls();
            return callback();
        };

        await expect(
            tools.get('navigate_post')?.execute(
                {
                    slug: 'interactive-post'
                },
                { requestUserInteraction }
            )
        ).resolves.toEqual({
            success: true,
            slug: 'interactive-post',
            url: '/posts/interactive-post'
        });

        expect(requestUserInteractionCalls).toHaveBeenCalledTimes(1);
        expect(goto).toHaveBeenCalledWith('/posts/interactive-post');
        expect(assignLocationMock).not.toHaveBeenCalled();
    });

    it('falls back to window.location.assign when goto is unavailable', async () => {
        const registerTool = vi.fn();
        Object.defineProperty(globalThis, 'navigator', {
            configurable: true,
            value: {
                modelContext: {
                    registerTool
                }
            }
        });

        vi.mocked(goto).mockRejectedValueOnce(new Error('goto unavailable'));

        const fetchMock = vi.fn(
            async () =>
                new Response(JSON.stringify({ slug: 'fallback-post' }), {
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

        await expect(
            tools.get('navigate_post')?.execute({
                slug: 'fallback-post'
            })
        ).resolves.toEqual({
            success: true,
            slug: 'fallback-post',
            url: '/posts/fallback-post'
        });

        expect(goto).toHaveBeenCalledWith('/posts/fallback-post');
        expect(assignLocationMock).toHaveBeenCalledWith('/posts/fallback-post');
    });
});
