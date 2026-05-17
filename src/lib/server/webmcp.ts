import { BLOG_CONFIG } from '$lib/constants/blog';
import { resolveTagSlug } from '$lib/constants/tags';
import { resolveTopicSlug } from '$lib/constants/topics';
import { getPosts, getRawPost } from '$lib/server/posts';
import type { ArticleMeta } from '$lib/types';

const SEARCH_DEFAULT_LIMIT = 5;
const SEARCH_MAX_LIMIT = 20;
const RELATED_DEFAULT_LIMIT = 3;
const RELATED_MAX_LIMIT = 10;
const FRONTMATTER_PATTERN = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/;

export interface SearchPostsInput {
    query?: string;
    topic?: string;
    tag?: string;
    limit?: number;
}

export interface FindRelatedPostsInput {
    slug: string;
    limit?: number;
}

export interface WebMcpPostSummary {
    slug: string;
    title: string;
    description: string;
    topic: string;
    tags: string[];
    date: string;
    url: string;
}

export interface WebMcpPostPayload {
    metadata: ArticleMeta;
    content: string;
    url: string;
}

export interface SearchPostsResult {
    mode: 'search' | 'recent';
    total: number;
    results: WebMcpPostSummary[];
}

export interface RelatedPostResult extends WebMcpPostSummary {
    reason: string;
}

export interface FindRelatedPostsResult {
    source: WebMcpPostSummary;
    total: number;
    results: RelatedPostResult[];
}

interface RankedPost {
    post: ArticleMeta;
    score: number;
}

interface RankedRelatedPost extends RankedPost {
    reason: string;
}

export function clampLimit(
    value: number | undefined,
    defaultValue: number,
    maxValue: number
): number {
    if (typeof value !== 'number' || !Number.isInteger(value)) {
        return defaultValue;
    }

    return Math.min(Math.max(value, 1), maxValue);
}

export function getPostUrl(slug: string): string {
    return `${BLOG_CONFIG.url}/posts/${encodeURIComponent(slug)}`;
}

export function stripFrontmatter(markdown: string): string {
    return markdown.replace(FRONTMATTER_PATTERN, '').trim();
}

export function createPostSummary(post: ArticleMeta): WebMcpPostSummary {
    return {
        slug: post.slug,
        title: post.title,
        description: post.description,
        topic: post.topic,
        tags: post.tags,
        date: post.date,
        url: getPostUrl(post.slug)
    };
}

export function matchesTaxonomy(post: ArticleMeta, topic?: string, tag?: string): boolean {
    const resolvedTopic = topic ? resolveTopicSlug(topic) : undefined;
    const resolvedTag = tag ? resolveTagSlug(tag) : undefined;

    if (topic && !resolvedTopic) {
        return false;
    }

    if (tag && !resolvedTag) {
        return false;
    }

    if (resolvedTopic && post.topic !== resolvedTopic) {
        return false;
    }

    if (resolvedTag && !post.tags.includes(resolvedTag)) {
        return false;
    }

    return true;
}

export async function scoreSearchPost(
    post: ArticleMeta,
    normalizedQuery: string | undefined
): Promise<number> {
    if (!normalizedQuery) {
        return 0;
    }

    const title = post.title.toLowerCase();
    const description = post.description.toLowerCase();
    const topic = post.topic.toLowerCase();
    const tags = post.tags.join(' ').toLowerCase();

    let score = 0;

    if (title.includes(normalizedQuery)) {
        score += 5;
    }
    if (description.includes(normalizedQuery)) {
        score += 3;
    }
    if (topic.includes(normalizedQuery)) {
        score += 2;
    }
    if (tags.includes(normalizedQuery)) {
        score += 2;
    }

    if (score > 0) {
        return score;
    }

    const rawPost = await getRawPost(post.slug);
    if (!rawPost) {
        return 0;
    }

    return stripFrontmatter(rawPost).toLowerCase().includes(normalizedQuery) ? 1 : 0;
}

export function compareByScoreAndDate<T extends RankedPost>(first: T, second: T): number {
    if (second.score !== first.score) {
        return second.score - first.score;
    }

    return new Date(second.post.date).getTime() - new Date(first.post.date).getTime();
}

export async function searchPosts(input: SearchPostsInput): Promise<SearchPostsResult> {
    const posts = await getPosts();
    const query = input.query?.trim();
    const topic = input.topic?.trim();
    const tag = input.tag?.trim();
    const limit = clampLimit(input.limit, SEARCH_DEFAULT_LIMIT, SEARCH_MAX_LIMIT);

    if (!query && !topic && !tag) {
        const results = posts.slice(0, limit).map(createPostSummary);

        return {
            mode: 'recent',
            total: posts.length,
            results
        };
    }

    const normalizedQuery = query?.toLowerCase();
    const candidates = posts.filter((post) => matchesTaxonomy(post, topic, tag));

    if (!normalizedQuery) {
        const results = candidates.slice(0, limit).map(createPostSummary);

        return {
            mode: 'search',
            total: candidates.length,
            results
        };
    }

    const rankedPosts = await Promise.all(
        candidates.map(async (post) => ({
            post,
            score: await scoreSearchPost(post, normalizedQuery)
        }))
    );

    const matchedPosts = rankedPosts
        .filter((entry) => entry.score > 0)
        .sort(compareByScoreAndDate)
        .map((entry) => entry.post);

    return {
        mode: 'search',
        total: matchedPosts.length,
        results: matchedPosts.slice(0, limit).map(createPostSummary)
    };
}

export async function getPost(slug: string): Promise<WebMcpPostPayload | null> {
    const post = (await getPosts()).find((entry) => entry.slug === slug);
    if (!post) {
        return null;
    }

    const rawPost = await getRawPost(slug);
    if (!rawPost) {
        return null;
    }

    return {
        metadata: post,
        content: stripFrontmatter(rawPost),
        url: getPostUrl(slug)
    };
}

export function describeRelatedReason(source: ArticleMeta, candidate: ArticleMeta): string {
    const sharedTags = candidate.tags.filter((tag) => source.tags.includes(tag));

    if (candidate.topic === source.topic && sharedTags.length > 0) {
        return `Same topic and shared tags: ${sharedTags.join(', ')}`;
    }

    if (candidate.topic === source.topic) {
        return 'Related post from the same topic';
    }

    if (sharedTags.length > 0) {
        return `Shared tags: ${sharedTags.join(', ')}`;
    }

    return 'Recently published related post';
}

export function scoreRelatedPost(source: ArticleMeta, candidate: ArticleMeta): RankedRelatedPost {
    const sharedTags = candidate.tags.filter((tag) => source.tags.includes(tag));
    const sameTopicScore = candidate.topic === source.topic ? 100 : 0;
    const sharedTagScore = sharedTags.length * 10;
    const score = sameTopicScore + sharedTagScore;

    return {
        post: candidate,
        score,
        reason: describeRelatedReason(source, candidate)
    };
}

export async function findRelatedPosts(
    input: FindRelatedPostsInput
): Promise<FindRelatedPostsResult | null> {
    const posts = await getPosts();
    const sourcePost = posts.find((post) => post.slug === input.slug);
    if (!sourcePost) {
        return null;
    }

    const limit = clampLimit(input.limit, RELATED_DEFAULT_LIMIT, RELATED_MAX_LIMIT);
    const rankedPosts = posts
        .filter((post) => post.slug !== sourcePost.slug)
        .map((post) => scoreRelatedPost(sourcePost, post))
        .sort(compareByScoreAndDate);

    const results = rankedPosts.slice(0, limit).map((entry) => ({
        ...createPostSummary(entry.post),
        reason: entry.reason
    }));

    return {
        source: createPostSummary(sourcePost),
        total: rankedPosts.length,
        results
    };
}
