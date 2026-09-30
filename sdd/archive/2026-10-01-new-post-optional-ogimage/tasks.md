# Tasks

- [x] 1. 移除 `scripts/new-post.js` 中 `settings.ogImage || './hero.jpeg'` 的預設值 fallback
- [x] 2. 讓 frontmatter 只在 `ogImage` 有值時才輸出該行，空值時整行省略
- [x] 3. 修改 ogImage 提示文字，說明留空則不設定封面圖
- [x] 4. 手動驗證：分別以「留空」與「輸入 `./cover.png`」各建立一篇測試文章，檢查 frontmatter 與結尾提醒，驗證後刪除測試文章
- [x] 5. 執行 `pnpm run lint`，確認腳本格式與 ESLint 通過（全專案 lint 有 4 個既有檔案的 Prettier 問題，與本次無關；本次變更的檔案單獨檢查通過）

## 驗收條件

- 情境：當建立文章時封面圖片路徑留空，產生的 `index.md` frontmatter 不含 `ogImage` 這一行，結尾也不顯示「別忘了放入…」提醒
- 情境：當建立文章時輸入 `./cover.png`，frontmatter 為 `ogImage: './cover.png'`，結尾提醒「別忘了放入 cover.png 哦！」
- 情境：提示文字不再出現「預設: ./hero.jpeg」，改為說明留空則不設定
- 情境：其他 frontmatter 欄位（title、slug、date、drafted、featured、topic、tags、authors）的輸出與修改前完全相同
- 情境：`pnpm run lint` 通過，且 `src/` 與既有文章沒有任何變更
