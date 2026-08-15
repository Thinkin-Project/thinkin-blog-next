# Design System: Thinkin Markdown

## 1. Visual Theme & Atmosphere

A restrained, editorial developer-blog interface: **Daily App Balanced** density (5/10), **Offset Asymmetric** variance (5/10), **Fluid CSS** motion (5/10). The atmosphere is a quiet engineering notebook — near-monochrome Zinc neutrals, a single confident blue accent, and generous whitespace that lets long-form Markdown content breathe. Left-aligned, never centered. Structure comes from borders and dividers rather than boxy cards piled on shadows. Motion is understated and purposeful: staggered fade-ins on page load, a hover-reveal icon that slides text aside, nothing decorative or looping for its own sake.

## 2. Color Palette & Roles

Neutral base is Zinc across both themes (already implemented via OKLCH tokens in `src/routes/layout.css`) — keep it as the only neutral family, never mix in Slate/Gray/Cool-gray.

- **Canvas White** (`oklch(1 0 0)` / `#FFFFFF`) — Light-mode background
- **Zinc-950 Ink** (`oklch(0.141 0.005 285.823)` / `#0C0C0D`) — Dark-mode background; light-mode primary text. Not pure black.
- **Zinc-50** (`oklch(0.985 0 0)` / `#FAFAFA`) — Dark-mode text
- **Zinc-500 Steel** (`oklch(0.552 0.016 285.938)` / `#71717A`) — Secondary text, metadata, timestamps
- **Zinc-100/900 Surface** (`--secondary` / `--card`) — Card fill, hover surfaces (`hover:bg-secondary/50`)
- **Zinc-200/800 Border** (`--border`) — 1px structural dividers; also used as the gap-fill between grouped cards (`bg-border` + `gap-px` grid technique already used on the homepage)
- **Signal Blue** (`#3B82F6`) — The single accent. Used for hover states on tags/links (`group-hover:text-primary`), the reveal icon in `PostListItem`, and focus rings. Saturation held under 80%; never paired with purple or pink.

**Retire the three-stop `blue → purple → pink` gradient text in `Hero.svelte`.** Multi-hue gradient headlines are a generic AI-blog tell. Replace with Signal Blue as the sole emphasis color — either a solid accent span or a subtle two-stop gradient within the same hue (Zinc-950 → Signal Blue), never crossing into purple/pink.

## 3. Typography Rules

- **Display/Body Sans:** `Geist` (Latin) + `Noto Sans TC` (CJK) — replaces `Inter`, which is banned for premium contexts. Keep the existing CJK fallback chain (`Noto Sans TC`, emoji fallbacks) unchanged; only the Latin face changes.
- **Mono:** `Geist Mono` — already the right instinct in `PostListItem.svelte` (`font-mono` on date/reading-time metadata); extend this consistently to all timestamps, tag counts, and code blocks.
- **Display scale:** Track-tight (`tracking-tighter`, already used on the H1). Hierarchy comes from weight and color (`text-foreground` vs `text-muted-foreground`), not from stacking ever-larger sizes.
- **Body:** Relaxed leading (`leading-relaxed`), constrained to ~65ch in prose contexts (`.prose` already handles this via `@tailwindcss/typography`).
- **Banned:** `Inter`; any generic serif (`Times New Roman`, `Georgia`, `Garamond`). This is a software-dashboard-adjacent product — no serif anywhere, including editorial pages.

## 4. Component Stylings

- **Buttons:** Flat fills, no outer glow, no neon ring. `shadow-xs` only. Keep the existing `tailwind-variants` structure in `Button.svelte` (`default`/`outline`/`ghost`/`link`) — it already matches this system. Add a subtle `active:translate-y-px` tactile press if introducing new primary CTAs.
- **Cards:** Used only where elevation communicates real grouping (featured posts). Keep the current pattern: no per-card shadow/border — instead a shared `border border-border bg-border` wrapper with `gap-px` between flat `bg-card` rows (`+page.svelte` featured-posts block). Do not introduce individually-shadowed cards; it fights this system's flat, divider-driven hierarchy.
- **List rows (`PostListItem`):** The hover behavior — an icon fading/sliding in from the left while text nudges right (`group-hover:translate-x-8`) — is the signature interaction. Reuse this pattern instead of inventing new hover treatments; do not add box-shadow-on-hover.
- **Tags/pills:** `rounded-md border border-border` chips, text goes `text-primary` + `border-primary/30` on group-hover. Keep this exact treatment for any new taxonomy UI.
- **Inputs:** Label above input, error below, standard gap spacing (see `Input.svelte`, `CommandInput.svelte`). No floating labels.
- **Loading States:** Skeletal loaders matching layout dimensions — no generic circular spinners.
- **Empty States:** Reuse `EmptyState.svelte`'s composed message pattern rather than a bare "No data" string.

## 5. Layout Principles

- Content is contained to `max-w-4xl` centered (`container mx-auto max-w-4xl`, matching the current homepage) — do not widen this for new top-level pages without reason.
- Hero and section headers are **left-aligned**, never centered — this is already correct in `Hero.svelte` and should hold for any new landing sections.
- No 3-equal-column feature rows. The existing pattern — a bordered, `gap-px` divided stack of flat rows — is the house grid; prefer it or an explicit asymmetric split over generic card grids.
- Full-height sections use `min-h-[100dvh]`, never `h-screen`.
- Section rhythm: `space-y-12` at the page level, `space-y-8` within a section, `<hr>` dividers between major sections (already the pattern in `+page.svelte`) — keep this instead of introducing background-color band separators.

## 6. Motion & Interaction

- **Entrance:** Staggered fade/slide-up on page load using `tw-animate-css` utilities (`animate-in fade-in slide-in-from-bottom-4`) with incremental `delay-{n}` per section — this is already the house pattern (`+page.svelte`) and should be reused for any new sectioned page, not replaced with a JS animation library.
- **Hover:** Color and `translate-x` transitions only, `duration-300`, `ease-out`. No scale-pop, no glow.
- **Performance:** Animate `transform`, `opacity`, and `color`/`background-color` only — never `top`/`left`/`width`/`height`.
- **Restraint:** No perpetual/looping micro-animations (no pulsing dots, shimmering badges). This system's motion is a one-time entrance plus hover feedback — matching an editorial reading product, not a live dashboard.

## 7. Anti-Patterns (Banned)

- No emojis anywhere in UI copy
- No `Inter` — use `Geist` (Latin) + `Noto Sans TC` (CJK)
- No generic serif fonts anywhere in this product
- No pure black (`#000000`) — use Zinc-950
- No neon/outer-glow shadows or oversaturated accent colors
- No multi-hue gradient text (retire the blue→purple→pink `Hero.svelte` gradient)
- No custom mouse cursors
- No overlapping elements — every element keeps its own spatial zone
- No 3-column equal-card layouts — use the bordered `gap-px` divided-row pattern instead
- No centered hero/section headers
- No generic placeholder names ("Acme", "John Doe", "Nexus")
- No fabricated metrics, uptime %, or "BY THE NUMBERS" stat blocks — this blog shows real post data (date, reading time, tags) only
- No `LABEL // YEAR` styling conventions
- No AI copywriting clichés ("Elevate", "Seamless", "Unleash", "Next-Gen") in Traditional Chinese or English copy
- No filler UI text ("Scroll to explore", bouncing chevrons)
- No broken Unsplash links — use `picsum.photos` or local/SVG assets
