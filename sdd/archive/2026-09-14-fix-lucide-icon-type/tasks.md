- [x] 執行 `pnpm run check`，確認錯誤訊息與發生位置（`Donate.svelte`、`Sidebar.svelte`）
- [x] 追查 `@lucide/svelte` 新版型別定義，確認 `Icon` 語意變更、`LucideIcon` 為正確替代型別
- [x] 修改 `src/lib/types/donation.ts`：`Icon` → `LucideIcon`
- [x] 修改 `src/lib/types/navigation.ts`：`Icon` → `LucideIcon`
- [x] 重新執行 `pnpm run check`，確認 0 錯誤

## 驗收條件

- 情境：執行 `pnpm run check`，不再出現 `Donate.svelte`、`Sidebar.svelte` 的 `IconProps` 型別錯誤，結果為 0 錯誤。
- 情境：`DonationLink.icon`、`NavItem.icon` 欄位仍可指派任意 lucide 圖示元件（如 `Coffee`）作為值，型別檢查通過。
