# new-post-optional-ogimage

類型：新功能（調整既有腳本行為）

## 為什麼做

`scripts/new-post.js` 在「封面圖片路徑」輸入空值時，仍會以 `|| './hero.jpeg'` 補上預設值，並無條件寫出 `ogImage` frontmatter。想刻意不放封面圖的文章，每次都得手動刪掉這一行。

已確認程式端可安全處理缺少 `ogImage` 的文章：

- `+layout.svelte` 會退回 `BLOG_CONFIG.ogImage`，`og:image` 與 `twitter:image` 不會是空的。
- 文章頁封面圖以 `{#if data.meta.ogImage}` 包住，沒有就不顯示。
- JSON-LD 的 `image` 為 `undefined` 時會被 `JSON.stringify` 略過。

## 要改什麼

- 封面圖片路徑輸入空值時，不再補上 `./hero.jpeg`。
- 空值時 frontmatter 不輸出 `ogImage` 這一行；有值時行為與現在相同。
- 提示文字由「預設: ./hero.jpeg」改為說明留空則不設定。
- 結尾「別忘了放入 xxx」的提醒，僅在有輸入路徑時顯示（現有 `if` 判斷會自然生效）。

## 影響範圍

- 修改：`scripts/new-post.js`（ogImage 提示文字、fallback、frontmatter 產生、結尾提醒）
- 不新增檔案，不動 `src/` 下的任何程式與既有文章。
