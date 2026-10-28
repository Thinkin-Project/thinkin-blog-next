# 升級元件（TypeScript 以外）

類型：重構（維護性升級，不改變對外行為）

## 為什麼做

`npx npm-check-updates` 顯示多個套件有新版（patch、minor、major）。定期升級可取得修正與相容性，避免版本落差累積。`typescript` 因 `svelte-check` 的雙版本設定（`typescript@~6` + `@typescript/native`），另案處理，本次排除。

## 要改什麼

分三批，每批獨立驗證、獨立 commit：

1. **Patch + Minor**
    - Patch：`@sveltejs/vite-plugin-svelte`、`@vitest/coverage-v8`、`eslint-plugin-svelte`、`prettier`、`svelte`、`svelte-check`、`vite`、`vitest`
    - Minor：`@lucide/svelte`、`bits-ui`、`eslint`、`globals`、`shiki`、`typescript-eslint`
    - `pnpm` 12.4.1 → 12.16.1（`packageManager` 欄位）
2. **SvelteKit 3**：`@sveltejs/kit` ^3.1.0 與 `@sveltejs/adapter-auto` ^8.0.0 必須一起升
    - 依 migration guide 處理 breaking changes（重點：`$lib` 別名是否變更為 `#lib`、hook 型別搬到 `@sveltejs/kit/hooks`、`handleError` 行為、Node >= 22.17）
3. **happy-dom** ^21.0.4（僅測試環境）

## 影響範圍

- 要改：`package.json`、`pnpm-lock.yaml`、`pnpm-workspace.yaml`（`minimumReleaseAgeExclude` 可能需加入新版本）
- 可能要改（第 2 批）：`src/hooks.server.ts`、`src/test/server/hooks.server.test.ts`（`Handle` 型別 import）、`svelte.config.js`、`tsconfig.json`，以及 `$lib` 若有變更則涉及約 90 個 `src` 檔案的 import
- 不動：`typescript`、`@typescript/native` 與 `check` script 的 `--tsgo` 設定（之後另案）

## 風險與假設

- 專案設有 `minimumReleaseAgeExclude`，過新的版本可能被 `pnpm install` 擋下，必要時才加入排除清單。
- SvelteKit 3 的 `$lib` 處理方式尚未確認，第 2 批第一步要先讀官方 migration guide，若影響範圍過大會停下來回報。
- 每批升級後 `svelte-check --tsgo` 是否仍正常，需以 `pnpm check` 驗證。
