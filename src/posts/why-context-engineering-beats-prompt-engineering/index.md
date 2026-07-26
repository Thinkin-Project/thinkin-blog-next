---
title: '當繁重的 Prompt 開始礙手礙腳'
description: '從 Claude 5 看 Prompt Engineering 如何走向 Context Engineering'
slug: 'why-context-engineering-beats-prompt-engineering'
date: '2026-07-26'
drafted: false
featured: true
topic: 'artificial-intelligence'
tags: ['agentic-workflow', 'context-engineering', 'prompt-engineering']
authors: ['neil-tsai', 'chatgpt']
---

過去幾年，我們一直相信一件事：

> Prompt 寫得越完整，AI 的表現就會越穩定。

- 模型容易漏掉步驟，就補上一條規則。
- 模型產生不符合期待的程式碼，就加入更多限制。
- 模型不知道怎麼使用工具，就提供幾組完整範例。

最後，原本只有幾十行的 Prompt，開始逐漸變成一份龐大的操作手冊：

```text
You are ...

Never ...

Always ...

If ...

Else ...

Remember ...

Here are some examples ...
```

**這種做法在早期模型上確實有其必要性。**

🔒 當模型的判斷能力不足時，我們必須透過更明確的規則、範例與限制，縮小它可能採取的行動範圍。

🔓 但是，當模型能力持續提升，這些過去用來協助模型的內容，也可能反過來成為限制。

**Anthropic 的觀察：** 在 [The new rules of context engineering for Claude 5 generation models](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models) 中，他們提到為 Claude Opus 5、Claude Fable 5 等新一代模型刪除了 Claude Code 超過 80% 的 System Prompt，卻沒有在程式開發評測中觀察到很明顯的退步。

這並不只是一次 Prompt 瘦身。

它更像是在提醒我們：

> 隨著模型能力改變，設計 AI 工作方式的方法也必須跟著改變。

過去有效的繁重 Prompt，到了新一代模型上，可能不只沒有幫助，甚至開始礙手礙腳。

## Prompt 為什麼會從幫助變成干擾？

🚧 在早期的模型中，規則的主要作用是避免最糟糕的結果。

例如，不要隨意刪除檔案、不要產生冗長註解、不要在沒有要求的情況下新增文件。

這些限制可以降低模型失控的可能性。

**但當規則不斷累積，不同來源的指令也可能開始互相衝突。**

System Prompt 可能要求：

```text
不要加入多行註解。
```

Skill 可能要求：

```text
為複雜邏輯補上完整文件。
```

使用者則可能希望：

```text
請把這段程式碼解釋清楚。
```

💥 **每一條指令單獨來看都有道理，但放在同一個 Context 裡卻可能彼此拉扯。**

**Anthropic 的觀察：** 他們也在內部使用紀錄中發現，System Prompt、Skills 與使用者要求，可能同時對文件與註解提出衝突的指示。Claude 通常仍能推斷使用者意圖，但必須花費更多判斷成本處理重疊或矛盾的訊息。

換句話說，繁重 Prompt 的問題不只是消耗更多 Token。

更大的問題是：

> 它會增加模型需要處理的規則密度，讓真正的任務被淹沒在大量指令之中。

看完 Anthropic 提出的改變後，我認為可以將它們整理成三個核心思想。

## 一、不要把所有決策都寫成規則

> 第一個改變，是從「控制模型」轉向「讓模型判斷」。

### 過去：用明確規則約束模型

**Anthropic 的做法：** 早期 Claude Code 的 System Prompt 曾經對程式碼註解提出非常具體的限制，例如預設不要撰寫註解、不要產生多段 Docstring，也不要在沒有要求時建立規劃或分析文件。

這類規則的優點很明顯。

它可以避免能力較弱的模型：

- 產生大量無意義註解
- 建立不必要的文件
- 過度擴張任務範圍
- 用形式上的完整掩蓋實作問題

但這些規則並不適用於所有情境。

複雜的演算法可能真的需要多行說明；某些專案本身也可能非常重視文件；使用者甚至可能明確要求補上設計決策。

**Anthropic 的做法：** 他們對新模型採取了更簡單的指示：

```text
Write code that reads like the surrounding code:
match its comment density, naming, and idiom.
```

也就是：

> 讓產出的程式碼符合周圍既有程式碼的註解密度、命名方式與慣用寫法。

這個改變看似只是縮短一句 Prompt，背後卻代表完全不同的設計思維。

過去是：

```text
告訴模型每一件不能做的事情。
```

現在則是：

```text
提供判斷原則，讓模型根據實際 Context 決定。
```

**Anthropic 的觀察：** 新一代模型已經具備更好的判斷能力，不再需要過去為了避免最糟情況而加入的所有限制。

**但也不代表所有規則都應該刪除。**

涉及安全、權限、資料破壞或法規要求的限制，仍然需要明確而強制的邊界。

但對於程式風格、註解密度、文件形式這類高度依賴情境的問題，過度具體的規則可能不如一個清楚的判斷原則。

### 過去：用大量範例教模型操作

相同的變化，也出現在工具使用上。

過去常見的做法，是為 Tool 提供多組 Few-shot 範例：

```text
當使用者要求 A，請這樣呼叫工具。

當使用者要求 B，請這樣填入參數。

當使用者要求 C，請依照以下順序執行。
```

這對早期模型很有幫助，因為範例可以示範預期行為。

**Anthropic 的觀察：** 對較新的模型而言，範例也可能把模型限制在既有的探索空間之中。

模型容易模仿範例，而不是理解工具真正能表達的能力。

**因此，設計重點開始從「提供更多範例」轉向「設計更清楚的介面」。**

例如，與其透過數個範例說明待辦事項的生命週期，不如直接讓工具參數明確表達：

```text
status:
- pending
- in_progress
- completed
```

再補上一條必要的行為限制：

```text
同一時間只能有一個項目處於 in_progress。
```

一個好的介面，本身就在向模型說明：

- 有哪些能力
- 可以傳入哪些資訊
- 狀態之間有什麼關係
- 哪些操作受到限制

因此，對新一代模型而言：

> 好的 Tool 介面，可能比大量 Few-shot 範例更有價值。

這兩個改變其實指向同一個方向：

| 過去               | 現在                       |
| ------------------ | -------------------------- |
| 用規則窮舉可能情境 | 提供原則，讓模型判斷       |
| 用範例示範固定操作 | 用介面表達工具能力         |
| 縮小模型的行動空間 | 提供足夠資訊讓模型自行選擇 |

也就是說，我們不再試圖把所有決策預先寫進 Prompt。

## 二、不要把所有資訊一次塞進 Context

> 第二個改變，是從「一次提供全部資訊」轉向「需要時再載入」。

這也是上下文工程（Context Engineering）中很重要的**漸進式揭露（Progressive Disclosure）**。

### 按需載入：不要一開始提供所有內容

以前，我們擔心模型找不到資訊，因此傾向把所有規範集中放進 System Prompt、CLAUDE.md 或單一 Skill：

```text
System Prompt
├── 程式碼撰寫規範
├── Code Review 流程
├── 測試規範
├── 安全檢查
├── Git 流程
├── 部署方式
└── 錯誤處理方式
```

**問題是，一次任務通常不需要使用全部內容。**

修改一個按鈕樣式時，不一定需要載入完整的部署流程。

修正文件錯字時，也不需要理解所有資料庫移轉規則。

這些資訊雖然可能有用，卻不一定對目前任務有用。

**Anthropic 的做法：** 他們過去將 Code Review 與驗證流程直接放在 Claude Code 的 System Prompt 中，因為這些資訊在需要時非常重要；後來則將相關內容移到獨立 Skills，讓 Claude 在適合的時機選擇性載入。

新的流程更接近：

```text
接收任務
   ↓
判斷目前需要什麼資訊
   ↓
載入對應的 Skill 或工具定義
   ↓
完成任務
```

這就是漸進式揭露：

> 不要因為資訊未來可能有用，就在一開始全部提供；而是在資訊真正需要時，再把它加入 Context。

### 讓資訊回到正確的位置

漸進式揭露其實不只適用於 Skills。

**Anthropic 的做法：** 他們也將這種做法應用在工具上。

部分 Tool 會採用延遲載入（Deferred Loading）。模型一開始只知道工具存在，需要使用時，再透過搜尋取得完整定義。

這讓 Agent 可以擁有更多工具，而不需要讓每一個工具的完整 Schema 從任務開始就佔用 Context。

相同概念也能套用在專案文件中。

與其建立一個巨大的 CLAUDE.md：

```text
CLAUDE.md
└── 收錄所有專案知識與操作流程
```

更合適的方式可能是建立一套可以按需探索的文件結構：

```text
CLAUDE.md
├── 專案定位
├── 重要限制
└── 延伸指引
    ├── testing.md
    ├── verification.md
    ├── database.md
    └── deployment.md
```

CLAUDE.md 負責告訴模型：

- 這是什麼專案
- 有哪些重要陷阱
- 其他資訊可以去哪裡取得

詳細規則則留在對應文件或 Skill。

**Anthropic 的建議：** CLAUDE.md 應保持輕量，簡短說明 Repository 的用途，把主要篇幅留給模型無法從檔案系統直接推論的特殊狀況與陷阱。若有多項驗證規則，可以建立 Verification Skill，再從 CLAUDE.md 指向它。

因此，CLAUDE.md 不需要重複告訴模型：

```text
這個專案使用 React。
套件放在 node_modules。
原始碼位於 src。
```

這些資訊通常可以直接從專案看出來。

真正值得保留的是：

```text
這個資料夾由程式自動產生，不要手動修改。

這個專案的型別必須集中放在指定檔案。

測試必須透過特定容器執行。

這個舊 API 雖然看似多餘，但仍有外部系統依賴。
```

一句話總結就是：

> 不要描述模型看得到的事情，而要補充模型看不到的事情。

### 避免在多個位置重複同一條規則

早期模型有時更容易注意 Context 尾端的指令，因此同一項工具說明可能同時出現在：

- System Prompt
- Tool Description
- 操作範例
- 任務尾端提醒

這種重複，在過去可能有助於提高遵循率。

但它也增加了維護成本。

**只要其中一處更新、其他位置沒有同步，就可能產生互相矛盾的版本。**

**Anthropic 的觀察：** 新模型已經不再需要這些重複內容，因此可以把工具的使用方式放回 Tool Description，並從 System Prompt 移除重複指示。

過去：

```text
System Prompt：如何使用 search 工具
Tool Description：如何使用 search 工具
Few-shot：再次示範 search 工具
```

現在：

```text
Tool Description：完整而清楚地說明 search 工具
```

這不只縮短 Context，也讓每項資訊有更清楚的歸屬。

## 三、讓 Context 各自回到適合的位置

> 第三個改變，是重新理解 Prompt 在 AI 系統中的位置。

以前，我們常把 AI 的運作方式想成：

```text
Prompt
   ↓
Language Model
```

**因此，只要 AI 做得不好，第一個反應就是修改 Prompt。**

但在現代 Agent 中，模型真正接收到的資訊可能來自許多不同來源：

```text
System Prompt
     │
     ├── User Prompt
     ├── CLAUDE.md
     ├── Skills
     ├── Memory
     ├── Tool Definitions
     ├── Reference Files
     ├── Artifacts
     └── Conversation History
              │
              ▼
        Language Model
```

**Anthropic 的定義：** 他們將這整套組裝與管理模型輸入資訊的過程稱為 **Context Engineering**。Prompt 只是其中一小部分，實際 Context 還包含 System Prompt、Skills、CLAUDE.md、Memory 與其他來源。

這也解釋了另外兩項改變：Auto-memory 與 Rich References。

### 過去：把 Memory 寫進 CLAUDE.md

過去 Claude Code 鼓勵使用者透過一些捷徑，把需要記住的內容寫入 CLAUDE.md。

這讓 CLAUDE.md 同時承擔：

- 專案說明
- 操作規則
- 使用者偏好
- 工作記憶
- 歷史資訊

久而久之，檔案很容易持續膨脹。

**Anthropic 的做法：** 現在，Claude 可以自動保存與工作及使用者相關的 Memory，不再需要將所有長期資訊手動塞進 CLAUDE.md。

這代表不同資訊可以回到更適合的位置：

| 資訊                  | 適合的位置       |
| --------------------- | ---------------- |
| Repository 的重要限制 | CLAUDE.md        |
| 特定領域的操作方式    | Skill            |
| 工具的使用方法        | Tool Description |
| 使用者的長期偏好      | Memory           |
| 目前任務的要求        | Prompt           |
| 詳細規格與驗收依據    | Reference        |

**Prompt 不需要再扮演整個系統的知識庫。**

### 過去：只提供文字規格

另一個重要變化，是 Reference 不再局限於簡單的 Markdown 規格。

過去，Plan Mode 通常會產生 Markdown 計畫，長期任務也常把需求寫成規格文件。

這些做法仍然有價值，但新一代模型已經能處理更豐富的參考資料，例如：

- HTML Artifact
- 可執行的測試案例
- 另一個 Codebase 中的既有函式
- UI Mockup
- 評分 Rubric
- 完整程式碼實作

**Anthropic 的觀察：** Reference 可以直接是程式碼。規格可能是一組詳細測試，也可能是另一個程式庫中準備移植的函式；Rubric 則可以提供驗證 Agent 判斷品質的依據。

這帶來一個很重要的改變。

與其花大量文字描述：

```text
這個頁面左側有選單，
右側有三張卡片，
卡片之間保持固定距離，
標題使用較大的字體……
```

**有時直接提供一份 HTML Mockup，會比長篇自然語言更精確。**

**Anthropic 的建議：** 在適合的情境下優先提供程式碼形式的 Reference；例如 HTML Mockup 往往比單純的設計描述或截圖，能提供更清楚且高還原度的指示。

這與 Artifact-driven Workflow 的概念相當接近：

> 與其只透過文字描述成果，不如提供一個模型可以檢查、修改與驗證的具體產物。

Reference 的價值，不只是補充 Context。

它也可以成為模型工作時的：

- 目標
- 範例
- 規格
- 驗收依據

## 從 Prompt Engineering 到 Context Engineering

把前面的改變放在一起，可以看到一條相當清楚的演進路線。

### 第一階段：用 Prompt 控制模型

```text
更多規則
更多限制
更多範例
更多提醒
```

目的是縮小模型可能犯錯的空間。

### 第二階段：把資訊拆到不同元件

```text
Prompt
Skills
Memory
Tools
References
CLAUDE.md
```

每一種 Context 負責不同類型的資訊。

### 第三階段：在正確的時機組裝 Context

```text
理解任務
   ↓
判斷需要哪些資訊
   ↓
載入對應的 Skill、Tool 與 Reference
   ↓
執行與驗證
```

這時真正需要設計的，已經不再只是 Prompt 的內容。

而是：

> 模型應該在什麼時間，取得什麼資訊，以及這些資訊應該由哪個元件負責。

這就是 Context Engineering 與傳統 Prompt Engineering 最明顯的差異。

## 這對 Agent 架構意味著什麼

Hook、Skill、Subagent、Memory、Tool、Reference，以及 Planner 與 Executor，看似是不同工具的新功能，但本質上都在做同一件事：把固定流程、可重用知識、長期偏好、操作能力與驗收依據，交給最適合的元件管理。

整體架構因而從「巨大 Prompt 直接交給 Model」，逐漸變成：

```text
Planner
   ↓
Context Loader
   ↓
Skills / Memory / Tools / References
   ↓
Executor
   ↓
Verification
```

Prompt 並沒有消失；它只是重新回到更適合自己的位置：

> 描述這一次要完成的任務。

## 所以，繁重 Prompt 已經沒用了嗎？

也不能這麼說。

在以下情境中，明確 Prompt 仍然非常重要：

- 任務具有嚴格的輸出格式
- 涉及安全、權限或破壞性操作
- 必須遵循法規或公司政策
- 模型無法自行取得必要資訊
- 使用的模型判斷能力較弱
- 任務需要高度可重現的固定流程

真正需要重新檢查的，不是「Prompt 還要不要寫」。

而是：

> 這項資訊真的應該放在 Prompt 裡嗎？

如果是一項固定且必須執行的流程，可能更適合交給 Hook。

如果是一套可重用的領域知識，可能更適合放進 Skill。

如果是長期偏好，可能應該交給 Memory。

如果是驗收條件，可能應該寫成測試或 Rubric。

如果是工具操作方式，則應該由 Tool 介面自己說清楚。

只有當這項資訊確實屬於目前任務，它才需要出現在 Prompt 裡。

## 結語

很多人看到 Anthropic 刪除超過 80% System Prompt，可能會得到一個簡單的結論：

> Prompt 越短越好。

但我認為，這並不是文章真正想表達的事情。

真正的重點是：

> 隨著模型能力提升，過去用來彌補模型不足的規則、範例與重複提醒，可能不再具有相同價值。

我們不需要盲目追求更短的 Prompt。

而是應該更仔細地設計：

- 哪些決策可以交給模型判斷？
- 哪些資訊應該需要時再載入？
- 哪些知識應該移到 Skill？
- 哪些流程應該交給 Hook？
- 哪些偏好應該由 Memory 保存？
- 哪些要求可以直接用 Reference、測試或 Artifact 表達？

Prompt Engineering 並沒有消失。

只是當 AI 從單次問答逐漸走向 Agent，Prompt 已經不再是整個系統的中心。

未來真正值得投入心力的，不是讓 Prompt 持續變長，而是：

> **讓模型在正確的時間，取得正確的 Context。**

這才是 Context Engineering 真正想解決的問題。
