import { beforeEach, describe, expect, it, vi } from 'vitest';

async function loadAuthors() {
    vi.resetModules();
    vi.doMock('$posts/_metadata/authors.json', () => ({
        default: {
            neil: {
                id: 'neil',
                name: 'Neil',
                avatar: '/avatar.jpg',
                bio: 'Author bio'
            }
        }
    }));

    return import('../../lib/constants/authors');
}

describe('AUTHORS constant', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it('exports a non-empty author dictionary', async () => {
        const { AUTHORS } = await loadAuthors();
        const keys = Object.keys(AUTHORS);
        expect(keys.length).toBeGreaterThan(0);
    });

    it('every author has id and name fields', async () => {
        const { AUTHORS } = await loadAuthors();
        for (const key of Object.keys(AUTHORS)) {
            expect(AUTHORS[key].id).toBeTypeOf('string');
            expect(AUTHORS[key].name).toBeTypeOf('string');
        }
    });
});
