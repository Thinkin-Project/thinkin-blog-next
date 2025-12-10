---
description: Page Generation
---

Trigger: When the user specifies a target Markdown file (e.g., Contact.md). Instructions:

Locate the specified Markdown file in the `spec/pages` directory.

If a matching PNG prototype exists in `spec/prototype` (e.g., Contact.png), use it as a design reference:

- Apply layout hints (e.g., sections, spacing, visual hierarchy).
- Map visual elements to semantic HTML/Svelte template structure.

Generate a Svelte page component (e.g., `+page.svelte`) in the appropriate `src/routes` directory (e.g. `src/routes/contact/`).

Use the Markdown content to populate the page structure, including headings, paragraphs, and links.

Ensure the generated page:

- Is a valid Svelte component.
- Is wrapped in a layout component (e.g., `<PageLayout>`) if required.
- Has placeholder components for dynamic content (e.g., `<ContactForm />`).

Optional:

- Extract frontmatter (e.g., `title`, `description`) for metadata in `+page.server.ts` or `+page.ts`.
- Suggest route integration if navigation elements are detected.

Output: One `.svelte` file corresponding to the specified Markdown file (as a route).
