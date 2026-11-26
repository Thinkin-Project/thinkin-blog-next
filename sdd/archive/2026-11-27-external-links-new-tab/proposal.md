# external-links-new-tab

類型：新功能

## 為什麼做

- 文章中以 Markdown `[文字](url)` 撰寫的連結，目前一律在原視窗開啟，外部連結會讓讀者離開本站。
- 站內元件（`AuthorBlock`、`Donate`、`ShareButtons`）的外部連結已採用 `target="_blank" rel="noopener noreferrer"`，文章內容尚未一致。
- 目前只有 `effortless-e2e-mcp` 以手寫 `<a target="_blank">` 處理，沒有 `rel`，也無法套用到其他文章；插件上線後，這兩處手寫連結是唯一不一致的地方。

## 要改什麼

- 在 `vite.config.ts` 的 `remarkPlugins` 新增一個自訂 remark 插件，寫法與既有的「圖片優化」插件一致：
    - 走訪 mdast 的 `link` 節點。
    - 僅當 `url` 以 `http://` 或 `https://` 開頭（不分大小寫）時，於 `node.data.hProperties` 加上 `target="_blank"` 與 `rel="noopener noreferrer"`。
- 其餘連結維持現狀：站內連結（`/posts/...`）、相對路徑、`#anchor`、`mailto:`、`//host` 等都不處理。
- 不新增任何依賴。
- 插件不處理文章內手寫的 HTML `<a>`；改由人工把 `effortless-e2e-mcp` 的兩處手寫連結（第 69、85 行）補上 `rel="noopener noreferrer"`，其餘屬性與文字不動。

## 影響範圍

- 修改：`vite.config.ts`（新增一個內聯 remark 插件）
- 修改：`src/posts/effortless-e2e-mcp/index.md`（僅兩處 `<a>` 補 `rel`）
- 不修改：其他 `src/posts/**` 文章內容、`package.json`、`+page.svelte`
- 行為影響：所有既有文章中的 Markdown 外部連結都會改為新分頁開啟。
