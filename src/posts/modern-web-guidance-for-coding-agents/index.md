---
title: 'Agent 會寫網站，不代表它懂現在的 Web：用 Modern Web Guidance 補上過時知識'
description: 'Google 推出的 Modern Web Guidance，透過可更新的 Skill 與指南，協助 Coding Agent 採用現代 Web API、正確的瀏覽器相容策略，還能用 legacy-scan 找出既有專案中的過時寫法'
slug: 'modern-web-guidance-for-coding-agents'
date: '2026-11-14'
drafted: false
featured: false
topic: 'artificial-intelligence'
tags: ['ai-agent', 'agentic-workflow', 'agent-skill', 'modern-web-guidance', 'web-development']
authors: ['neil-tsai', 'chatgpt']
---

最近看到 Google Chrome 團隊推出的 [Modern Web Guidance](https://github.com/GoogleChrome/modern-web-guidance)，第一個反應是：這可能補上了 Coding Agent 一個長期存在，卻很容易被忽略的缺口。

我們經常擔心 Agent 會不會寫錯程式碼，卻比較少追問：

> Agent 寫出的程式碼即使能動，使用的還是現在值得採用的 Web 實作方式嗎？

Web 平台這幾年增加了許多原生能力。過去需要 JavaScript、第三方套件或複雜 Workaround 才能完成的功能，現在可能只需要幾行 HTML 或 CSS。

但模型的訓練資料裡，舊程式碼的數量遠多於採用新寫法的程式碼。當我們要求 Agent 實作對話框、下拉選單、表單驗證或自動調整高度的輸入欄位時，它很可能拿出一套熟悉、可以運作，卻已經不是最佳選擇的解法。

更麻煩的是，Agent 還會模仿專案裡原本的寫法。當既有程式碼充滿 2015 年留下的處理方式，Agent 也可能繼續複製這些習慣。

✨ **Modern Web Guidance 想處理的，正是這個問題。**

## 與其期待模型什麼都記得，不如在需要時提供新知識

Modern Web Guidance 不是另一個模型，也不是單純把一大份前端規範塞進 Prompt。

它是一套提供給 Coding Agent 使用的 Skill。當 Agent 遇到 HTML、CSS、瀏覽器 API、效能或無障礙相關任務時，可以透過 CLI 搜尋符合需求的指南，再把真正需要的實作方式、注意事項與相容策略載入 Context。

大致流程是：

```text
收到網頁開發任務
→ 搜尋相關 Modern Web Guidance 指南
→ 取得符合情境的指南
→ 根據指南實作
→ 執行測試與瀏覽器驗證
```

這個設計的重點，是把容易變動的 Web 平台知識，從模型原本的訓練資料中抽離出來。

模型不必永久記住每一個新 API，而是在工作當下，從目前版本的指南中取得經過整理的指引。當指南更新時，也不需要等待下一代模型重新訓練。

官方目前提供超過 200 種實際使用情境，涵蓋現代 CSS、表單、效能、無障礙、Popover、Dialog、View Transitions 與瀏覽器內建 AI 等領域。這些指南還會考慮 [Baseline](https://web.dev/baseline) 瀏覽器支援程度，以及不支援時應採用的漸進增強或替代方案。[官方入門文件](https://developer.chrome.com/docs/modern-web-guidance/get-started)也說明，若專案沒有指定 Baseline 目標，預設會採用 Baseline Widely available。

所以它不只是告訴 Agent「有一個比較新的 API」，還需要回答另一個更實際的問題：

> 這項功能在我的專案裡，現在是否適合使用？

## 安裝與查詢：讓 Agent 找到需要的指南

最直接的安裝方式，是在專案中執行：

```bash
npx modern-web-guidance@latest install
```

安裝程式會引導你以互動方式，選擇要加入的 Skill。若已經安裝過，可以更新：

```bash
npx modern-web-guidance@latest update
```

Modern Web Guidance 也提供各種 Agent 的安裝方式。例如 Codex 可以透過 Plugin Marketplace 安裝：

```bash
codex plugin marketplace add GoogleChrome/modern-web-guidance
codex plugin add modern-web-guidance@googlechrome
```

Claude Code、GitHub Copilot CLI、Gemini CLI、Antigravity 與其他工具也有各自的 Plugin 或 Skill 安裝方式，完整指令可參考[官方安裝文件](https://developer.chrome.com/docs/modern-web-guidance/get-started)。

安裝完成後，當 Agent 收到適合的前端任務，就能主動搜尋並取得相關指南。

如果只是想先看看裡面有什麼，不安裝也能直接查詢：

```bash
npx modern-web-guidance@latest search "animate a dialog modal backdrop"
```

搜尋結果會提供符合需求的 Guide ID，再透過 `retrieve` 讀取完整指南：

```bash
npx modern-web-guidance@latest retrieve "animate-to-from-top-layer"
```

這也讓 Modern Web Guidance 不只是一套 Agent 工具。開發者自己也能把它當成現代 Web 實作方式的查詢入口。

## `legacy-scan`：先找出專案裡哪些地方值得現代化

Modern Web Guidance 1.0 中，我覺得特別實用的是 `legacy-scan`。

進入專案後執行：

```bash
npx modern-web-guidance@latest legacy-scan .
```

或只掃描特定前端目錄：

```bash
npx modern-web-guidance@latest legacy-scan src/components
```

它會檢查 HTML、CSS、JavaScript、TypeScript、框架元件與 `package.json`，尋找可以被現代 Web 能力取代的舊寫法。

例如：

- 用 JavaScript 讀取 `scrollHeight`，反覆調整 `<textarea>` 高度
- 用 `max-height: 9999px` 製作展開動畫
- 透過 JavaScript 切換父元素 Class，只為了反映子元素狀態
- 使用 `:invalid`，導致使用者尚未操作時就顯示錯誤
- 自行撰寫大量 Popover 或 Dialog 開關邏輯
- 從外部 CDN 載入 Script，卻沒有設定 Subresource Integrity

這些做法不一定已經壞掉。它們甚至可能已經穩定運作了很多年。

問題在於，瀏覽器現在可能已經有 `field-sizing: content`、`:has()`、`:user-invalid`、Popover API 或其他原生能力，可以用更少的程式碼完成相同工作，同時改善效能、鍵盤操作與無障礙體驗。

根據[官方 Modernization Workflow 文件](https://developer.chrome.com/docs/modern-web-guidance/modernization-workflow)，`legacy-scan` 會先以 AST、DOM 與 CSS Parser 在本機進行確定性的掃描，不需要呼叫 LLM，也不消耗模型 Token。掃描結果還會附帶 `keepWhen` 與 `dropWhen` 條件，讓 Agent 閱讀周邊程式碼後，排除刻意保留的 Fallback、已經使用 `@supports` 保護的寫法，或只是長得相似的程式碼。

換句話說，完整流程並不是「搜尋到關鍵字就直接修改」，而是：

```text
legacy-scan 掃描候選位置
→ Agent 閱讀周邊程式碼
→ 排除不適用或刻意保留的寫法
→ 取得對應 Guide
→ 提出修改計畫
→ 完成修改並重新執行掃描與測試
```

這也是為什麼目前沒有 `--fix` 參數。

有些表面上很簡單的現代化工作，實際上可能同時移除 JavaScript Listener、刪除 npm 套件，再把行為搬到 HTML 與 CSS。這類跨層修改仍然需要理解需求、瀏覽器支援範圍與既有測試，並不適合看到結果就全部自動套用。

## 把掃描交給 Agent，先規劃再修改

安裝 Skill 後，不一定要自己執行每一條 CLI 指令，也可以直接向 Agent 描述目標。

我會建議先使用這類提示：

```text
請使用 Modern Web Guidance 檢查這個 Repository。

掃描前端程式碼中的 Legacy Web Patterns，閱讀周邊程式碼並排除不適用的結果。請先整理：

1. 找到的舊寫法
2. 對應的現代 Web 能力
3. 瀏覽器相容性與 Fallback
4. 修改風險
5. 建議的驗證方式

先提出現代化計畫，不要直接修改程式碼。
```

確認結果後，再請 Agent 分批修改：

```text
依照已確認的計畫，先處理低風險項目。

每完成一組修改後：
- 執行既有測試
- 重新執行 legacy-scan
- 檢查鍵盤操作與無障礙行為
- 說明移除了哪些 JavaScript、套件或 Workaround
```

這樣做的好處，是把 `legacy-scan` 當成探索與規劃工具，而不是另一個追求「警告數量歸零」的 Linter。

## 別忘了告訴 Agent，你支援哪些瀏覽器

「使用最新功能」不一定等於「使用最適合專案的功能」。

如果公司產品仍需支援較舊的瀏覽器，Agent 就不能只看到新 API，便把原有 Fallback 全部移除。

Modern Web Guidance 支援以 Baseline 表達專案的瀏覽器相容目標。可以直接在 `AGENTS.md` 或 `CLAUDE.md` 補上：

```markdown
This project's Baseline target is Baseline 2024.
```

也可以寫得更具體：

```markdown
本專案以 Baseline 2024 為目標。

採用 Baseline Newly available 或 Limited availability 功能前，
必須說明瀏覽器支援狀態，並提供漸進增強或必要的 Fallback。
```

這段資訊會影響 Agent 如何選擇功能，以及是否需要保留舊實作。

💡 **現代化的目標不是一律追上最新語法，而是在程式碼大小、效能、無障礙、維護成本與實際瀏覽器支援之間，做出有根據的選擇。**

## 效果與限制：有指南，仍需要驗證

Modern Web Guidance 確實提供了一個值得注意的方向：與其期待模型永遠掌握最新 Web 知識，不如讓 Agent 在工作當下取得可更新、可搜尋，也能接受評測的專業指南。

官方公開的近期評測中，同一批任務加入 Guidance 後，不同 Agent 對現代 Web 最佳實務的通過率都有明顯提升。不過這些是專案自己的評測結果，實際效果仍會受到模型、專案結構、瀏覽器支援政策與驗證方式影響。詳細資料可以在 GitHub Repository 與公開的 [Eval Dashboard](https://googlechrome.github.io/modern-web-guidance-src/) 中查看。

`legacy-scan` 也不是完整的前端健檢工具。目前它只涵蓋約兩成指南，針對其中能透過靜態分析、以較高準確度辨識的舊寫法進行掃描；CI/CD 整合也仍在開發中。

此外，專案會收集匿名使用資訊，包括安裝次數、Agent 名稱、取回的 Guide ID 與 CLI 搜尋內容，但不收集原始使用者 Prompt。若不希望傳送 Telemetry，可以設定：

```bash
export DISABLE_TELEMETRY=1
```

所以更準確的定位不是「安裝之後，Agent 就不會再寫出過時程式碼」，而是：

> 我們終於有一套可以持續更新、實際查詢並接受驗證的機制，降低 Agent 只憑訓練記憶與專案舊習慣寫程式的機率。

## Agent 需要更新的，不只是模型

過去我們談 Coding Agent 的能力，很容易把焦點放在模型版本。

模型升級了，推理更強、Context 更長，產生程式碼的速度也更快。但在快速變動的技術領域，真正決定結果的未必只有模型知道多少，還包括它在工作當下能不能找到正確、適用，而且足夠新的知識。

Modern Web Guidance 示範的，是另一種更新 Agent 的方法：

```text
不必等待模型重新訓練
→ 更新 Skill 與專業指南
→ 在任務發生時載入
→ 用測試與瀏覽器行為驗證
```

我尤其推薦先對既有專案執行一次 `legacy-scan`。

不一定要立刻修改所有結果。先看看專案裡有哪些 JavaScript Workaround，如今已經可以交還給瀏覽器處理。光是這一步，就可能讓我們和 Agent 重新思考那些早已習以為常的寫法。

## 延伸閱讀

💭 [Beyond code generation: Using Modern Web Guidance for continuous developer learning](https://developer.chrome.com/blog/beyond-code-generation)
