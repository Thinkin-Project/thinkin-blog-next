- [x] 以 `npx npm-check-updates -u --reject typescript,@sveltejs/kit,@sveltejs/adapter-auto,happy-dom` 升級 patch + minor（含 `pnpm` 與 `packageManager`），執行 `pnpm install`
- [x] 第 1 批驗證：`pnpm check`、`pnpm lint`、`pnpm test`、`pnpm build` 全部通過，必要時調整 `pnpm-workspace.yaml`（實際調整：3 個元件的 `$props<{...}>()` 改為 `}: {...} = $props()`，`package.json` 以 prettier 正規化換行；`pnpm-workspace.yaml` 由 pnpm 自動加入 `@lucide/svelte@1.63.0`）
- [x] 第 1 批 commit（使用 `commit` skill）
- [x] 閱讀 SvelteKit 3 migration guide，確認 `$lib`、hook 型別、`handleError` 等對本專案的實際影響，並回報給使用者
- [x] 升級 `@sveltejs/kit` ^3 與 `@sveltejs/adapter-auto` ^8，執行 `pnpm install`，並依 migration guide 修正程式碼（以 `sv migrate sveltekit-3` 執行 svelte-config、environment、paths、external-redirects、shallow-routing、params、imports、lib-alias、app-state；再手動修正測試的 `vi.doMock('$app/environment')` 與 `tsconfig.json` 的 `include`）
- [x] 第 2 批驗證：`pnpm check`、`pnpm lint`、`pnpm test`、`pnpm build` 全部通過，且 `pnpm dev` 可啟動、首頁與文章頁可開啟（`pnpm lint` 的 prettier 仍有升級前就存在的 5 個檔案警告；`kit.alias` 的 `$posts`、`$content` 已改為 `package.json` 的 `#posts/*`、`#content/*` 子路徑匯入，deprecated 警告已消失；`$env/static/public` 已改為 `src/env.ts` 的 `defineEnvVars` 搭配 `$app/env/public`）
- [ ] 第 2 批 commit
- [ ] 升級 `happy-dom` ^21，執行 `pnpm test` 通過後 commit

## 驗收條件

- 情境：執行 `npx npm-check-updates` 時，除 `typescript` 外不再列出任何可升級項目
- 情境：`package.json` 的 `typescript`（~6）、`@typescript/native` 與 `check` script 的 `--tsgo` 維持不變
- 情境：每一批升級後，`pnpm check`、`pnpm lint`、`pnpm test`、`pnpm build` 都通過
- 情境：升級 SvelteKit 3 後，執行 `pnpm dev` 能開啟首頁與任一文章頁，且頁面行為與升級前一致
- 情境：三批升級分別為獨立 commit，可單獨還原
