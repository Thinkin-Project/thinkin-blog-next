# AGENTS.md

Project-specific instructions for AI coding agents working in this repository.

These rules are designed to reduce common LLM coding mistakes. Merge them with task-specific instructions when needed.

## 1. Think Before Coding

Do not assume. Do not hide uncertainty. Surface tradeoffs early.

Before making changes:

- State important assumptions explicitly.
- If the request has multiple interpretations, identify them before choosing one.
- If a simpler approach exists, mention it.
- Push back when the requested solution seems overcomplicated or risky.
- If required context is missing, ask before implementation unless the task is trivial or the safe path is obvious.

Prefer a brief plan for non-trivial work:

1. What will change
2. How it will be verified
3. What will be intentionally left untouched

## 2. Simplicity First

Write the minimum code that solves the current problem.

Avoid:

- Features that were not requested
- Premature abstractions
- Generic frameworks for one-off logic
- Extra configurability without a real need
- Defensive handling for impossible or irrelevant states

If the solution feels larger than the problem, simplify it.

A good rule: if a senior engineer would ask “why is this so complicated?”, rewrite it.

## 3. Surgical Changes

Touch only what is necessary.

When editing existing code:

- Match the existing style, naming, structure, and conventions.
- Do not reformat unrelated files.
- Do not refactor nearby code unless required by the task.
- Do not “clean up” unrelated comments, dead code, or naming.
- If unrelated issues are found, mention them separately instead of fixing them silently.

When your own changes create unused code:

- Remove imports, variables, functions, tests, or files made obsolete by your change.
- Do not remove pre-existing unused code unless explicitly asked.

Every changed line should be explainable by the user’s request.

## 4. Goal-Driven Execution

Convert tasks into verifiable goals.

Examples:

- “Fix the bug” → reproduce the bug, fix it, verify the reproduction no longer fails.
- “Add validation” → add or update tests for invalid input, then make them pass.
- “Refactor this module” → verify behavior before and after the refactor.
- “Improve performance” → define what is being measured and compare before/after.

Before finishing:

- Run the most relevant tests, type checks, linters, or build commands available.
- If verification cannot be run, explain why.
- If only partial verification was possible, state what was and was not checked.

## 5. Respect Project Boundaries

Follow the repository’s existing architecture.

Before introducing new tools, dependencies, patterns, or directories:

- Check whether the project already has an equivalent.
- Prefer existing utilities and conventions.
- Avoid adding dependencies unless the benefit clearly outweighs the cost.
- Keep public APIs stable unless the task explicitly requires changing them.

## 6. Communication Style

Be concise and specific.

When reporting work:

- Summarize what changed.
- Mention the files or areas touched.
- Include verification results.
- Call out risks, assumptions, and follow-up work only when relevant.

Avoid vague summaries like:

- “Updated code”
- “Fixed issues”
- “Improved logic”

Prefer concrete summaries like:

- “Added request validation for missing email fields.”
- “Updated the parser to preserve escaped newline characters.”
- “Added regression coverage for empty search results.”

## 7. Safety Checks Before Completion

Before handing off, confirm:

- The change directly addresses the request.
- No unrelated files were modified.
- No secrets, tokens, credentials, or local-only paths were introduced.
- Error messages are useful but do not leak sensitive details.
- Tests or checks were run where practical.
- Any skipped verification is clearly stated.

## 8. Project-Specific Commands

### Install

```bash
pnpm install
```

### Development

```bash
pnpm run dev
```

### Build

```bash
pnpm run build
```

### Test

```bash
pnpm run test
```

### Coverage

```bash
pnpm run test:coverage
```

### Type Check

```bash
pnpm run check
```

### Format

```bash
pnpm run format
```

### Lint

```bash
pnpm run lint
```

> 若專案未提供對應 script，請優先參考 `package.json` 或既有文件，並使用最接近的驗證方式。

## 9. Project-Specific Conventions

### 語言與文案

- 除非使用者明確要求英文，所有回覆使用正體中文。
- UI microcopy 預設使用正體中文。
- 技術名詞、框架名稱、套件名稱與 API 名稱可保留英文。

### 技術基線

本專案預設使用：

- Package Manager：`pnpm`
- Framework：`SvelteKit`
- Build Tool：`Vite`
- Language：`TypeScript`
- Styling：`Tailwind CSS`
- UI Components：`Shadcn Svelte`
- Linting：`ESLint`
- Testing：`Vitest`

若專案尚未採用其中某項工具，不得僅因本文件而強制導入；優先遵循既有實作。

### 規則優先順序

規則衝突時依序遵循：

1. 使用者當前指示
2. 更近層級的 `AGENTS.md`
3. 根目錄 `AGENTS.md`
4. 其他專案文件與既有實作慣例

若存在 `DESIGN.md`，涉及 UI、版面、互動、主題或文案時，實作前必須先閱讀並優先遵循；若與 `AGENTS.md` 的設計指示衝突，交付時需註記取捨理由。

### 專案結構

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

### SvelteKit 開發原則

- 遵循 SvelteKit 官方 routing、load、actions 與 endpoint 慣例。
- 可於 Server 執行的邏輯，優先不要移至 Client。
- 不得將 Server-only 邏輯暴露給 Client。
- 頁面初始化資料優先透過 `load` 提供。
- 資料寫入與表單提交優先使用 `actions`。

### UI 與樣式

- 採 Mobile-first 設計。
- 優先使用 Tailwind CSS。
- 優先使用 Shadcn Svelte 元件。
- Theme、色彩與設計 Token 優先透過 CSS Variables 或 Theme Tokens 管理。
- 優先先定義 Design Tokens，再於 Tailwind 或 CSS 中使用，避免在模板內重複硬寫 arbitrary values。
- 僅在 Utility Classes 無法清楚表達時加入自訂 CSS。
- 當樣式涉及 pseudo-elements、多層背景、複合 gradients 或 masks、材質效果或較複雜動畫時，可使用局部 CSS 或 `@layer components`。
- 不要為了追求零 CSS 而將複合樣式硬拆成冗長的 Utility Classes。
- 不因小需求新增大型全域樣式檔。
- 若既有全域樣式已有可重用且合理的複合樣式，可沿用；新增樣式時仍以 Tailwind-first 為原則。

### 表單與驗證

- 所有外部輸入皆應驗證與清理，包括 request body、query params、route params、form data、cookies、headers 與 CLI 參數。
- 修改資料流時，若專案已有 Schema 機制，應同步更新相關 Schema 與型別定義，避免漂移。

## 10. Definition of Done

A task is done when:

- The requested behavior is implemented.
- The solution is as simple as practical.
- The change is limited to the necessary scope.
- Relevant tests/checks pass, or skipped checks are explained.
- The final response includes:
    - What changed
    - How it was verified
    - Any important caveats
