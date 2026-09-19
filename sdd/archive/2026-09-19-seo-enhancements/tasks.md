- [x] 在 `static/robots.txt` 加上 `Sitemap: https://www.thinkinmd.com/sitemap.xml`（用 `BLOG_CONFIG.url` 的實際值，靜態檔案無法讀取環境變數，直接寫死正式網址）
- [x] 在 `src/routes/+layout.svelte` 的 `<svelte:head>` 加上 `<link rel="canonical" href={ogUrl} />`
- [x] 在 `src/routes/posts/[slug]/+page.svelte` 加上 JSON-LD（`BlogPosting`）script 標籤，欄位對應 `data.meta`（title、description、datePublished、dateModified、image、author）
- [x] 執行 `pnpm run check` 與 `pnpm run test` 確認沒有破壞既有功能

## 驗收條件

- 情境：開啟 `static/robots.txt`，可以看到 `Sitemap: https://www.thinkinmd.com/sitemap.xml` 這一行
- 情境：檢視任一頁面原始碼（含首頁與文章頁），`<head>` 內有 `<link rel="canonical">` 且網址正確對應該頁面
- 情境：檢視任一文章頁原始碼，`<head>` 或內文中有 `application/ld+json` script，內容為合法 JSON 且 `@type` 為 `BlogPosting`，標題/描述/日期與該篇文章一致
- 情境：`pnpm run check` 與 `pnpm run test` 皆通過
