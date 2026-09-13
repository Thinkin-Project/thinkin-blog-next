- [x] 執行 `pnpm run test`，確認失敗清單與錯誤訊息（webmcp.browser.test.ts 12 個、post.slug.page.test.ts 1 個）
- [x] 追查 `$app/navigation` mock 失效原因，確認為 SvelteKit enforced alias 覆蓋 `resolve.alias`
- [x] 將 `vitest.config.ts` 的 `$app/*` mock 改用 `test.alias`，驗證 `webmcp.browser.test.ts` 12 個測試全數通過
- [x] 追查 `post.slug.page.test.ts` 失敗原因，確認為動態 import 變數在新版 vite 下無法被 vi.mock 攔截
- [x] 將 `+page.ts` 改為 `import.meta.glob` 靜態寫法，並修正對應型別標註
- [x] 更新 `post.slug.page.test.ts` 的 mock module key 與測試 slug，驗證測試通過
- [x] 執行 `pnpm run test:coverage`，確認 `+page.ts` 覆蓋率不足 80% 的分支（code fence、ogImage）
- [x] 補上對應測試案例，重新執行 `pnpm run test:coverage` 確認 `+page.ts` 達到 80% 以上
- [x] 執行 `pnpm run test`、`pnpm run check` 全量驗證，確認無其他回歸

## 驗收條件

- 情境：執行 `pnpm run test`，全部測試（含 webmcp.browser.test.ts、post.slug.page.test.ts）通過，無失敗案例。
- 情境：執行 `pnpm run test:coverage`，`src/routes/posts/[slug]/+page.ts` 的 Statements/Branches/Functions/Lines 皆達 80% 以上。
- 情境：執行 `pnpm run check`，維持 0 錯誤，未因測試修正引入新的型別問題。
