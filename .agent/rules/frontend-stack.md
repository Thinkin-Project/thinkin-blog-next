---
trigger: always_on
---

# Styling & UI

- Use **Tailwind CSS** for styling.
- Use **Shadcn Svelte** for components.
- Keep UI simple, clean, responsive.
- Microcopy must be written in **Traditional Chinese**.

# Data Fetching & Forms

- Use **SvelteKit load functions** for server-side data fetching.
- Use **Superforms** for form handling.
- Use **Zod** for validation and schema safety.

# State Management & Logic

- Use **Svelte Stores** or **Runes** for shared state.
- Avoid unnecessary global stores.

# Tailwind Rules

- Use utility classes; avoid custom CSS unless needed.
- Keep class order consistent across components for easier scanning.
- Prefer utility-first styling with Tailwind CSS; avoid large custom CSS files.
- Keep components responsive by default (mobile-first).

# Shadcn Rules

- Use official components and full imports, including proper variants.
- Prefer composition and props over editing generated UI code directly.
- Use design tokens or theme variables instead of hard-coded colors.
- Keep Shadcn components styled with Tailwind utilities; avoid custom CSS unless necessary.
