import { describe, expect, it } from 'vitest';

import { cn } from '../../lib/utils';

describe('cn utility', () => {
    it('merges class names and keeps tailwind last-wins behavior', () => {
        const conditional = false;
        const result = cn('p-2 text-sm', conditional && 'hidden', 'p-4', ['font-bold', undefined]);

        expect(result).toContain('p-4');
        expect(result).not.toContain('p-2');
        expect(result).toContain('text-sm');
        expect(result).toContain('font-bold');
    });
});
