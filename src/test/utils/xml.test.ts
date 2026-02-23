import { describe, expect, it } from 'vitest';

import { buildAbsoluteUrl, escapeXml } from '../../lib/utils/xml';

describe('xml utils', () => {
    it('escapes xml special characters', () => {
        expect(escapeXml(`&<>'"`)).toBe('&amp;&lt;&gt;&apos;&quot;');
    });

    it('handles non-string values in escapeXml', () => {
        expect(escapeXml(123 as unknown as string)).toBe('123');
    });

    it('builds absolute url with valid base', () => {
        expect(buildAbsoluteUrl('/posts/a', 'https://example.com')).toBe(
            'https://example.com/posts/a'
        );
        expect(buildAbsoluteUrl('posts/a', 'https://example.com/base/')).toBe(
            'https://example.com/base/posts/a'
        );
    });

    it('falls back to string concatenation when base is invalid', () => {
        expect(buildAbsoluteUrl('/posts/a', 'invalid-base')).toBe('invalid-base/posts/a');
        expect(buildAbsoluteUrl('posts/a', 'invalid-base/')).toBe('invalid-base/posts/a');
    });
});
