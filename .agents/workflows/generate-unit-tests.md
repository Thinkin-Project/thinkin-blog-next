---
description: Unit Test Generation
---

Trigger: When the user invokes this workflow. Instructions:

Analyze all TypeScript/JavaScript files in the current active context.

For every file (e.g., `utils.ts` or `Button.svelte`), create a corresponding test file (e.g., `utils.test.ts` or `Button.test.ts`).

Use the **Vitest** framework together with **Svelte Testing Library** (for Svelte components).

Ensure every function or component has at least:

- One positive test case (expected behavior).
- One edge case (boundary condition, invalid input, or error handling).
