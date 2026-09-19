## 為什麼做

目前站台已有基礎 SEO（SSR、robots.txt、sitemap.xml、基本 meta/OG 標籤），但缺少三項常見補強，可能影響搜尋引擎收錄品質與重複內容判斷：

1. `robots.txt` 沒有指向 `sitemap.xml`，爬蟲較難主動發現 sitemap。
2. 頁面沒有 `canonical` 標籤，若未來出現分頁、query string 等情況容易被判定為重複內容。
3. 文章頁沒有 JSON-LD 結構化資料，Google 較難產生富摘要（作者、發佈日期等資訊）。

## 要改什麼

- `static/robots.txt` 加上 `Sitemap: <BLOG_CONFIG.url>/sitemap.xml`。
- `src/routes/+layout.svelte` 的 `<svelte:head>` 加上 `<link rel="canonical" href={ogUrl} />`（沿用現有的 `ogUrl` 邏輯，全站皆適用）。
- `src/routes/posts/[slug]/+page.svelte` 加上 JSON-LD `<script type="application/ld+json">`，型別為 `BlogPosting`，內容取自現有 `data.meta`（title、description、date、ogImage、authors 等），不新增資料來源。

## 影響範圍

- 修改：`static/robots.txt`
- 修改：`src/routes/+layout.svelte`
- 修改：`src/routes/posts/[slug]/+page.svelte`
- 不新增檔案、不新增依賴套件
