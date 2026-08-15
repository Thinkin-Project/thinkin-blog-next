# Design System: Thinkin Markdown

## 1. Visual Theme & Atmosphere

A restrained, editorial developer-blog interface: **Daily App Balanced** density (5/10), **Offset Asymmetric** variance (5/10), **Fluid CSS** motion (5/10). The atmosphere is a quiet engineering notebook — pure-monochrome Zinc neutrals carrying all hierarchy through weight and contrast, no accent hue, and generous whitespace that lets long-form Markdown content breathe. Left-aligned, never centered. Structure comes from borders and dividers rather than boxy cards piled on shadows. Motion is understated and purposeful: staggered fade-ins on page load, a hover-reveal icon that slides text aside, nothing decorative or looping for its own sake.

## 2. Color Palette & Roles

Neutral base is Zinc across both themes (already implemented via OKLCH tokens in `src/routes/layout.css`) — keep it as the only neutral family, never mix in Slate/Gray/Cool-gray. This is a monochrome system by design: there is no separate accent hue — emphasis comes entirely from contrast between the two poles of the Zinc scale (`--primary`), not from color.

- **Canvas White** (`oklch(1 0 0)` / `#FFFFFF`) — Light-mode background
- **Zinc-950 Ink** (`oklch(0.141 0.005 285.823)` / `#0C0C0D`) — Dark-mode background; light-mode primary text. Not pure black.
- **Zinc-50** (`oklch(0.985 0 0)` / `#FAFAFA`) — Dark-mode text
- **Zinc-500 Steel** (`oklch(0.552 0.016 285.938)` / `#71717A`) — Secondary text, metadata, timestamps
- **Zinc-100/900 Surface** (`#F4F4F5` light / `#18181B` dark — `--secondary` / `--card`) — Card fill, hover surfaces (`hover:bg-secondary/50`)
- **Zinc-200/800 Border** (`#E4E4E7` light / `#27272A` dark — `--border`) — 1px structural dividers; also used as the gap-fill between grouped cards (`bg-border` + `gap-px` grid technique already used on the homepage)
- **Zinc-900/50 Emphasis** (`#18181B` light / `#FAFAFA` dark — `--primary`) — The system's only "emphasis" token. Used for hover states on tags/links (`group-hover:text-primary`), the reveal icon in `PostListItem`, and default button fills. It is a contrast shift within the Zinc scale, not a color accent — do not introduce a hue here.
- **Zinc-400 Ring** (`#A1A1AA` — `--ring`) — Focus rings. Also neutral, not a color accent.

**The three-stop `blue → purple → pink` gradient text in `Hero.svelte` is a deliberate, contained exception** to the otherwise monochrome palette — the one moment of color in the whole system, reserved for the Hero headline only. Do not extend it (or any other multi-hue gradient) to other components, and do not treat its presence as license to add color elsewhere; every other surface stays strictly Zinc-only per the accent-free rule above. Note: `Hero.svelte`'s body copy currently also uses standalone `text-blue-400`/`text-purple-400`/`text-pink-400` spans on a few keywords (not a gradient, separate from the headline) — this is scope creep beyond the intended single exception; new copy should not add more of these, and consolidating them back to the monochrome body text is a fair cleanup when next touching that file.

## 3. Typography Rules

- **Display/Body Sans:** `Inter` (Latin) + `Noto Sans TC` (CJK) — current actual stack, set via `--font-sans` in `src/routes/layout.css` and loaded in `src/app.html`. Keep the existing CJK fallback chain (`Noto Sans TC`, emoji fallbacks) unchanged.
- **Mono:** `font-mono` (Tailwind's default monospace stack — no dedicated mono webfont like Geist Mono is loaded) — used in `PostListItem.svelte` on date/reading-time metadata. Not yet consistently applied to tag counts (e.g. `tags/+page.svelte`'s per-tag post count) or all timestamps — extend it there when touching those components.
- **Display scale:** Track-tight (`tracking-tighter`, already used on the H1). Hierarchy comes from weight and color (`text-foreground` vs `text-muted-foreground`), not from stacking ever-larger sizes.
- **Body:** Relaxed leading (`leading-relaxed`), constrained to ~65ch in prose contexts (`.prose` already handles this via `@tailwindcss/typography`).
- **Banned:** any generic serif (`Times New Roman`, `Georgia`, `Garamond`). This is a software-dashboard-adjacent product — no serif anywhere, including editorial pages. (`Inter` is currently in active use as the display/body sans — see above; it is not banned in this system.)

## 4. Component Stylings

- **Buttons:** Flat fills, no outer glow, no neon ring. `shadow-xs` only. Keep the existing `tailwind-variants` structure in `Button.svelte` (`default`/`outline`/`ghost`/`link`) — it already matches this system. Add a subtle `active:translate-y-px` tactile press if introducing new primary CTAs.
- **Cards:** Used only where elevation communicates real grouping (featured posts). Keep the current pattern: no per-card shadow/border — instead a shared `border border-border bg-border` wrapper with `gap-px` between flat `bg-card` rows (`+page.svelte` featured-posts block). Do not introduce individually-shadowed cards; it fights this system's flat, divider-driven hierarchy. Note: `src/routes/topics/+page.svelte` currently deviates from this — its topic grid uses individually-bordered `rounded-2xl border border-border bg-card/80` cards rather than the shared-wrapper pattern. DESIGN.md previously didn't cover this page; treat the shared-wrapper pattern as the standard to converge toward if that grid is revisited, but this isn't a blocking rewrite on its own.
- **List rows (`PostListItem`):** The hover behavior — an icon fading/sliding in from the left while text nudges right (`group-hover:translate-x-8`) — is the signature interaction. Reuse this pattern instead of inventing new hover treatments; do not add box-shadow-on-hover.
- **Tags/pills:** Two legitimate treatments depending on whether the tag is a passive metadata label or an interactive control in its own right:
    - **Inline/nested tags** (e.g. tags shown under a post title in `PostListItem`, sitting inside an already-hoverable row): `rounded-md border border-border bg-card` (or `bg-background` in `FeaturedPostListItem`) chips that shift `text-primary` + `border-primary/30` on the parent's `group-hover`. The chip does carry its own static background fill (`bg-card`/`bg-background`) at rest — it's the _hover_ state, not the background, that's inherited from the parent row.
    - **Standalone interactive tags** (a tag rendered as its own clickable link/button — currently implemented on the tags index/listing page, `src/routes/tags/+page.svelte`; extend the same treatment to filter chips or a future tag-detail header when those are built): follow the same control pattern already used by `Pagination.svelte` — `border border-input` (or `border-border`), `bg-card`, `hover:bg-secondary hover:text-accent-foreground`. `rounded-full` is fine here for emphasis; padding/text size may scale up (e.g. `px-4 py-2 text-sm`) since these are primary-subject elements, not secondary metadata. Note: `src/routes/tags/[slug]/+page.svelte` does not currently render a tag pill of its own — it just shows the tag name as a page title.
    - Do not mix the two: a nested/inline tag should not carry its own `bg-secondary` fill hover, and a standalone tag control should not be restricted to the muted `text-primary`-only hover meant for passive metadata.
- **Inputs:** Label above input, standard gap spacing (see `src/routes/contact/+page.svelte` for the actual pattern — plain `<label for="...">` above each field). `src/lib/components/ui/input/Input.svelte` and `ui/command/CommandInput.svelte` are bare input primitives with no label/error markup of their own; they are not examples of the label/error layout. No floating labels. Error-below-input styling is not yet implemented anywhere in the codebase — treat it as a rule to apply the first time inline validation is added, not an existing pattern to copy.
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
- **Hover:** Color and `translate-x` transitions only, `duration-300`, `ease-out`. No scale-pop, no glow. `PostListItem` applies `ease-out` explicitly; `FeaturedPostListItem` currently only sets `duration-300` without an explicit easing class (relying on Tailwind's default) — align it with `ease-out` next time that component is touched.
- **Performance:** Animate `transform`, `opacity`, and `color`/`background-color` only — never `top`/`left`/`width`/`height`.
- **Restraint:** No perpetual/looping micro-animations (no pulsing dots, shimmering badges). This system's motion is a one-time entrance plus hover feedback — matching an editorial reading product, not a live dashboard.

## 7. Anti-Patterns (Banned)

- No emojis anywhere in UI copy
- No generic serif fonts anywhere in this product
- No pure black (`#000000`) — use Zinc-950
- No neon/outer-glow shadows or oversaturated accent colors
- No _new_ multi-hue gradient text elsewhere in the product — the `blue → purple → pink` gradient in `Hero.svelte` is a deliberate, one-off exception (the Hero's signature emphasis moment) and is not to be copied to other headlines/components
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
