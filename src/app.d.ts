declare module '*.md' {
    const component: import('svelte').Component;
    export default component;
    export const metadata: Record<string, unknown>;
}

declare global {
    namespace App {
        // interface Error {}
        // interface Locals {}
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }
}
