# 表單與驗證

- 所有外部輸入皆應驗證與清理，包括 request body、query params、route params、form data、cookies、headers 與 CLI 參數。
- 修改資料流時，若專案已有 Schema 機制，應同步更新相關 Schema 與型別定義，避免漂移。
