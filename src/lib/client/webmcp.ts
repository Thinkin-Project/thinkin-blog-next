type JsonRecord = Record<string, unknown>;

type ToolAnnotations = {
    readOnlyHint?: boolean;
    untrustedContentHint?: boolean;
};

type ModelContextClient = {
    requestUserInteraction?: <T>(callback: () => Promise<T>) => Promise<T>;
};

type ToolExecuteCallback = (input: JsonRecord, client: ModelContextClient) => Promise<unknown>;

type ModelContextTool = {
    name: string;
    title?: string;
    description: string;
    inputSchema?: JsonRecord;
    execute: ToolExecuteCallback;
    annotations?: ToolAnnotations;
};

type ModelContextRegisterToolOptions = {
    signal?: AbortSignal;
};

type ModelContext = {
    registerTool: (tool: ModelContextTool, options?: ModelContextRegisterToolOptions) => void;
};

declare global {
    interface Navigator {
        modelContext?: ModelContext;
    }
}

const READ_ONLY_ANNOTATIONS = {
    readOnlyHint: true
} as const satisfies ToolAnnotations;

const SEARCH_POSTS_SCHEMA = {
    type: 'object',
    properties: {
        query: {
            type: 'string',
            description:
                'Natural-language query used to match post titles, descriptions, and content'
        },
        topic: {
            type: 'string',
            description: 'Topic slug such as dotnet or design-pattern'
        },
        tag: {
            type: 'string',
            description: 'Tag slug such as mcp or svelte'
        },
        limit: {
            type: 'integer',
            minimum: 1,
            maximum: 20,
            default: 5,
            description: 'Maximum number of results to return'
        }
    },
    additionalProperties: false
} as const satisfies JsonRecord;

const GET_POST_SCHEMA = {
    type: 'object',
    properties: {
        slug: {
            type: 'string',
            description: 'Post slug'
        }
    },
    required: ['slug'],
    additionalProperties: false
} as const satisfies JsonRecord;

const FIND_RELATED_POSTS_SCHEMA = {
    type: 'object',
    properties: {
        slug: {
            type: 'string',
            description: 'Slug of the current post'
        },
        limit: {
            type: 'integer',
            minimum: 1,
            maximum: 10,
            default: 3,
            description: 'Maximum number of related posts to return'
        }
    },
    required: ['slug'],
    additionalProperties: false
} as const satisfies JsonRecord;

let activeRegistrationController: AbortController | null = null;

class HttpError extends Error {
    constructor(
        message: string,
        readonly status: number
    ) {
        super(message);
        this.name = 'HttpError';
    }
}

function getModelContext(): ModelContext | null {
    if (typeof navigator === 'undefined' || globalThis.isSecureContext !== true) {
        return null;
    }

    const { modelContext } = navigator;
    if (!modelContext || typeof modelContext.registerTool !== 'function') {
        return null;
    }

    return modelContext;
}

function normalizeOptionalString(value: unknown): string | undefined {
    if (typeof value !== 'string') {
        return undefined;
    }

    const normalizedValue = value.trim();
    return normalizedValue.length > 0 ? normalizedValue : undefined;
}

function normalizeRequiredString(value: unknown, fieldName: string): string {
    const normalizedValue = normalizeOptionalString(value);
    if (!normalizedValue) {
        throw new Error(`WebMCP tool requires a valid string value for ${fieldName}.`);
    }

    return normalizedValue;
}

function normalizeLimit(
    value: unknown,
    minimum: number,
    maximum: number,
    fallback: number
): number {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        return fallback;
    }

    return Math.min(maximum, Math.max(minimum, Math.trunc(value)));
}

function buildQueryString(entries: Record<string, string | number | undefined>): string {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(entries)) {
        if (value === undefined) {
            continue;
        }

        searchParams.set(key, String(value));
    }

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
}

async function getErrorMessage(response: Response): Promise<string> {
    try {
        const payload = (await response.clone().json()) as JsonRecord;
        if (typeof payload.message === 'string') {
            return payload.message;
        }
        if (typeof payload.error === 'string') {
            return payload.error;
        }
    } catch {
        // 忽略 JSON 解析失敗，改用純文字訊息
    }

    const text = (await response.text()).trim();
    return text || `WebMCP API request failed (${response.status}).`;
}

async function readJsonResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        throw new HttpError(await getErrorMessage(response), response.status);
    }

    return (await response.json()) as T;
}

async function getJson<T>(path: string): Promise<T> {
    const response = await fetch(path, {
        headers: {
            Accept: 'application/json'
        }
    });

    return readJsonResponse<T>(response);
}

async function executeSearchPosts(input: JsonRecord): Promise<unknown> {
    const query = normalizeOptionalString(input.query);
    const topic = normalizeOptionalString(input.topic);
    const tag = normalizeOptionalString(input.tag);
    const limit = normalizeLimit(input.limit, 1, 20, 5);
    const queryString = buildQueryString({
        query,
        topic,
        tag,
        limit
    });

    return getJson(`/api/webmcp/search-posts${queryString}`);
}

async function executeGetPost(input: JsonRecord): Promise<unknown> {
    const slug = normalizeRequiredString(input.slug, 'slug');
    return getJson(`/api/webmcp/posts/${encodeURIComponent(slug)}`);
}

async function executeFindRelatedPosts(input: JsonRecord): Promise<unknown> {
    const slug = normalizeRequiredString(input.slug, 'slug');
    const limit = normalizeLimit(input.limit, 1, 10, 3);
    const path = `/api/webmcp/posts/${encodeURIComponent(slug)}/related`;

    return getJson(`${path}${buildQueryString({ limit })}`);
}

const WEB_MCP_TOOLS: ModelContextTool[] = [
    {
        name: 'search_posts',
        title: 'Search Posts',
        description:
            'Search published posts using a natural language query, topic slug, or tag slug. When no filters are provided, this tool returns the most recently published posts.',
        inputSchema: SEARCH_POSTS_SCHEMA,
        annotations: READ_ONLY_ANNOTATIONS,
        execute: executeSearchPosts
    },
    {
        name: 'get_post',
        title: 'Get Post',
        description:
            'Retrieve a published post as structured data, including metadata, canonical URL, and markdown content.',
        inputSchema: GET_POST_SCHEMA,
        annotations: READ_ONLY_ANNOTATIONS,
        execute: executeGetPost
    },
    {
        name: 'find_related_posts',
        title: 'Find Related Posts',
        description:
            'Retrieve related published posts for a given post slug, prioritizing shared topics and tags.',
        inputSchema: FIND_RELATED_POSTS_SCHEMA,
        annotations: READ_ONLY_ANNOTATIONS,
        execute: executeFindRelatedPosts
    }
];

export function setupWebMcpBridge(): () => void {
    const modelContext = getModelContext();
    if (!modelContext) {
        return () => {};
    }

    activeRegistrationController?.abort();

    const registrationController = new AbortController();
    activeRegistrationController = registrationController;

    for (const tool of WEB_MCP_TOOLS) {
        modelContext.registerTool(tool, {
            signal: registrationController.signal
        });
    }

    return () => {
        registrationController.abort();

        if (activeRegistrationController === registrationController) {
            activeRegistrationController = null;
        }
    };
}
