## 為什麼做

採用「漸進式暴露」的做法：只在對應的修改情境下才提示閱讀對應文件（例如「新增或修改表單、驗證相關程式碼前，先讀 [表單與驗證](docs/forms-validation.md)」），細節內容都搬到 `docs/` 底下的獨立文件，AGENTS.md 本身保持精簡。

目前本專案 AGENTS.md 第 9 點把「專案結構」「SvelteKit 開發原則」「UI 與樣式」「表單與驗證」四段的詳細規則都直接寫在檔案裡，內容較長，之後有更多規則要補充時檔案會越來越肥。改成漸進式暴露後，AGENTS.md 只保留觸發條件與連結，agent 只在真的要動到對應範圍的程式碼時才載入該段規則，減少不必要的 context。

## 要改什麼

- 新增 `docs/` 資料夾，拆出以下四份文件，內容為目前 AGENTS.md 第 9 點對應段落的原文（不新增規則、不改變原意）：
    - `docs/project-structure.md`（原「專案結構」段落）
    - `docs/sveltekit-principles.md`（原「SvelteKit 開發原則」段落）
    - `docs/ui-styling.md`（原「UI 與樣式」段落）
    - `docs/forms-validation.md`（原「表單與驗證」段落）
- 修改 `AGENTS.md` 第 9 點：
    - 保留「語言與文案」「技術基線」「規則優先順序」三段（內容短，不拆分）。
    - 把「專案結構」「SvelteKit 開發原則」「UI 與樣式」「表單與驗證」四段，改成漸進式暴露的條件式指引句型，例如：
        - 「新增檔案、判斷某段邏輯該放在哪個目錄、或需要了解各資料夾的責任分工時，先讀 [專案結構](docs/project-structure.md)。」
        - 「新增或修改 route、page、load 或 actions 相關程式碼前，先讀 [SvelteKit 開發原則](docs/sveltekit-principles.md)。」
        - 「新增或修改樣式、UI 元件前，先讀 [UI 與樣式](docs/ui-styling.md)。」
        - 「新增或修改表單、驗證或資料寫入相關程式碼前，先讀 [表單與驗證](docs/forms-validation.md)。」

## 影響範圍

- 修改：`AGENTS.md`
- 新增：
    - `docs/project-structure.md`
    - `docs/sveltekit-principles.md`
    - `docs/ui-styling.md`
    - `docs/forms-validation.md`
