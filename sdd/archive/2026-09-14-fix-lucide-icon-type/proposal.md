## 為什麼做

升級 `@lucide/svelte`（1.31.0 → 1.45.0）後，`pnpm run check` 出現 5 個型別錯誤：

```
Type '{ class: string; }' is not assignable to type 'IconProps | undefined'.
```

原因是套件的 `Icon` 型別匯出語意改變：舊版 `typeof Icon` 可用來代表任意個別圖示元件（如 `Coffee`、`Heart`）的型別；新版 `Icon` 改指向底層低階元件（其 props 需要 `icon`/`iconNode`），而個別圖示元件實際型別是套件新增的 `LucideIcon`（`Component<LucideProps>`）。專案裡 `DonationLink.icon` 與 `NavItem.icon` 用 `typeof Icon` 標註型別，因而與新版不相容，導致 `Donate.svelte`、`Sidebar.svelte` 出現型別錯誤。

（本任務已於升級套件當下直接修完並驗證通過，此文件為事後補提案歸檔用。）

## 要改什麼

- `src/lib/types/donation.ts`：`DonationLink.icon` 型別從 `typeof Icon` 改為 `LucideIcon`。
- `src/lib/types/navigation.ts`：`NavItem.icon` 型別從 `typeof Icon` 改為 `LucideIcon`。
- import 來源從 `import type { Icon } from '@lucide/svelte'` 改為 `import type { LucideIcon } from '@lucide/svelte'`。

## 影響範圍

- 修改：`src/lib/types/donation.ts`
- 修改：`src/lib/types/navigation.ts`
- 不影響：`Donate.svelte`、`Sidebar.svelte` 等使用端程式碼（型別修正後即相容，無需改動）
