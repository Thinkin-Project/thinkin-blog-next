import { describe, expect, it } from 'vitest';

import { GET } from '../../routes/post/[...rest]/+server';

type PostRestGetInput = Parameters<typeof GET>[0];

describe('legacy post redirect GET', () => {
    it('redirects to /posts/{last-segment} with 301', () => {
        expect(() =>
            GET({ params: { rest: '2020/12/14/design-pattern-builder' } } as PostRestGetInput)
        ).toThrow(
            expect.objectContaining({
                status: 301,
                location: '/posts/design-pattern-builder'
            })
        );
    });
});
