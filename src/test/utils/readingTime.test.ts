import { describe, expect, it } from 'vitest';

import { calculateReadingTime } from '../../lib/utils/readingTime';

describe('calculateReadingTime', () => {
    it('returns at least 1 for empty content', () => {
        expect(calculateReadingTime('')).toBe(1);
    });

    it('calculates chinese content by character count', () => {
        const chinese300 = '中'.repeat(300);
        expect(calculateReadingTime(chinese300)).toBe(1);

        const chinese301 = '中'.repeat(301);
        expect(calculateReadingTime(chinese301)).toBe(2);
    });

    it('calculates english content by word count', () => {
        const english200 = Array.from({ length: 200 }, (_, i) => `w${i}`).join(' ');
        expect(calculateReadingTime(english200)).toBe(1);

        const english201 = `${english200} extra`;
        expect(calculateReadingTime(english201)).toBe(2);
    });

    it('calculates mixed chinese and english content', () => {
        const mixed = `${'中'.repeat(150)} ${Array.from({ length: 100 }, (_, i) => `w${i}`).join(' ')}`;
        expect(calculateReadingTime(mixed)).toBe(1);

        const mixedLong = `${'中'.repeat(300)} ${Array.from({ length: 200 }, (_, i) => `w${i}`).join(' ')}`;
        expect(calculateReadingTime(mixedLong)).toBe(2);
    });

    it('ignores html tags in counting', () => {
        const withHtml = '<p>Hello world</p><strong>測試</strong>';
        expect(calculateReadingTime(withHtml)).toBe(1);
    });
});
