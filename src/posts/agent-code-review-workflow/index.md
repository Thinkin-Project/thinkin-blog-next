---
title: 'Agent 寫得越快，Code Review 越需要重新分工'
description: 'Agent 加快了 PR 產出，也讓 Code Review 成瓶頸。本文整理自動檢查、Agent Review 與人工審查的分工模式'
slug: 'agent-code-review-workflow'
date: '2026-10-12'
drafted: false
featured: true
topic: 'artificial-intelligence'
tags: ['ai-agent', 'agentic-workflow', 'code-review', 'software-engineering', 'software-testing']
authors: ['neil-tsai', 'chatgpt']
---

AI Agent 讓我們產生程式碼、修正問題與建立 Pull Request 的速度越來越快。

但 PR 增加之後，下一個問題很快就浮現出來：

> Agent 可以在幾分鐘內開出 PR，人卻沒有多出幾倍的時間審查。

Matt Pocock 在 [Fixing the PR Bottleneck](https://www.youtube.com/watch?v=LlgiOCmFG_w) 中提到一句很精準的觀察：Agent 讓建立 PR 變得非常容易，卻只讓「建立一個值得審查的 PR」稍微容易了一點。

當程式碼的產出速度超過團隊的理解速度，原本用來確保品質的 Code Review，就會成為整條開發流程的新瓶頸。

解法不是要求人看得更快，也不是再加入一個 Agent，產生更多審查留言。

💡 **真正需要改變的，是我們如何分配檢查、修正與判斷的責任。**

## 要加快流程，首先要有適當的煞車

Matt 將程式碼進入正式環境之前的檢查，分成三層：

1. 自動檢查：測試、Lint、型別檢查與程式碼品質指標
2. 自動化審查：由 Agent 檢查測試沒有涵蓋的問題與程式碼結構
3. 人工審查：由人判斷風險、需求與不可逆的影響

這三層不是重複做相同的事，而是各自處理不同類型的問題。

自動檢查適合驗證有明確標準、可以穩定重複執行的規則。Agent Review 適合閱讀 diff、探索周邊程式碼，找出結構、規範與測試品質上的問題。人則應該把注意力留給需要依靠經驗做出判斷、並承擔決策責任的地方。

💡 **所以這裡的「煞車」，並不是單純讓開發速度慢下來。**

它的作用是提早攔下低品質的變更，避免所有問題最後都堆到人工審查階段。前面兩層處理得越完整，人需要介入的次數就越少。

## CI 全綠，不代表這個 PR 值得合併

自動檢查很便宜，也很適合大量執行，但檢查結果只會回答它真正檢查過的問題。

Agent 很容易產生一些形式完整，實際上卻沒有驗證行為的測試案例。例如程式碼宣告某個限制是 280，測試只是再次確認這個常數等於 280；或者需求是確認兩個區塊在畫面上的順序，測試卻只搜尋原始檔案裡兩段文字出現的位置。

這些測試可能全部通過，卻沒有證明使用者實際看到的行為是正確的。

另一種常見情況，是 Mock 掉太多外部行為。如果測試中的假物件永遠回傳成功，沒有模擬真實 API 可能發生的錯誤，測試自然無法驗證程式是否能正確處理這些失敗情境。

因此，Agent Review 不只是檢查「有沒有測試」，還要繼續追問：

- 測試驗證的是對外行為，還是內部實作？
- 只是重新命名或重構程式碼，沒有改變對外行為，是否仍會讓測試失敗？
- Mock 是否移除了真正需要處理的錯誤？
- 通過這些測試，究竟證明了什麼？

Matt 進一步以 **Deep Module（深模組）**說明，當大量複雜行為被包在一個小而穩定的介面後方，測試就比較容易透過這個介面驗證真正的行為，而不是伸手碰觸模組內部的每一項實作細節。

[原始演講的逐段文字稿](https://ai.engineer/talks/LlgiOCmFG_w-fixing-pr-bottleneck)也收錄了相關案例。

## 實作與遵守規範，不一定要由同一個 Agent 完成

整場分享中，我覺得最值得帶回工作流程的設計，是將實作與審查放進兩個不同的 Context。

負責實作的 Agent，工作本來就包含：

- 探索程式碼，找出需要修改的位置
- 理解需求並完成實作
- 執行自動檢查
- 處理檢查過程中發現的錯誤

這些工作會占用大量 Context。此時再把完整的架構原則、測試策略、命名習慣與 Code Smell 清單全部塞進 `AGENTS.md`，不代表 Agent 就能同時把每件事做好。

Matt 的做法是把 coding standards 放在獨立檔案，例如 `coding-standards.md`，再交給專門的 Review Agent 閱讀。

Review Agent 取得本次 diff 後，只需要進行必要的周邊探索，再根據規範檢查與修正。它不需要重新經歷完整的實作與除錯過程，因此可以把更多注意力放在程式碼品質上。

Matt 因此將程式碼產生拆成兩個階段，讓不同的 Context 各自承擔清楚的責任：

```text
Implement Agent → Make it work
Review Agent → Make it good
```

Matt 將這個過程類比為 Red-Green-Refactor：一個 Context 完成 Red-Green，另一個 Context 負責 Refactor。

⚡ **重點不是期待第一次產出的程式碼就完美，而是設計一個可靠的第二階段，把「可以運作」整理成「值得留下」。**

### 那麼 `AGENTS.md` 應該留下什麼？

Matt 在演講後段提到，Retro 會檢查 Agent 尋找資訊的過程；如果 Agent 不容易找到需要的內容，可以在 `AGENTS.md` 補上 navigation pointers，讓下一次執行更順利。

不過，他沒有明確說明這個 pointer 是否會直接指向 `coding-standards.md`。

我會把這套設計理解為一種漸進式揭露：`AGENTS.md` 負責提供必要的導航與工作流程，詳細規範則等到對應階段，再由負責該階段的 Agent 載入。

例如，`AGENTS.md` 可以保留：

- 專案基本結構與重要入口
- 建置、測試與驗證指令
- 任務執行時不可違反的限制
- 不同文件與 Skill 的使用時機
- 完成實作後應啟動哪一段審查流程

至於完整的 coding standards，則放在審查階段才需要載入的獨立文件。

💡 **`AGENTS.md` 可以是一張工作地圖，讓 Agent 知道何時、去哪裡取得需要的規範。**

如此一來，資訊仍然找得到，卻不會讓每一個 Agent 從任務開始就背負所有內容。

## Review Agent 應該修正問題，不只是留下問題

讓 Agent 自動審查 PR，最直覺的作法是請它留下 Review Comments。

但這可能只是把瓶頸換了一個位置。

當 Agent 產生十幾則冗長留言，人仍然需要逐一閱讀、判斷是否合理，再決定由誰修改。Agent 雖然完成了 Review，卻替人增加另一批待處理事項。

Matt 提出的預設策略更直接：

> 能確定如何修正的問題，就由 Review Agent 直接修改並 Commit；只有無法自行判斷的問題，才留下 Comment。

💡 **Review Agent 的任務，是讓交到人手上的成果更接近可以合併的狀態。**

人不需要等待 Agent 回覆完一長串意見，再充當 Agent 與程式碼之間的傳話者。可以確定的問題先修正，仍有疑慮的地方再留下來討論。

比較理想的流程會是：

```text
Implement Agent 完成修改
        ↓
執行測試、Lint、型別檢查
        ↓
Review Agent 讀取 diff 與 coding standards
        ↓
直接修正可確定的問題
        ↓
整理仍需人工判斷的風險與問題
        ↓
人審查已整理完成的成果
```

如此一來，Agent 在前面處理的是可以被自動化的修正，人看到的是經過整理的 PR，而不是另一份等待處理的待辦清單。

## 人的時間，應該留給回不去的門

不是每一個 PR 都需要相同強度的人工審查。

Matt 使用 **One-way Door（單向門）**與 **Two-way Door（雙向門）**來區分變更風險。

Two-way Door 是容易回復的變更。即使合併後發現問題，也能快速 Revert，而且不會留下難以挽回的外部影響。

One-way Door 則可能涉及：

- 資料遺失
- 難以回復的資料庫遷移
- 大量寄信或外部通知
- 金流與權限變更
- 廣泛且無法立即停止的副作用

程式碼的修改量很小，不代表風險也很小。一行程式碼如果會寄信給六萬名使用者，仍然值得仔細審查。

所以 PR 除了描述「改了什麼」，也應該說明：

- 這項變更是否容易回復？
- 發生錯誤時，影響範圍有多大？
- 有哪些外部副作用無法透過 Revert 消除？
- 哪些地方真正需要人工確認？

Matt 將這類資訊稱為 **Merge Danger**。搭配簡短的虛擬碼、流程圖或時序圖，Reviewer 可以更快理解修改原因與風險，不必先從大量 diff 中自行拼湊全貌。

💡 **人工審查的價值，不在於對每一行程式碼投入相同的注意力，而是優先審查最難回復、影響最廣的決策。**

## Code Review 最後應該改變產生程式碼的系統

當人在不同 PR 裡重複留下相同意見，問題通常不只存在於那幾次實作。

這也代表，先前審查得到的經驗，還沒有被納入產生程式碼的流程。

Matt 提出 [Retro](https://github.com/mattpocock/skills/blob/main/skills/engineering/retro/SKILL.md) 的概念，回頭檢查 Agent Session、PR 與 Review 紀錄，找出可以改善的地方，例如：

- 加入新的自動檢查
- 更新 `coding-standards.md`
- 在 `AGENTS.md` 增加更清楚的導航
- 改善低效率的工具使用方式
- 拆分過度膨脹的指引與 Skill

這背後有一項很實際的原則：

> 同一句 Review 意見，不應該再由人寫第二次。

第一次發現問題時，由人判斷該如何處理，再將這次經驗轉成檢查、規範或工作流程，讓系統能在同類問題再次出現時提早攔下來。

如此一來，人工 Review 不只改善眼前這個 PR，也會讓下一次交到人手上的成果更好。

## 合適的 Code Review，是重新安排注意力

AI Agent 並沒有讓 Code Review 變得不重要，反而讓我們更需要想清楚：哪些問題應該由誰處理。

自動檢查負責穩定且可重複的規則；Review Agent 在獨立 Context 中閱讀規範、檢查結構，並直接修正可以確定的問題；人則負責需求、風險、取捨與不可逆的影響。

這套分工也需要清楚的工作地圖。`AGENTS.md` 提供導航與流程，詳細規範則由對應階段的 Agent 載入，讓每個 Context 都能專注於眼前的責任。

🔥 **讓可重複檢查、能確定如何修正的問題，在抵達人面前就先被處理。**

這是我從 Matt 這場分享中最想帶回工作流程的觀念：在 PR 交到人手上之前，先完成能自動化的檢查與修正，再把人的注意力留給需求、風險與取捨。

## 參考

💭 [Fixing the PR Bottleneck — Matt Pocock, AIHero](https://www.youtube.com/watch?v=LlgiOCmFG_w)

💭 [Fixing the PR Bottleneck：演講逐段文字稿](https://ai.engineer/talks/LlgiOCmFG_w-fixing-pr-bottleneck)

💭 [EP412 - Matt Pocock 怎麼 Code Review？解決海量 PR 的五個心法](https://www.youtube.com/watch?v=T-5FW3KRpgI)
