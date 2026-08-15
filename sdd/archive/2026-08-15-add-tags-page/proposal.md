## 為什麼做

側邊欄導覽目前只有「主題」入口，沒有「標籤」入口。文章上的標籤（`ArticleMeta.tags`）雖然已有資料（`src/posts/_metadata/tags.json`、`TAGS` 常數）與文章詳情頁上的 badge 顯示，但沒有一個獨立頁面可以瀏覽全部標籤、也沒有依標籤篩選文章的頁面。希望比照先前「主題」獨立成頁的做法（見 `sdd/archive/2026-08-15-split-topics/`），新增「標籤」導覽項目與對應頁面，畫面呈現改走使用者提供截圖的 terminal 風格（`$ grep tags...` 搜尋框、pill 標籤＋數量）。

## 要改什麼

- Sidebar 導覽在「主題」下方新增「標籤」項目，路由 `/tags`
- 新增 `/tags` 索引頁：
    - 顯示標籤總數（共 N 個標籤）
    - 提供依名稱過濾的搜尋輸入框，樣式沿用 `/topics` 頁面既有的搜尋框樣式（`Search` icon + 圓角輸入框），不採用截圖中的 terminal 風格
    - 以 pill／badge 樣式列出各標籤名稱與該標籤下的文章數量（非卡片式），點擊 pill 導向新增的 `/tags/[slug]` 頁面
    - 標籤數量多時採用 flex-wrap 排列（非 grid 卡片），呼應截圖的排版；區塊外觀雖與 `/topics` 卡片不同，但 hover 效果（顏色轉換、focus-visible ring）比照 `/topics` 頁面卡片的寫法
- 新增 `/tags/[slug]` 頁面：列出該標籤底下的文章（含分頁），版面比照 `/topics/[slug]` 頁面
- 文章詳情頁（`src/routes/posts/[slug]/+page.svelte`）的標籤欄位，由目前的純文字 `<span>` 改為可點擊的 `<a href="/tags/{slug}">`，樣式比照同一頁面上「主題」欄位的 `<a>` badge 寫法

## 影響範圍

新增：

- `src/routes/tags/+page.svelte`
- `src/routes/tags/+page.server.ts`
- `src/routes/tags/[slug]/+page.svelte`
- `src/routes/tags/[slug]/+page.server.ts`
- 對應測試（比照 `src/test/routes/topics.page.server.test.ts`、`topics.slug.page.server.test.ts` 慣例）

修改：

- `src/lib/constants/navigation.ts`（`NAV_ITEMS` 在「主題」下方新增「標籤」項目）
- `src/routes/posts/[slug]/+page.svelte`（標籤欄位改為可點擊 `<a href="/tags/{slug}">`）

不變：

- `src/lib/constants/tags.ts`、`src/posts/_metadata/tags.json`（資料層已齊全，沿用既有 `TAGS`）
- `src/lib/types/article.ts`（`tags: string[]` 結構不變）
