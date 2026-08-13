## 為什麼做

`typescript` 目前鎖在 `^6.0.3`。升級到 TypeScript 7 需要搭配 `svelte-check` 的雙版本設定（`typescript@~6` + `@typescript/native@npm:typescript@7`）與 `--tsgo` 旗標，才能讓 `svelte-check` 正常執行，否則會直接拋錯終止（`ts-version-check.js` 會擋下 major >= 7 的單一 typescript 版本）。

實測發現：加上 `--tsgo` 後，`svelte-check` 改用實驗性 TypeScript 7 原生編譯器，會對 `src/hooks.server.ts` 的隱式參數推斷（`export async function handle({ event, resolve })`）誤判為 `implicitAny`，共 3 個假錯誤；改成明確標註 `Handle` 型別（`export const handle: Handle = async ({ event, resolve }) => {...}`）後即可解決，且此寫法也是 SvelteKit 官方建議的標準寫法。

## 要改什麼

- `package.json`：`typescript` 改為 `~6`，新增 `@typescript/native: npm:typescript@^7.0.2`，`check` script 加上 `--tsgo` 旗標
- `src/hooks.server.ts`：改用明確的 `Handle` 型別標註，避免 `--tsgo` 對隱式推斷的誤報
- 執行 `pnpm install` 更新 lockfile
- 驗證 `pnpm run check`、`pnpm run lint`、`pnpm run test` 皆通過

## 影響範圍

- `package.json`
- `pnpm-lock.yaml`
- `src/hooks.server.ts`
- 不涉及其他套件版本升級（僅針對 TypeScript 7 這一項，其餘 devDependencies 版本維持不動）
