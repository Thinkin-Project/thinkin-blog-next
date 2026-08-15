# SvelteKit 開發原則

- 遵循 SvelteKit 官方 routing、load、actions 與 endpoint 慣例。
- 可於 Server 執行的邏輯，優先不要移至 Client。
- 不得將 Server-only 邏輯暴露給 Client。
- 頁面初始化資料優先透過 `load` 提供。
- 資料寫入與表單提交優先使用 `actions`。
