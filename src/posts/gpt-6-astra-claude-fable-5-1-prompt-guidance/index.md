---
title: '四個月後，Prompt 已經不只是 Prompt：GPT-6 Astra 與 Claude Fable 5.1 的提示引導差異'
description: '從兩家旗艦模型提示引導，觀察提示設計如何延伸到自主性、任務邊界與工作流治理，並整理跨模型提示策略'
slug: 'gpt-6-astra-claude-fable-5-1-prompt-guidance'
date: '2026-09-05'
drafted: false
featured: false
topic: 'artificial-intelligence'
tags:
    [
        'prompt-engineering',
        'ai-agent',
        'agentic-workflow',
        'context-engineering',
        'gpt-6-astra',
        'claude-fable-5-1'
    ]
authors: ['neil-tsai', 'chatgpt']
---

## 前言

2026 年 5 月 3 日，我寫了一篇〈[OpenAI 與 Anthropic 模型提示引導的差異性](/posts/prompt-guidance-diff)〉。

當時比較的是：

- OpenAI `GPT-5.5`
- Anthropic `Claude Opus 4.7`

那篇文章在「一句話總結」中這樣描述兩者的差異：

> OpenAI：把目標講清楚，讓模型自己選擇。
> Claude：把規格講清楚，讓模型精準照做。

當時這個分類相當實用。

對 GPT 而言，過度指定推理步驟，可能限制模型的判斷空間；對 Claude 而言，提供清楚的背景、限制、格式與範例，通常能讓輸出更加穩定。

不過四個月後，當我重新閱讀 GPT-6 Astra 與 Claude Fable 5.1 的模型提示引導，我認為原本這條分界已經不足以描述文件中的建議。

現在的問題已經不只是：

> Prompt 應該寫得簡短，還是寫得詳細？

而是：

> 當模型可以長時間工作、呼叫工具、修改檔案、委派子代理，甚至在執行途中接受新指令時，我們要如何管理它的自主性、工作範圍與完成條件？

本文參考的是兩家公司提供給 API 與 Agent 開發者的文件。這些內容可以幫助我們理解模型特性，但在 ChatGPT、Claude 等一般聊天產品中，實際表現仍可能受到產品本身的 System Prompt、工具與權限設計影響。

⚠️ 本文依據 2026 年 9 月 5 日核對的文件整理，屬於作者解讀而非模型實測，中文提示範例也經過改寫。

## 一句話總結

如果要重新描述兩者目前的提示引導，我會這樣說：

- GPT-6 Astra：明確定義權限、指令優先順序與完成條件，讓 Agent 知道什麼時候應該繼續行動。
- Claude Fable 5.1：明確定義任務範圍與執行規則，避免 Agent 太早停止，或做出超出需求的工作。

這是我綜合兩份文件後的理解，不是兩家公司對模型的官方定位。

兩者的差異仍然存在，但已經不再是單純的「結果導向」與「規格導向」。

它們正在收斂成同一個方向：

> 把任務、邊界與驗收方式講清楚，再讓 Agent 自己完成中間的工作。

## 四個月前的結論錯了嗎？

作為當時的提示寫作口訣，它有參考價值，但不能視為兩家模型固定不變的能力分類。

過去我們談 Prompt Engineering，通常關心的是單次輸出：

- 回答要多長？
- 要不要使用表格？
- 是否需要提供範例？
- 要不要指定推理步驟？
- 最後應該輸出什麼格式？

而這次閱讀的兩份模型提示引導，合起來涵蓋了另一組問題：

- 模型應該自己做合理假設，還是停下來詢問？
- 使用者已經授權的工作，是否還要再次確認？
- 任務很長時，模型要如何持續完成？
- 工具呼叫能不能平行執行？
- 工作過程中要不要提供進度？
- 對話壓縮時，哪些資訊不能遺失？
- 發現範圍外的問題時，應該順便修正，還是只回報？
- 什麼時候應該搜尋，什麼時候可以依靠模型記憶？
- 驗證與測試應該做到什麼程度？

這些都不是單純的輸出格式問題。

它們是在定義一位 Agent 應該如何工作。

## 提示重點的轉變：不必預先指定每一個步驟

五月時，我把 Claude 形容成一位「很聰明但剛到職的新員工」，需要一份清楚的工作規格。

到了 Claude Fable 5.1，Anthropic 在 [Finish the whole task](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1#finish-the-whole-task) 章節中提到，只要目標清楚，模型可以在沒有太多方法指引的情況下執行很長的任務。

官方特別提醒的問題，反而是它有時會在任務完成前結束回合、只說明接下來要做什麼，或詢問使用者是否要繼續。

OpenAI 對 GPT-6 Astra 的描述也有類似變化。

OpenAI 在 [Introduction](https://developers.openai.com/api/docs/guides/latest-model#gpt-6-astra-introduction) 中提到，當指令留有解釋空間時，Astra 會利用既有 Context 補足一般性的資訊缺口。

到了 [Initiative and follow-through](https://developers.openai.com/api/docs/guides/latest-model#gpt-6-astra-initiative-and-follow-through) 章節，官方進一步指出，它在長時間任務中較能維持連貫性，也更可能在關鍵資訊不足時提出確認問題。

這代表兩者都已經不太需要使用者把所有工作流程寫成：

```text
第一步分析需求
第二步搜尋資料
第三步比較結果
第四步檢查遺漏
第五步產生答案
```

除非執行順序本身就是業務規則或驗收條件，否則模型通常有能力自行規劃。

現在更重要的是告訴它：

```text
要完成什麼？
什麼才算完成？
哪些事情可以自行決定？
哪些事情不能做？
遇到什麼情況才需要詢問？
最後必須提供哪些證據？
```

因此，我的理解是：Prompt 的重點正在從「教模型怎麼思考」，轉向「定義模型的工作責任」。

## GPT-6 Astra：需要管理的是自主性與指令優先順序

GPT-6 Astra 比先前模型更可能在缺少關鍵資訊時提出問題。

這種行為有助於避免模型在重要事項上擅自決定，但也可能造成另一個問題：

> 使用者明明已經要求它完成工作，模型卻停在分析、計畫或確認階段。

OpenAI 因此建議，若產品希望 Astra 更自主地完成工作，可以明確告訴模型：

- 從指令與先前對話推斷使用者意圖
- 對已授權且可逆的工作直接執行
- 不要只提出計畫或下一步
- 持續工作，直到使用者要求的成果真正完成
- 只有在不同答案會實質改變結果時才停下來詢問

另一個值得注意的改變，是 GPT-6 Astra 對 Context 中的指令更加敏感。

OpenAI 在 [Instruction following](https://developers.openai.com/api/docs/guides/latest-model#gpt-6-astra-instruction-following) 章節中表示，Astra 更能遵循較長的指令，但也可能更容易受到 Skills、`AGENTS.md` 與其他檔案中指令的影響。

如果這些規則不清楚或互相衝突，模型可能提早停止工作，或選擇與使用者期待不同的方向。

在現代 Agent 環境裡，模型實際接收到的內容可能包括：

- System Prompt
- User Prompt
- `AGENTS.md`
- Skills
- Tool Description
- 專案文件
- 先前對話
- 其他 Agent 傳回的內容

這些內容全都可能影響模型行為。

因此，OpenAI 建議明確定義使用者要求與 Skill 指引之間的優先順序。當模型因為某項 Skill 或規則停止工作時，也可以要求它指出造成影響的具體指令來源。

這裡可以看到一項明顯改變。

五月時，我們對 GPT 的建議是：

> 把結果講清楚，不要過度控制過程。

到了 GPT-6 Astra，這個原則仍然成立，但還要再補上一層：

> 把授權範圍與指令優先順序講清楚，避免模型因為 Context 中的隱性規則改變方向。

## Claude Fable 5.1：需要管理的是執行行為

Claude Fable 5.1 的文件採取了不同寫法。

Anthropic 沒有只提供一套理想 Prompt，而是整理出開發者在實際執行時可能觀察到的行為：

- 工具呼叫之間沒有顯示進度
- 原本可以平行的工具被逐一呼叫
- 任務還沒完成就結束回合
- 對話壓縮後遺失重要限制
- 額外修改使用者沒有要求的程式碼
- 替小型修改建立過多測試
- 在低 effort 下依靠記憶回答，沒有主動搜尋
- 修改少量內容時重寫整份檔案
- 在較高推理強度下，長篇輸出可能因推理與正文共用 Token 額度而被截斷

這份文件的重點，是針對實際出現的行為偏差進行校準，讓模型的執行方式更符合任務需求。

例如，Claude 可能在完成需求時，順便修改附近的問題或增加額外測試。

Anthropic 在 [Keep changes and tests to what the task asks for](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1#keep-changes-and-tests-to-what-the-task-asks-for) 章節中建議：除非範圍外的問題會讓本次需求無法運作，否則不要一併修改，而是在最後摘要中回報。

可以簡化成：

```text
只完成這次需求需要的修改。

如果發現既有問題，除非它會讓本次需求無法運作，
否則不要一併修改，請在最後摘要中回報。
```

Claude 也可能在長任務中停下來詢問：

```text
要我繼續套用這些修改嗎？
```

如果原始要求已經包含實作工作，這個問題其實沒有必要。

因此，Anthropic 建議在自主工作時，讓模型完成已授權的可逆操作，遇到破壞性操作、範圍變更或缺少只有使用者能提供的必要資訊時再確認。不過，只是在詢問或討論問題，不代表已經授權模型修改。

五月時，我們擔心 Claude 的 Prompt 太短，導致它不知道該怎麼做。

四個月後，我們開始擔心的是：

> Claude 已經很會做了，但它會不會做太多、做到一半停下來，或把時間花在不需要的地方？

## 兩者現在有多像？

| 面向         | GPT-6 Astra                                  | Claude Fable 5.1                                      |
| ------------ | -------------------------------------------- | ----------------------------------------------------- |
| 長任務能力   | 較能在長時間任務中維持連貫性                 | 目標清楚時，可以在缺少方法指引的情況下執行長任務      |
| 常見中斷原因 | 在缺少可能影響結果的資訊時提出確認問題       | 任務未完成便說明下一步，或詢問是否繼續                |
| 自主性調整   | 強調推斷意圖並完成已授權的工作               | 強調完成整個任務，不重複要求許可                      |
| 指令風險     | 容易受到 Skills、規則檔案與其他 Context 影響 | 可能把任務範圍解讀得太廣，增加額外修改                |
| 寫作傾向     | 容易使用較多清單、表格與 Markdown            | 可能段落較長、資訊密度較高，較少主動使用格式          |
| 工具使用     | 支援非同步工具呼叫與執行中的中途引導         | 在部分 Agent 工作流中，可能需要提醒它平行呼叫獨立工具 |
| 推理控制     | 可在對話中調整 reasoning effort              | 以 effort 控制品質、延遲與成本                        |
| 上下文管理   | 重視指令來源與優先順序                       | 重視對話歷史、Thinking Block 與壓縮摘要               |
| 搜尋行為     | 文件未把低推理強度下的搜尋不足列為主要偏差   | 在 `low` effort 下可能較少呼叫搜尋或檢索工具          |
| 驗證行為     | 可能對小型修改執行比需求更廣的測試           | 可能增加超出任務需求的測試或延伸修改                  |

表格整理的是兩份文件各自強調的重點，不是能力排名；某份文件沒有提到一項問題，也不代表該模型不會遇到。

例如，OpenAI 在 [Personality and writing style](https://developers.openai.com/api/docs/guides/latest-model#gpt-6-astra-personality-and-writing-style) 中提醒，Astra 傾向使用清單、表格與 Markdown；Anthropic 則分別在 [Writing density](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1#writing-density) 與 [Formatting in chat](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1#formatting-in-chat) 中指出，Fable 5.1 有時會出現句子較長、段落較密，或較少主動使用標題與清單的情況。

工具使用也有類似差異。

OpenAI 在 [What’s new](https://developers.openai.com/api/docs/guides/latest-model#gpt-6-astra-whats-new) 中介紹 GPT-6 Astra 的非同步工具呼叫與 Mid-turn steering，讓模型在等待工具時仍能處理其他工作，也允許使用者在執行途中補充或修正需求。實際使用仍需產品或執行環境支援。

Claude Fable 5.1 通常也能平行呼叫工具，但 Anthropic 在 [Batch independent tool calls in agent loops](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1#batch-independent-tool-calls-in-agent-loops) 中提醒，在某些程式開發與 Computer Use 工作流裡，模型可能把原本可以平行的工具逐一呼叫。

這些細節顯示，兩者的核心方向已經相當接近。

兩份文件都關心如何避免中途停止，並讓工作留在任務範圍內。

對提示設計而言，值得分別檢查的是模型的預設行為，以及應用程式為它準備的 Agent 執行環境。

## Prompt 不再只是工作說明，而是一份合作契約

過去的 Prompt 比較像工作說明：

```text
請幫我完成這件事，並使用以下格式輸出。
```

現在的 Prompt 更像合作契約：

```text
這次要完成什麼。
什麼結果才算完成。
你可以自行決定哪些事情。
哪些行動需要先取得確認。
遇到範圍外問題時如何處理。
工作過程中如何提供進度。
最後用什麼證據證明工作已完成。
```

這並不表示 Prompt 應該重新變成一份數千字的操作手冊。

相反地，我們應該把不同資訊放回正確的位置：

| 資訊               | 適合的位置                |
| ------------------ | ------------------------- |
| 這次要完成的任務   | User Prompt               |
| 長期合作原則       | System Prompt             |
| 專案特有的限制     | `AGENTS.md`、`CLAUDE.md`  |
| 特定領域的工作方法 | Skill                     |
| 工具如何使用       | Tool Description          |
| 成果應該長什麼樣   | Reference、範例或既有產出 |
| 如何判斷成果正確   | 測試、Rubric、驗收條件    |
| 使用者的長期偏好   | Memory                    |

這張表是本文根據現代 Agent 架構做出的整理，並不是 OpenAI 或 Anthropic 文件中的原表。

它也延續了〈[當繁重的 Prompt 開始礙手礙腳](/posts/why-context-engineering-beats-prompt-engineering)〉的觀點。用本文的話重新整理就是：

> Prompt 不需要扮演整個系統的知識庫，它只需要描述這一次要完成的任務。

## 我們應該如何應對？

### 建立一套跨模型的共同核心

不要替每個模型維護一份完全不同的巨大 Prompt。

可以先建立共同核心：

```markdown
# 任務

這次要完成的工作。

# 期望結果

最終應該交付什麼。

# 範圍與限制

可以修改什麼，以及不能做什麼。

# 完成條件

符合哪些條件才算完成。

# 驗證方式

需要執行哪些檢查，並提供哪些證據。

# 協作方式

什麼情況可以自行判斷，什麼情況必須詢問。
```

這些內容對 GPT-6 Astra 與 Claude Fable 5.1 都適用。

### 只針對模型偏差增加小型補充

如果 GPT-6 Astra 太容易停下來確認，可以補上：

```text
對不影響最終結果的一般細節，請根據現有 Context 做出合理判斷。

只有當不同答案會實質改變成果、範圍或風險時，才停下來詢問。

完成所有已授權且可逆的工作，不要停在計畫或下一步建議。
```

如果 Claude Fable 5.1 容易提早停止或擴大工作範圍，可以補上：

```text
完成原始要求中的整個任務，不要在已授權的步驟前再次詢問是否繼續。

不要修改需求範圍以外的內容；若發現其他問題，請在最後摘要中回報。
```

如果 Claude 在 Agent Loop 中逐一呼叫原本可以同時執行的工具，則可以再加上一條：

```text
彼此不相依的工具呼叫應盡量平行執行。
```

這比複製整份官方提示範例更容易維護，也比較不會讓不同規則互相衝突。

### 不要只測答案，要測整個工作行為

比較模型時，不應只看最後答案寫得好不好。

還應該觀察：

- 是否在不必要的地方詢問使用者
- 是否能把任務完整做完
- 是否擅自擴大修改範圍
- 是否正確使用搜尋與工具
- 是否留下可驗證的成果
- 是否提供足夠但不干擾工作的進度
- 對話變長或壓縮後，是否仍保留重要限制
- 提高推理強度後，品質是否值得增加的成本

Claude Fable 5.1 的文件提醒，不同模型中的 effort 名稱，不代表相同的思考量。

Anthropic 在 [Consider all effort levels](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1#consider-all-effort-levels) 中建議，先從預設的 `high` 開始，再使用自己的評估案例測試 `low`、`medium`、`xhigh` 與 `max`。

文件也在 [Search triggering at low effort](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1#search-triggering-at-low-effort) 中指出，Fable 5.1 在 `low` effort 下可能較少呼叫搜尋與檢索工具，轉而依靠模型記憶回答。

遇到需要即時資訊或精確驗證的任務，可以提高該回合的 effort，或在 Prompt 中明確要求搜尋並確認來源。

GPT-6 Astra 則支援在對話期間調整推理強度，也能透過 Mid-turn steering 在模型工作途中提供修正或新需求。

這表示推理強度與任務方向不一定要在開始前一次決定，而可以隨執行狀況調整。

### 把對話歷史視為系統的一部分

長任務開始普及後，Conversation History 已經不只是聊天紀錄，而是 Agent 的工作狀態。

Anthropic 在 [Keep the conversation history append-only](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1#keep-the-conversation-history-append-only) 中提醒，在 API 使用情境中，部分新帳號已啟用 Claude Fable 5.1 的 Thinking Block（思考區塊）對話綁定檢查。

在這些帳號中，如果修改先前的指令、工具或訊息，再沿用原本的 Thinking Block，可能發生對話不相符的錯誤。

因此，官方建議讓對話歷史保持 Append-only，也就是保留舊內容，將新回合接在後面。若自行壓縮 Context，可以用摘要重新開始後續對話，不沿用舊的 Thinking Block。

Anthropic 也在 [Tell the model what to preserve in compaction summaries](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1#tell-the-model-what-to-preserve-in-compaction-summaries) 中建議，若由應用程式自行產生壓縮摘要，應明確要求保留：

- 使用者提出的要求
- 已經做出的決定
- 被排除的方案及原因
- 尚未完成的工作
- 重要限制與邊界
- 名稱、日期、數字與連結等細節

這提醒我們：當 Agent 能夠執行數十分鐘甚至更長的任務時，Prompt 寫得好不好，只是其中一部分。

對話如何累積、如何壓縮，以及哪些決定能被保留下來，同樣會影響最後結果。

## 真正需要學的，不是新版 Prompt 技巧

四個月前，我們還可以把提示策略簡化成：

```text
GPT：描述好結果
Claude：提供清楚規格
```

四個月後，從這兩份文件的側重來看，我認為這個二分法已經不夠實用。

GPT-6 Astra 的文件強調授權、指令優先順序與自主性設定；Claude Fable 5.1 的文件則指出，目標清楚時，模型可以在較少方法指引下執行長任務。這不表示清楚規格、必要背景與範例已經失去價值。

綜合兩份文件，可以看見它們都在處理同一個核心問題：

> 當模型從回答問題的工具，變成可以持續工作的 Agent，我們要如何讓它自主完成任務，同時留在正確的邊界內？

因此，我們真正需要建立的能力，不是記住某個模型偏好 XML，或另一個模型偏好簡短 Prompt。

而是學會定義：

- 任務
- 權限
- 邊界
- 完成條件
- 驗證方式
- Context 的來源與優先順序

Prompt Engineering 並沒有消失。

只是它不再負責控制模型的每一步，而是成為整套 Agent 工作環境中的其中一個控制點。

## 結論

如果五月時的比喻是：

> GPT 像成熟助理，Claude 像拿著規格工作的新人。

那麼四個月後，我會換成：

> GPT-6 Astra 與 Claude Fable 5.1 都已經像能獨立執行工作的資深協作者，只是兩者需要管理的工作習慣不同。

GPT-6 Astra 需要清楚知道自己擁有多少決定權，以及不同指令之間的優先順序。

Claude Fable 5.1 需要清楚知道任務邊界、何時必須持續執行，以及哪些額外工作不應該順手完成。

模型能力愈強，我們愈不需要告訴它每一步怎麼走。

但我們更需要把一件事說清楚：

> 你被授權完成什麼、做到哪裡，以及要用什麼證明自己真的完成了。

## 參考

💭 [Model guidance: GPT-6 Astra｜OpenAI API](https://developers.openai.com/api/docs/guides/latest-model#gpt-6-astra-guide)

💭 [Prompting Claude Fable 5.1｜Claude Platform Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1)

💭 [OpenAI 與 Anthropic 模型提示引導的差異性｜Thinkin Markdown](/posts/prompt-guidance-diff)

💭 [當繁重的 Prompt 開始礙手礙腳｜Thinkin Markdown](/posts/why-context-engineering-beats-prompt-engineering)
