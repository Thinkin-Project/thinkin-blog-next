---
title: '團隊不缺文件，缺的是一套人與 AI 都讀得懂的知識格式'
description: '從 Open Knowledge Format 看見團隊知識庫的下一步'
slug: 'open-knowledge-format-team-knowledge'
date: '2026-08-16'
drafted: false
featured: true
topic: 'artificial-intelligence'
tags: ['ai-agent', 'context-engineering', 'open-knowledge-format', 'knowledge-management', 'knowledge-as-code']
authors: ['neil-tsai', 'chatgpt']
---

> 內文目前以 OKF v0.2 規格為主，若後續規格有重大更新，本文亦會再找時間同步修正。

## 文件一直都在，只是沒有人找得到

每個團隊多多少少都有自己的知識。系統架構放在文件平台，API 定義留在 Repository，故障處理流程藏在共用雲端硬碟，重要決策則散落在聊天紀錄與幾位資深工程師的腦中。

平常大家還能靠經驗把這些線索拼起來。一旦新人加入、負責人離開，或 AI 代理需要在幾分鐘內理解專案，問題就會浮現：我們不是沒有文件，而是缺少一套能讓不同工具共同辨識、循序讀取，也能判斷可信程度的知識形式。

> 團隊知識真正的瓶頸，往往不是沒有內容，而是內容缺少共同的結構、來源與生命週期。

Open Knowledge Format（OKF）吸引我的地方就在這裡。它看起來只是一組 Markdown 檔案，加上一點 YAML 前置資料；但這個刻意保持簡單的設計，讓知識不再只能困在某個 Wiki、資料目錄或特定 AI 平台裡，而有機會成為人與 AI 都能交換的可攜式產出物。

## 快速理解 OKF

OKF 是一套用來表示知識的開放格式。它把一組知識文件整理成 Knowledge Bundle，每一個知識單元則是一個 Concept。Concept 以 Markdown 撰寫，最上方用 YAML frontmatter 放置可供搜尋、篩選與判斷的結構化欄位。

```text
knowledge/
├── index.md
├── architecture/
│   └── authentication.md
├── apis/
│   └── login.md
├── decisions/
│   └── why-jwt.md
└── runbooks/
    └── auth-outage.md
```

它不是新的資料庫，也不是 RAG framework、Agent framework 或 MCP 的替代品。OKF 不負責規定知識要存在哪裡、如何查詢、誰能存取，也不取代 OpenAPI、Protobuf 等領域專用 Schema。它做的是更底層的一件事：**定義生產者（Producer）與消費者（Consumer）都看得懂的交換格式**。

因此，同一個 Bundle 可以由人手寫、由 Agent 產生，或由既有資料目錄匯出；另一端則可以交給 LLM、搜尋索引、靜態網站、Obsidian、MkDocs，甚至知識圖譜檢視器使用。格式是共同契約，兩端的工具可以各自替換。

## OKF 可以運用在哪些場景？

### 1. 讓 Coding Agent 先讀懂專案

現在不少專案已經有 README.md、AGENTS.md、架構文件、ADR（Architecture Decision Record）與各種開發規範。問題是 Agent 通常不知道該先讀什麼，也不知道哪些文件跟眼前任務有關。

如果把這些知識整理成 OKF bundle，Agent 可以先從根目錄的 index.md 看見全貌，再沿著目錄與 Markdown 連結逐步載入相關 Concept。例如修改登入流程時，只需要讀取 Authentication Service、Login API、User 與 Authentication Outage Runbook，不必一口氣把整個 docs 目錄塞進 Context。

> `index.md` 不只是首頁，也可以成為 Agent 的知識路由層。

### 2. 把新人訓練與跨團隊交接變成可走訪的專案地圖

新人真正需要的通常不是更多文件，而是一張能回答「這個系統由哪些部分組成、彼此如何相連、出了問題要去哪裡查」的專案地圖。OKF 的階層目錄提供基本分類，Concept 之間的 Markdown 連結則補上跨目錄關係。

一份服務文件可以連到它使用的資料表、公開的 API、相關決策與故障手冊。人可以順著連結理解系統，Agent 也能以相同路徑走訪知識。這使得交接不再只是把一個資料夾丟給對方，而是交付一套可以循序探索的脈絡。

### 3. 成為 RAG 前面的標準知識層

許多 RAG 流程會直接把 Notion、PDF、聊天紀錄與程式碼切成片段，轉成向量後放進 Vector Database。檢索也許找得到相似內容，卻不一定知道片段從哪裡來、是否已過期，或有沒有人確認過。

OKF 可以放在來源系統與檢索索引之間，作為經過整理的 Canonical Knowledge Layer。原始資料仍留在原來的系統，OKF 負責保存可讀內容、來源、狀態與關係，Vector Database 則回到「索引」的角色。這不是 OKF 規格要求的唯一架構，而是它很自然的一種應用。

```text
Notion / Docs / GitHub / Database / API
                    ↓
               OKF Bundle
                    ↓
        Search / Vector / Graph Index
                    ↓
             Human / AI Agent
```

### 4. 把知識當成程式碼一起維護

OKF 由純文字檔案構成，因此可以沿用工程團隊熟悉的版本控制、差異比較、Code Review 與 CI。當某個功能修改 API、資料表或營運流程時，Pull Request 也能同時修改相關 Concept。

這會讓「文件更新」從一項最後才想起來的行政工作，變成變更本身的一部分。CI 還可以檢查 YAML 是否可解析、是否缺少 type、保留檔名的結構是否正確，或把斷掉的連結列為提醒。要注意的是，OKF 規格要求消費者容忍 broken link，因此團隊是否要讓 CI 因斷鏈而失敗，仍是自己的治理決策。

### 5. 交付一份不綁平台的知識包

OKF bundle 本質上就是一個目錄，可以放在 Git Repository、壓成 zip 或 tarball，也可以掛載在任何能處理檔案的環境。對顧問交付、跨部門資料產品、開源專案文件或不同 Agent 之間的共享知識而言，這種可攜性很實際。

今天由某個模型產生的知識，明天可以由另一個模型讀取；目前用圖形介面瀏覽，之後也可以改成搜尋引擎或自製 Agent。知識不必因為工具更換而重新設計一次。

## 它的規範其實比想像中小

OKF v0.2 刻意只定義互通所需的最小結構，而不是替所有組織建立同一套知識分類法。這個取捨讓導入門檻很低，也保留了領域擴充空間。

### 一個檔案，就是一個 Concept

每個非保留檔名的 `.md` 檔案都代表一個 Concept。它可以是 API Endpoint、Metric、Playbook、Architecture、ADR，或團隊自行定義的型別。規格沒有中央 type registry，消費者遇到不認識的型別時，仍應把它當成一般 Concept 處理。

```markdown
---
type: API Endpoint
title: Create Order
description: 建立新的客戶訂單。
tags: [orders, api]
status: stable
---

# Overview

建立訂單並回傳訂單識別碼。

# Related Concepts

See [Order Status](../concepts/order-status.md).
```

對一般 Concept 而言，**永遠必填的 frontmatter 欄位只有 type**。title、description、resource、tags，以及 v0.2 的信任與生命週期欄位都是建議或選填。規格也允許生產者自行加入額外欄位。

### index.md 與 log.md 是保留檔名

index.md 用來列出一層目錄裡有哪些內容，支援漸進式揭露（Progressive disclosure）。人或 Agent 可以先看索引，再決定是否繼續打開個別文件。log.md 則用來保存依時間排列的更新紀錄。兩者都不是必須存在，但一旦使用，就要遵循規格所定義的結構。

根目錄的 `index.md` 還可以宣告 `okf_version: "0.2"`。這也是唯一允許 `index.md` 帶有 frontmatter 的位置。

### Markdown 連結讓目錄長成圖

目錄提供 parent／child 的階層，Concept 之間的標準 Markdown 連結則形成跨目錄關係。視覺化工具可以把檔案當成節點、連結當成有方向的邊，畫出知識圖譜。官方 Repository 也附有可把 bundle 產生為單一互動式 HTML 的參考 visualizer。

不過，視覺化不是 OKF 格式本身的內建功能；連結也沒有 depends-on、joins-with 等型別，關係語意要由連結周圍的文字說明。更精細的 typed relationship 仍不是 v0.2 的規範能力。

### 寬容的消費者，才有真正的互通性

OKF 把容錯原則寫進規格。消費者不得因為缺少選填欄位、不認識 type 或額外 key、遇到斷掉的交叉連結，或缺少 index.md，就拒絕整個 bundle。

這代表 OKF 的互通不是要求每個團隊交出一模一樣的文件，而是先建立一個大家都能最低限度理解的邊界。團隊可以逐步增加治理欄位，不需要第一天就完成一套龐大的企業知識模型。

但格式只解決了「讀不讀得懂」，沒解決「信不信得過」。這也是 v0.2 真正想補上的部分。

## AI 寫的知識，究竟要怎麼相信？

如果 OKF 只處理 Markdown 與目錄，它很容易只是另一種文件整理方式。v0.2 真正有意思的地方，是把 provenance、trust、freshness、lifecycle 與 attestation 拉進 frontmatter，讓消費者在讀完整篇內容以前，就能先判斷這份知識的狀態。

### 來源：這份知識從哪裡來？

`sources` 記錄 Concept 所依據的內部或外部素材。每筆來源至少要有 `resource`，也可以帶上穩定的 `id`、`title`、`author`、`usage_count` 與 `last_modified`。若正文要把某個說法精確對應到來源，還可以用與 `sources[].id` 相同的 Markdown footnote key。

OKF 不會替來源計算一個看似精準的可信度分數。author、使用次數與最後修改時間只是客觀訊號，消費者必須依自己的情境判斷。規格特別提醒，usage_count 適合看來源是否仍活躍與趨勢，不適合把不同種類的來源硬排成同一張排行榜。

### 產生與驗證：誰寫的，誰確認過？

generated 記錄目前內容由誰產生、何時有實質變更；verified 則記錄誰曾經拿來源或實際資源確認過內容。兩者分開很重要，因為「誰寫的」和「誰背書」不是同一件事。

```yaml
generated:
    by: docs-agent/gemini-2.5-pro
    at: '2026-08-01T10:00:00Z'
verified:
    - by: human:backend-team
      at: '2026-08-02T09:00:00Z'
```

規格定義三種信任層級：沒有 `verified` 是 `unverified`；只有非人類 actor 驗證是 `machine-confirmed`；只要 `verified` 中包含 `human:<id>`，就是 `human-reviewed`。這些層級是消費者從欄位推導出來的提示，不是存取控制，也不保證內容一定正確。

### 生命週期：它現在還有效嗎？

status 可標示 draft、stable 或 deprecated；若省略，預設視為 stable。stale_after 則是一個絕對日期，當今天等於或晚於該日，內容就被視為過期。

這兩個欄位解決了知識庫最常見的問題之一：文件還找得到，卻沒有人知道能不能繼續使用。對 Agent 而言，找到內容只是第一步；能知道它是否仍為現行版本，才有機會做出穩定判斷。

### Attested Computation：不只相信答案，也確認計算方式

v0.2 還新增 Attested Computation。它適合用在營收、活躍使用者、毛利等不能讓 Agent 臨場發明計算邏輯的情境。Concept 可以宣告 runtime、可填入的 parameters、實際 computation、executor，以及不使用 LLM 的 deterministic attester。

Agent 只能替已宣告的參數提供值，不能自行修改被核准的 computation；執行後產生 receipt，再由 attester 比對實際跑過的內容。這讓「這次數字是否真的依照核准方法算出來」有機會成為機械式檢查，而不是一句模糊的「AI 已驗證」。

但這仍是早期能力。v0.2 尚未規範完整 runtime protocol、attester ABI、沙箱、快取等細節，因此它比較像一份可互通的契約，而不是拿來就能執行的完整計算平台。

## OKF 的優勢，不只是 Markdown 易讀

- 人與 Agent 共用同一份產出物：人可以直接閱讀與修改，Agent 也能解析 frontmatter、沿連結走訪，不必維護兩套知識。

- 可攜、不綁供應商：bundle 是目錄與純文字檔，可以移動、封裝、版本控制，也能被不同模型與工具使用。

- 結構化與敘事並存：需要查詢與篩選的訊號放在 YAML，脈絡、範例、Schema 與說明保留在 Markdown 正文。

- 支援漸進式揭露：index.md 讓消費者先看地圖，再讀需要的 Concept，有助於減少不必要的 Context 載入。

- 適合既有工程流程：Git diff、Review、責任追蹤與 CI 驗證都能直接套用，知識治理不必另起一套陌生流程。

- 自然形成可視化關係：目錄與連結可以被轉成圖形介面，幫助人與 Agent 看見跨文件依賴。

我認為最關鍵的仍是生產者與消費者的獨立性。只要雙方理解 OKF，負責產生知識的工具和負責使用知識的工具就能分開演進。這比「選到哪一套知識庫軟體」更有前瞻性，因為它把知識的所有權留在團隊手上。

## 但不要把 OKF 當成萬靈丹

OKF 提供格式，不提供完整平台。它不會自動替你搜尋、切 Chunk、建立 Embedding、管理權限、解決機密資料外洩，也不會保證有人持續更新內容。即使 verified 顯示 human-reviewed，也只能證明有人確認過，不能替代真正的治理責任。

它也刻意不定義固定的 Concept taxonomy。這帶來彈性，也意味著同一個組織若沒有命名約定，很容易出現 Service、System、Application 三種 type 其實在說同一件事。格式能降低交換成本，無法消除所有語意協調。

更重要的是，OKF 目前仍是 v0.2。官方規格自己列出了尚待後續處理的 runtime protocol、attester portability 與 semantic-layer template。現在很適合小規模實驗，卻還不適合因為一個新規格，就立刻重做整間公司的知識基礎建設。

## 如果要導入，我會從最小版本開始

真正困難的從來不是建立 knowledge 資料夾，而是讓團隊願意持續把可信、可維護的內容放進去。因此，第一階段不需要先打造圖資料庫或複雜 Agent pipeline，只要挑一個文件散落、又會反覆被查詢的專案開始。

```text
knowledge/
├── index.md
├── architecture/
├── concepts/
├── apis/
├── decisions/
└── runbooks/
```

每個 Concept 先統一 type、title、description、tags、status 與 sources，並約定幾個常見正文段落。接著只做三件事：用版本控制管理、讓 Agent 在工作前先讀相關 index、每次變更時同步更新知識。

等內容真的被使用，再依痛點增加 verified、stale_after、自動產生、搜尋索引、視覺化或 Attested Computation。這個順序很重要，因為空的知識庫不會因為架構更完整而變得有價值。

## 團隊知識，應是一種可以帶著走的能力

過去我們常把知識庫想成一個地方：大家把文件搬進去，需要時再打開網站搜尋。OKF 提出的方向不太一樣。知識不只是某個平台裡的內容，而是一組可以被閱讀、驗證、交換與重新組合的檔案。

這也是我覺得它值得關注的原因。當 AI 開始同時成為知識的讀者與作者，我們不能只問「Agent 找不找得到」，還必須問「它找到了什麼、從哪裡來、誰確認過、現在是否仍有效」。OKF v0.2 還沒有把所有問題都解完，卻已經替這些問題建立一套夠簡單、也夠開放的共同語言。

> OKF 真正前瞻的地方，不是替團隊再做一座知識庫，而是讓知識離開任何一座知識庫之後，仍然能被人與 AI 理解。

## 參考

💭 [Introducing the Open Knowledge Format](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing/)：Google Cloud 於 2026 年 6 月發布的 OKF v0.1 介紹與設計原則。

💭 [Open Knowledge Format v0.2 Specification](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)：本文關於 Concept、frontmatter、信任層級、生命週期、連結、合規與 Attested Computation 的主要依據。

💭 [Open Knowledge Format README](https://github.com/GoogleCloudPlatform/knowledge-catalog/tree/main/okf)：官方參考實作、範例 bundles 與 visualizer 說明。

💭 [Open Knowledge Format v0.2 tackles agentic trust](https://cloud.google.com/blog/products/data-analytics/okf-v0-2-adds-trust-signals/)：Google Cloud 對 v0.2 provenance、trust、freshness、lifecycle 與 attestation 的背景說明。
