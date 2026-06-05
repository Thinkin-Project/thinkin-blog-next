import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig({
    plugins: [tailwindcss(), sveltekit()],
    resolve: {
        alias: {
            '$app/environment': path.resolve('src/test/mocks/app-environment.ts')
        }
    },
    test: {
        globals: true,
        passWithNoTests: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            exclude: [
                ...configDefaults.coverage.exclude,
                'src/posts/**',
                '**/*.{png,jpg,jpeg,gif,webp,svg,ico}'
            ]
        },
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
                    name: 'browser',
                    include: ['src/**/*.dom.test.ts', 'src/**/*.browser.test.ts'],
                    environment: 'happy-dom',
                    setupFiles: ['src/test/setup.ts'],
                    clearMocks: true,
                    restoreMocks: true
                }
            }
        ]
    }
});
