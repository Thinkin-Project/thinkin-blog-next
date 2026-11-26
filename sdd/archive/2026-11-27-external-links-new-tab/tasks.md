# Tasks

- [x] 盤點現有文章中的 Markdown 外部連結（`](http`），確認沒有刻意要在原視窗開啟的連結
- [x] 在 `vite.config.ts` 的 `remarkPlugins` 新增「外部連結新分頁」插件（僅處理 `http(s)://`，加上 `target` 與 `rel`）
- [x] 在 `src/posts/effortless-e2e-mcp/index.md` 第 69、85 行的手寫 `<a target="_blank">` 補上 `rel="noopener noreferrer"`
- [x] 執行 `pnpm run build`，檢查建置輸出的 HTML：外部連結帶有 `target="_blank" rel="noopener noreferrer"`，`/posts/...` 站內連結沒有
- [x] 執行 `pnpm run check`、`pnpm run lint`，確認沒有新增錯誤
- [x] 以 `pnpm run dev` 開啟一篇含外部與站內連結的文章，手動點擊確認行為

## 驗收條件

- 情境：當文章內以 Markdown 撰寫 `[文字](https://example.com)`，點擊後在新分頁開啟，且連結帶有 `rel="noopener noreferrer"`
- 情境：當文章內連結為 `http://` 開頭，行為同上
- 情境：當文章內連結為站內路徑（如 `/posts/turn-work-experience-into-ai-skills`），點擊後仍在原視窗開啟，且不帶 `target`
- 情境：當連結為 `#anchor`、相對路徑或 `mailto:`，不做任何改變
- 情境：`effortless-e2e-mcp` 內兩處手寫 `<a>` 帶有 `target="_blank" rel="noopener noreferrer"`，連結位址與文字不變，且不被插件重複處理
- 情境：`package.json` 沒有新增依賴，`pnpm run build` 成功
