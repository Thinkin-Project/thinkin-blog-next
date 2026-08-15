## 為什麼做

目前「主題」功能是內嵌在「所有文章」（/posts）頁面頂部的一個清單區塊，沒有獨立入口，側邊欄導覽也沒有「主題」項目。文章詳情頁上顯示的「主題」欄位目前是純文字，無法點擊查看該主題底下的其他文章。使用者希望把「主題」獨立成一個功能頁面（類似分類總覽頁），並讓文章上的主題可以點擊跳轉。

## 要改什麼

- Sidebar 導覽新增「主題」項目，路由 `/topics`，位置放在「文章」下方
- 移除 `/posts` 頁面內嵌的「主題」清單區塊，所有文章頁面不再包含主題導覽/過濾功能
- 新增 `/topics` 索引頁（類似截圖的「分類」頁面）：
    - 顯示主題總數（共 N 個主題）
    - 提供一個依名稱過濾的搜尋輸入框（樣式參考專案既有輸入框慣例，不套用截圖中的 `grep categories...` placeholder）
    - 以卡片列出各主題名稱與該主題下的文章數量，點擊卡片導向既有的 `/topics/[slug]` 頁面（此頁面本身不需修改）
- 文章詳情頁（`/posts/[slug]`）的主題欄位改為可點擊連結，指向 `/topics/[slug]`，樣式先參考現有「標籤」badge 的樣子

## 影響範圍

新增：

- `src/routes/topics/+page.svelte`
- `src/routes/topics/+page.server.ts`
- 對應測試（比照既有 `src/test/routes/topics.slug.page.server.test.ts` 慣例）

修改：

- `src/lib/constants/navigation.ts`（`NAV_ITEMS` 新增「主題」項目）
- `src/routes/posts/+page.svelte`（移除「主題」清單區塊與不再使用的 import）
- `src/routes/posts/[slug]/+page.svelte`（主題欄位改為可點擊 `<a>`，套用類似標籤 badge 的樣式）
- `src/routes/topics/[slug]/+page.svelte`（移除內嵌的「Sub-nav Categories」主題清單區塊，避免與新的 `/topics` 索引頁重複；保留返回按鈕與主題標題）

不變：

- `src/routes/topics/[slug]/+page.server.ts`（過濾邏輯不變）
- `/tags` 相關功能（本次提案不處理，tags 目前仍維持純文字樣式）
- `src/lib/constants/topics.ts`、`src/posts/_metadata/topics.json`（資料層已齊全，沿用既有 `TOPICS`）
