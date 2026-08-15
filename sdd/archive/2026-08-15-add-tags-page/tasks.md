- [x] 1. `src/lib/constants/navigation.ts`：`NAV_ITEMS` 在「主題」項目下方新增「標籤」項目（`href: '/tags'`），選用與現有風格一致的 lucide icon
- [x] 2. 新增 `src/routes/tags/+page.server.ts`：讀取 `TAGS` 與 `getPosts()`，計算每個標籤對應的文章數量（`post.tags.includes(tag.slug)`），依文章數量由多到少排序後回傳
- [x] 3. 新增 `src/routes/tags/+page.svelte`：顯示「標籤」標題、共 N 個標籤、搜尋框樣式沿用 `/topics` 頁面既有樣式（client-side 依名稱過濾），以及 pill／badge 形式的標籤清單（flex-wrap 排列，名稱＋文章數，連到 `/tags/[slug]`；外觀為 pill，但 hover／focus-visible 效果比照 `/topics` 頁面卡片的 `hover:bg-secondary hover:text-accent-foreground focus-visible:ring-2` 寫法），無符合結果時顯示「找不到符合的標籤」空狀態
- [x] 4. 新增 `src/routes/tags/[slug]/+page.server.ts`：依 `params.slug` 篩選 `post.tags` 包含該 slug 的文章，比照 `src/routes/topics/[slug]/+page.server.ts` 的分頁邏輯
- [x] 5. 新增 `src/routes/tags/[slug]/+page.svelte`：顯示標籤名稱標題與該標籤下的文章列表（`PostListItem` + `Pagination`），版面比照 `src/routes/topics/[slug]/+page.svelte`
- [x] 6. 修改 `src/routes/posts/[slug]/+page.svelte`：標籤欄位由 `<span>` 改為 `<a href="/tags/{slug}">`，樣式比照同頁「主題」欄位的 `<a>` badge 寫法
- [x] 7. 新增對應測試：比照 `src/test/routes/topics.page.server.test.ts`、`topics.slug.page.server.test.ts`，補上 `tags.page.server.test.ts`、`tags.slug.page.server.test.ts`；並視需要調整 `post.slug.page.test.ts` 涵蓋標籤改為可點擊連結的部分
- [x] 8. 執行 `pnpm run check`、`pnpm run lint`、`pnpm run test` 驗證

## 驗收條件

- 情境：在側邊欄看到「主題」下方多一個「標籤」項目，點擊後導向 `/tags`
- 情境：進入 `/tags` 頁面，可看到標籤總數與所有標籤的 pill／badge，每個 pill 顯示標籤名稱與文章數量，滑鼠移入時的 hover 效果與 `/topics` 頁面卡片一致
- 情境：`/tags` 頁面的搜尋框樣式與 `/topics` 頁面一致，輸入關鍵字後清單即時過濾成符合的標籤
- 情境：在 `/tags` 頁面搜尋一個不存在的標籤名稱，畫面顯示「找不到符合的標籤」提示，而非空白
- 情境：點擊 `/tags` 頁面上任一標籤 pill，導向 `/tags/[slug]` 並看到該標籤底下的文章列表（含分頁）
- 情境：造訪任一篇文章詳情頁，標籤欄位呈現與「主題」相同的可點擊 badge 樣式，點擊後導向該標籤的 `/tags/[slug]` 頁面
