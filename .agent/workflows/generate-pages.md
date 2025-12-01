---
description: Page Generation
---

Trigger: When the user specifies a target Markdown file (e.g., Contact.md). Instructions:

Locate the specified Markdown file in the `spec/pages` directory.

If a matching PNG prototype exists in `spec/prototype` (e.g., Contact.png), use it as a design reference:

- Apply layout hints (e.g., sections, spacing, visual hierarchy).
- Map visual elements to semantic HTML/JSX structure.

Generate a React page component (e.g., Contact.tsx) in the `src/pages` directory.

Use the Markdown content to populate the page structure, including headings, paragraphs, and links.

Ensure the generated page:

- Uses a functional component.
- Is wrapped in a layout component (e.g., `<PageLayout>`).
- Has placeholder components for dynamic content (e.g., `<ContactForm />`).

Optional:

- Extract frontmatter (e.g., `title`, `description`) for metadata.
- Suggest route integration if navigation elements are detected.

Output: One `.tsx` file corresponding to the specified Markdown file.
