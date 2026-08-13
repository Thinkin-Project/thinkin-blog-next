- [x] 修改 `package.json`：`typescript` 改為 `~6`，新增 `@typescript/native: npm:typescript@^7.0.2`（保持 devDependencies 字母排序）
- [x] 修改 `package.json`：`check` script 加上 `--tsgo` 旗標
- [x] 執行 `pnpm install`，確認 lockfile 更新且 `@typescript/native` 安裝成功
- [x] 修改 `src/hooks.server.ts`：改用明確的 `Handle` 型別標註（`import type { Handle } from '@sveltejs/kit'`）
- [x] 執行 `pnpm run check`，確認 0 errors / 0 warnings
- [x] 執行 `pnpm run lint`，確認格式與 eslint 皆通過
- [x] 執行 `pnpm run test`，確認所有測試通過
- [x] 依使用者要求，將 `svelte-check` 升級到 `^4.7.6`，並重新驗證 check/lint/test

## 驗收條件

- 情境：執行 `pnpm run check`，結果為 0 errors、0 warnings（不再出現 `ts-version-check.js` 的錯誤，也不再出現 `hooks.server.ts` 的 `implicitAny` 假錯誤）
- 情境：執行 `pnpm run lint` 與 `pnpm run test`，皆維持全部通過，沒有因這次升級產生新的失敗
- 情境：`package.json` 中除了 `typescript`、`@typescript/native`、`check` script 這三處，沒有其他套件版本被順手升級
