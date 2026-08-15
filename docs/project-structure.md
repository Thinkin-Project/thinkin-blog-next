# 專案結構

預設責任分工如下：

- `src/routes/`：SvelteKit 路由與頁面
- `src/lib/components/`：共用元件
- `src/lib/components/ui/`：Shadcn 元件
- `src/lib/server/`：Server-only 邏輯
- `src/lib/client/`：Client-only 邏輯
- `src/lib/states/`：共用狀態與互動邏輯
- `src/lib/constants/`：跨模組常數與可共享設定值
- `src/lib/utils/`：工具函式
- `src/lib/types/`：共用型別
- `src/content/`、`src/data/` 或其他內容來源目錄：內容型資料與靜態資料來源
- `src/test/`：測試程式碼
- `static/`：靜態資源
- `scripts/`：自動化、建置與維護腳本

若專案已有既定結構，優先遵循既有慣例。
