import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [sveltekit()],
    test: {
        projects: [
            {
                test: {
                    name: 'node',
                    include: ['src/**/*.{test,spec}.{ts,js}'],
                    exclude: ['src/**/*.dom.test.ts', 'src/**/*.browser.test.ts'],
                    environment: 'node',
                    setupFiles: ['src/test/setup.ts'],
                    clearMocks: true,
                    restoreMocks: true
                }
            },
            {
                test: {
                    name: 'jsdom',
                    include: ['src/**/*.dom.test.ts', 'src/**/*.browser.test.ts'],
                    environment: 'jsdom',
                    setupFiles: ['src/test/setup.ts'],
                    clearMocks: true,
                    restoreMocks: true
                }
            }
        ]
    }
});
