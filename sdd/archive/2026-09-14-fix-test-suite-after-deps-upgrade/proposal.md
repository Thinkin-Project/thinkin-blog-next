## 為什麼做

升級套件（vite ^8.2.1→^8.3.0、vitest ^4.1.10→^5.0.0 等）後，`pnpm run test` 出現 13 個測試失敗，`pnpm run test:coverage` 也連帶反映 `+page.ts` 覆蓋率不足。共兩個各自獨立的原因：

1. **`webmcp.browser.test.ts`（12 個測試失敗）**：`vitest.config.ts` 用 `resolve.alias` 把 `$app/navigation` 換成測試用 mock。SvelteKit vite plugin 對 `$app` 這個 alias key 是 enforced（強制鎖定），新版 vite/vitest 的 config 合併順序改變後，使用者在 `resolve.alias` 設定的覆蓋不再優先於 SvelteKit 注入的 `$app/*` alias，導致測試 import 到真正的 `goto`（普通 function）而非 mock，呼叫 `vi.mocked(goto).mockReset()` 時報錯。

2. **`post.slug.page.test.ts`（1 個測試失敗）**：`+page.ts` 原本用 `import(\`$posts/${slug}/index.md\`)`這種帶變數的動態 import。新版 Vite 對這種寫法的 SSR/測試環境轉譯行為改變，會在`vi.mock`/`vi.doMock`有機會介入之前，先用磁碟上實際存在的檔案建立查詢表，若查不到（測試用的虛構 slug`unit-post` 沒有對應檔案）就直接拋錯，導致 mock 完全失效。連帶地，`+page.ts` 本身也有兩段分支（markdown code fence 判斷、ogImage 路徑判斷的多種情況）從未被測試覆蓋到，導致覆蓋率不足 80%。

（本任務已於問題發生當下直接修完並驗證通過，此文件為事後補提案歸檔用。）

## 要改什麼

- `vitest.config.ts`：把 `$app/environment`、`$app/navigation` 的 mock alias 從 `resolve.alias`（node/browser 兩個 project 內）改用優先權更高的 `test.alias`。
- `src/routes/posts/[slug]/+page.ts`：動態 import 改為 `import.meta.glob('/src/posts/*/index.md')` 靜態寫法（與 `src/lib/server/posts.ts` 既有慣例一致），依 slug 查表取得 loader；型別從 `unknown` 收斂為 `{ default: Component; metadata: ArticleMeta }`。
- `src/test/routes/post.slug.page.test.ts`：
    - `vi.doMock` 的 module key 從 `$posts/...` 改為 glob 實際產生的 `/src/posts/...`。
    - 原本用虛構 slug `unit-post` 的測試改用實際存在的文章 slug（`why-program-needs-unit-testing`）搭配 `vi.doMock` 覆蓋內容。
    - 新增測試涵蓋 markdown code fence（``` 與 ~~~）跳過標題偵測的分支、ogImage 為絕對網址、ogImage 為 `.` 開頭但非 `./` 開頭的分支，補齊覆蓋率。

## 影響範圍

- 修改：`vitest.config.ts`
- 修改：`src/routes/posts/[slug]/+page.ts`
- 修改：`src/test/routes/post.slug.page.test.ts`
- 不影響：`webmcp.browser.test.ts`（測試內容不變，僅環境設定修正後即可通過）
