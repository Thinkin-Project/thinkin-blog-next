---
title: 'E2E 測試不求人，MCP 幫你出張嘴'
description: '運用 Chrome DevTools MCP 協助 E2E 測試'
slug: 'effortless-e2e-mcp'
date: '2026-01-14'
drafted: false
featured: true
topic: 'test'
tags: ['e2e-test', 'mcp']
authors: ['neil-tsai']
---

此篇文章帶大家了解如何運用 **Chrome DevTools MCP 協助 E2E 測試**，有興趣就往下吧！

## 傳統 E2E 測試痛點

- **腳本撰寫繁瑣**：需手動撰寫測試腳本，維護成本高
- **語意不直覺**：測試語句偏技術導向，難以表達真實使用者意圖
- **元素選取脆弱**：DOM 結構稍有變動就會導致測試失敗
- **等待與同步困難**：處理載入、動畫、非同步事件需額外邏輯
- **學習門檻高**：需學習框架語法（如 Cypress、Playwright）與 DOM 操作細節
- **與 AI 不相容**：傳統測試流程無法與 AI Agent 整合，無法語意驅動或即時驗證

## 為什麼傳統 E2E 測試與 AI 不相容？

### 缺乏語意層設計

- 傳統測試框架（如 Selenium、Cypress）是**基於程式語法與 DOM 操作，本就不具備語意解析能力**
- AI Agent（如 Copilot、Claude）是**透過自然語言與使用者互動並依賴語意轉換層將語句轉為具體行為**
- <span style="color: #FF9224;">沒有 MCP 作為橋樑時，AI 就無法理解或執行測試流程</span>

### 缺乏即時回饋管道

- 傳統測試流程是「寫 → 跑 → 看結果」，**無法即時回饋給 AI Agent**
- **AI 無法知道「這個按鈕點了沒」、「頁面跳轉成功沒」，導致無法調整策略**
- <span style="color: #FF9224;">MCP 提供了即時觀察與操作能力，讓 AI 能根據真實結果做出反應</span>

### 測試語句不具語意可解性

- 傳統測試語句如 `cy.get(‘.btn-login’).click()` **對 AI 而言是模糊的**
- **AI 無法理解這段程式碼的意圖，也無法推論其對應的使用者行為**
- <span style="color: #FF9224;">若改為「點擊登入按鈕」，AI 就能透過語意解析 + MCP 執行對應操作</span>

### 驗證邏輯無法語意化

- 傳統斷言如 `expect(page.url()).toContain(‘/dashboard’)`，**AI 難以理解其驗證目標**
- <span style="color: #FF9224;">若能語意化為「確認使用者已進入 dashboard」，AI 就能主動去尋找驗證方式</span>

### 缺乏上下文記憶與推理能力

- 傳統測試是**線性執行，不具備上下文推理**
- **AI Agent 需要知道「前一步登入成功 → 下一步才能點選設定」，這需要上下文感知（Context-Aware）的測試流程**
- <span style="color: #FF9224;">MCP + LLM 可以提供這種語境推理能力</span>

😫 以上痛點，是不是讓你很不想寫 E2E 測試呢？

😤 **但現在，我們真的可以只出張嘴就能測試了。**

## MCP（Model Context Protocol）

### 簡介

- MCP 是一種開放協定，用來讓大型語言模型（LLM）能夠安全地連接外部工具與資料來源。
- MCP 問世大幅減少了需要一直重複造輪子的情境，以往要讓 AI 可以存取外部資料，你可能需要實作函數調用功能（Function Calling Feature），搞得大家的版本都不太一樣，甚至影響後續的維護作業。

![mcp-1](/assets/posts/effortless-e2e-mcp/mcp-1.png)

<center>
    <a href="https://norahsakal.com/blog/mcp-vs-api-model-context-protocol-explained" target="_blank">MCP vs API Model Context Protocol Explained</a>
</center>

### Chrome DevTools MCP

<span style="color: #FF9224;">Chrome DevTools MCP 讓 AI Agent 能夠透過 DevTools 進行真實的網頁操作與除錯。</span>

情境例如：

- **模擬使用者行為**：點擊按鈕、填寫表單、導航頁面。
- **即時驗證程式碼變更**：AI 生成修正後，立即在瀏覽器中驗證效果。
- **分析網路與 console 錯誤**：協助定位 CORS 問題或 JS 錯誤。
- **執行效能追蹤**：分析 [LCP](https://jamespolik.pixnet.net/blog/posts/17346689970)、[CLS](https://jamespolik.pixnet.net/blog/posts/17346689970) 等指標。

### 為什麼 MCP 對自然語言 E2E 測試很重要？

- <span style="color: #FF5151;">傳統 AI Agent 是「盲寫」：只能根據程式碼去<a href="https://www.youtube.com/watch?v=wE3oTZLijsI" target="_blank">預測</a>結果</span>
- <span style="color: #FF9224;">MCP 給了 AI 一雙「眼睛」：能夠看到程式碼執行後的真實效果，大幅提升自然語言指令的準確性與可操作性</span>
- <span style="color: #02C874;">這讓你可以用一句話（例如：「打開首頁並登入」）讓 AI Agent 透過 MCP 操控 DevTools 完成整個 E2E 測試流程</span>

### 技術架構概覽

- **自然語言指令**：使用者以口語或文字輸入操作意圖，例如：「打開首頁並登入」
- **AI Agent 解讀**：LLM 解析語意，理解使用者意圖並規劃操作步驟（例如：導航 → 點擊 → 驗證）
- **MCP 運用**：AI Agent 透過 MCP 與 DevTools MCP Server 溝通，將語意轉換為具體 DevTools 指令，MCP 提供上下文、工具能力、執行環境等資訊，讓 LLM 能安全且準確地操作瀏覽器
- **DevTools 操作**：MCP Server 執行 DevTools API（如 DOM 操作、網頁導航、效能追蹤等），模擬真實使用者行為
- **回傳結果**：DevTools 將操作結果（如頁面狀態、console log、network trace）回傳給 AI Agent，AI 可根據結果進行驗證、調整策略或提出修正建議

<span style="color: #FF9224;">上面這幾步，實際上我們只需要關注<b>自然語言指令</b>就好<del>（怎麼出張嘴就好）</del>。</span>

## 體驗環節

✨ 簡單透過 BMI 計算機 E2E 測試，來感受一下語意驅動的魅力！

我先給你一張圖片：

![bmi-1](/assets/posts/effortless-e2e-mcp/bmi-1.png)

<span style="color: #FF9224;">試想看看，我要怎麼描述給 AI 知道我要測試什麼？</span>

你可能會說：「試試 BMI 計算機」（然後它就會開始亂試了...XD）

<span style="color: #FF5151;">因為對 AI 來說，「試試 BMI 計算機」這樣的描述太模糊了...</span>

我可能會這樣描述：

1. 打開 BMI 計算機（跟它說位址在哪）
2. 輸入身高 170cm
3. 輸入體重 50kg
4. 點擊計算按鈕
5. 確認結果是否為 17.3

<span style="color: #02C874;">如果你的工具設定是正確的情況下，理論上就會照我說的做了！</span>

**如果這樣的測試可行，那是不是其實省去需要了解一個 E2E 測試框架的時間？...**

再試想一下這張圖片：

![bmi-2](/assets/posts/effortless-e2e-mcp/bmi-2.png)

畫面部分有蠻大的變化了，這樣還能以同樣的案例測試嗎？

<span style="color: #02C874;">答案是：可以！</span>

👌 雖然畫面變了，但結構都還在，當然就還能測試～

<span style="color: #FF5151;">但如果今天把「身高」這個欄位移除，測試就會失敗了，這也會符合我們對於案例的預期！</span>

### 實機操作

以 Gemini CLI 為例：

```bash
npm install -g @google/gemini-cli
git clone https://github.com/cdcd72/bmi-calculator-natural-language-e2e.git
cd bmi-calculator-natural-language-e2e
gemini
```

接著透過 `/auth` 指令登入 Google 後，再使用以下提示詞：

> 使用 Chrome，依照 @TestCases.md 進行測試，並且把結果更新在 @TestResults.md 中，填寫結果欄位就好

🔥 接著你就會看到工具開始進行 E2E 測試囉！

## 案例解析

### 案例變遷

有寫過測試的都知道，我們可能會管理一堆 E2E 測試的文件跟腳本（高機率是分開的）。

<span style="color: #02C874;">但如果可以導入文章這樣的測試，其實最終我們只會管理幾份文件且沒有任何腳本。</span>

### 案例介紹

![case-1](/assets/posts/effortless-e2e-mcp/case-1.png)

<center>
    3 個案例
</center>

#### 案例 1

1. 打開 BMI 計算機（跟它說位址在哪）
2. 點擊計算鈕
3. 確認不會顯示任何結果

執行如下：

![case-2](/assets/posts/effortless-e2e-mcp/case-2.png)

<center>
    執行動作：new_page ➡️ take_snapshot ➡️ click
</center>

> AI 總要先到那個頁面，由於瀏覽器還沒打開，故先打開後，接著拍張照，這樣它就知道要點擊哪個按鈕！

#### 案例 2

1. 打開 BMI 計算機（跟它說位址在哪）
2. 輸入身高 170cm
3. 輸入體重 70kg
4. 點擊計算鈕
5. 確認結果是否為 24.2

執行如下：

![case-3](/assets/posts/effortless-e2e-mcp/case-3.png)

<center>
    執行動作：navigate_page ➡️ take_snapshot ➡️ fill ➡️ fill ➡️ click
</center>

> AI 知道瀏覽器已經存在，所以用導頁的方式移動（重置頁面），接著拍張照，這樣它就知道怎麼填寫資料跟點擊哪個按鈕！

#### 案例 3

1. 打開 BMI 計算機（跟它說位址在哪）
2. 輸入身高 170cm
3. 輸入體重 80kg
4. 點擊計算鈕
5. 確認結果是否為 肥胖

執行如下：

![case-4](/assets/posts/effortless-e2e-mcp/case-4.png)

<center>
    執行動作：navigate_page ➡️ fill_form ➡️ take_snapshot ➡️ fill_form ➡️ click
</center>

> AI 知道瀏覽器已經存在，所以用導頁的方式移動（重置頁面），只不過這次 AI 犯了個小錯，沒有先拍張照，就執行了填寫資料的動作，這也就是為什麼 `fill_form` 執行了兩次的原因。

### AI 自動校正特性

<span style="color: #FF9224;">AI Agent 在執行 MCP 指令失敗時，會根據回傳的上下文資訊進行語意重構與策略調整，主動嘗試自動校正並重新執行操作，這讓語意驅動測試具備高度韌性與自我修復能力。</span>

所以這也就是為什麼案例 3，它明明已經錯了，但還能讓測試繼續執行的原因。

<span style="color: #FF5151;">除非這個錯誤是毀滅性的那種，不然原則上都會重試。</span>

### 案例摘要

![case-5](/assets/posts/effortless-e2e-mcp/case-5.png)

AI 測試完後，這還不是結束哦！你總是要追蹤吧？

![case-6](/assets/posts/effortless-e2e-mcp/case-6.png)

這樣未來 AI 才會知道，上次測試的結果是怎麼樣的，進而能夠做出一些額外分析！

### 補充

- 你在寫測試案例時，雖不需要自己處理錯誤邏輯，**但你寫的語句越清晰、越具意圖性，MCP Server 的回饋就越準確**
- MCP Server 是整個語意驅動測試的防撞框架，負責處理語意模糊、執行錯誤、驗證失敗等狀況，**讓你可以專注在「測什麼」而不是「怎麼測」**
- 總言之，**測試案例的描述會很大程度反應最終的呈現結果，如果你特別關注某一種指標（ex. 測試涵蓋率），那你應該就要有相對應的描述在測試案例中，告訴它應該怎麼做，重點是講清楚**

## 延伸應用與未來展望

- **讓非工程角色也能寫測試**：減少測試撰寫門檻，提升測試覆蓋率與跨職能參與度
- **從「執行者」變成「測試設計師」**：AI 不只是執行語句，而是能主動生成測試案例、根據 UI 結構建議驗證點
- **多語系測試與在地化驗證**：可結合 LLM 的翻譯與語意對齊能力，進行跨語系一致性測試
- **語意驅動的測試自動化**：可搭配 Gemini CLI、Codex 等工具，實現語句驅動的測試流程
- **與設計系統或 UX 檢查整合**：AI Agent 可根據設計規範自動檢查 UI 是否符合預期（ex. 無障礙設計）
- **語言即測試介面**：測試不再是「打開測試框架 → 寫腳本 → 執行」，而是「說一句話 → 得到結果」

## 高能提醒

<span style="color: #FF5151;">這類語意驅動測試並不是零成本的方案，但可以透過架構設計與工具選擇來控制花費。</span>

> 我們不一定要把所有測試都語意化，而是挑選最有價值的場景，讓 AI Agent 幫我們省下最難寫、最難維護的那一段。

## 結尾

這樣的測試能不能測試 RWD 情境？

<span style="color: #02C874;">答案是：可以！</span>

那能不能運用在其它情境？

- 驗證使用者登入成功後，是否跳轉至首頁並顯示使用者名稱
- 模擬使用者加入商品至購物車後，驗證購物車內商品與價格是否正確
- 模擬使用者填寫聯絡表單並送出，驗證成功訊息是否顯示
- 切換至英文語系後，驗證首頁標題是否顯示為 "Welcome"
- 點選 FAQ 區塊的問題後，驗證答案是否展開顯示

就等你來揭曉囉～

## 參考

💭 [mcp是什麼？mcp server是什麼？mcp中文、意思、實例一次看懂](https://www.bnext.com.tw/article/82706/what-is-mcp)

💭 [chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp)

💭 [用 Chrome DevTools MCP 快速實現 E2E 自動化 UI 測試](https://www.youtube.com/watch?v=0aalWCXDX8o)

💭 [使用 ADO MCP 搭配 Chrome DevTools MCP 享受 E2E 自動化 UI 測試](https://www.youtube.com/watch?v=KQc7nAEl_Gs)

💭 [有了 Chrome DevTools MCP，AI 再次學會了睜眼說瞎話](https://blog.user.today/ai-automation-browser-mcp-tools/)

💭 [Chrome DevTools MCP vs Playwright MCP - どちらを選ぶべき？実測で比較](https://zenn.dev/nexta_/articles/google-chrome-mcp-server)
