- [x] 1. `src/lib/constants/navigation.ts`：`NAV_ITEMS` 新增「主題」項目（`href: '/topics'`），選用與現有風格一致的 lucide icon，放在「文章」項目下方
- [x] 2. 新增 `src/routes/topics/+page.server.ts`：讀取 `TOPICS` 與 `getPosts()`，計算每個主題對應的文章數量並回傳給頁面
- [x] 3. 新增 `src/routes/topics/+page.svelte`：顯示「主題」標題、共 N 個主題、一個依名稱過濾主題的搜尋輸入框（client-side 過濾），以及主題卡片列表（名稱＋文章數，連到 `/topics/[slug]`）
- [x] 4. 移除 `src/routes/posts/+page.svelte` 內的「主題」區塊，清掉不再使用的 import（如 `TOPICS`、`CornerDownRight`）
- [x] 5. 修改 `src/routes/posts/[slug]/+page.svelte`：主題欄位改為 `<a href="/topics/{slug}">`，套用類似標籤 badge 的樣式
- [x] 6. 移除 `src/routes/topics/[slug]/+page.svelte` 內的「Sub-nav Categories」主題清單區塊，保留返回按鈕與主題標題，清掉不再使用的 import（如 `CornerDownRight`）
- [x] 7. 檢查並視需要調整既有測試（`/posts` 頁面渲染測試、`/topics/[slug]` 頁面測試、文章詳情頁測試），補上 `/topics` 索引頁的對應測試
- [x] 8. 執行 `pnpm run check`、`pnpm run lint`、`pnpm run test` 驗證
- [x] 9. 驗收微調：`/topics` 卡片與文章頁主題 badge 的 hover 樣式改參考文章頁「relatedPosts」卡片/主題徽章的樣式
- [x] 10. 驗收微調：`/topics` 卡片版面在桌面寬度改為 4 欄一列（`sm:grid-cols-2 lg:grid-cols-4`）
- [x] 11. 驗收微調：`/topics` 主題卡片依文章數量由多到少排序（`+page.server.ts` 內排序後回傳）
- [x] 12. 驗收微調：`/topics` 搜尋不到主題時顯示空狀態文字「找不到符合的主題」（沿用 `GlobalSearch.svelte` 的空狀態文案風格）

## 驗收條件

- 情境：在側邊欄看到「文章」下方多一個「主題」項目，點擊後導向 `/topics`
- 情境：進入 `/topics` 頁面，可看到主題總數與所有主題卡片，每張卡片顯示主題名稱與文章數量，點擊後導向 `/topics/[slug]` 並看到該主題底下的文章
- 情境：在 `/topics` 頁面輸入搜尋文字（例如主題名稱關鍵字），清單即時過濾成符合的主題
- 情境：造訪 `/posts` 頁面，不再看到「主題」清單/過濾區塊，只看到「所有文章」清單
- 情境：造訪任一篇文章詳情頁，主題欄位呈現如標籤般的 badge 樣式且可點擊，點擊後導向該主題的 `/topics/[slug]` 頁面
- 情境：造訪 `/topics/[slug]` 頁面，不再看到重複的主題清單區塊，只看到返回按鈕、主題標題與該主題的文章列表
- 情境：主題數量較多時，`/topics` 頁面在桌面寬度會以 4 欄排列
- 情境：`/topics` 頁面的主題卡片依文章數量由多到少排序
- 情境：在 `/topics` 頁面搜尋一個不存在的主題名稱，畫面顯示「找不到符合的主題」提示，而非空白
