---
title: 'llms.txt：網站正在從 Human-first 走向 Human 及 Agent-first'
description: '分析 AI 時代網站架構正在如何的被改變'
slug: 'llms-txt-human-agent-first-web'
date: '2026-05-17'
drafted: false
featured: true
topic: 'artificial-intelligence'
tags: ['ai-agent', 'website', 'llms-txt']
authors: ['neil-tsai']
---

最近如果有在關注 AI、開發者工具或技術文件，應該多少都看過 `llms.txt` 這個東西。

很多人會用一句話介紹它：

> `llms.txt` 是給 AI 的 `robots.txt`。

這個說法不能算錯，但其實只講到表面。

`robots.txt` 是告訴爬蟲哪些地方能不能爬，`sitemap.xml` 是告訴搜尋引擎網站有哪些頁面，而 `llms.txt` 更像是網站主動提供給 AI 的「閱讀入口」：哪些內容重要、哪些文件值得優先看、這個網站到底是做什麼的。

它真正值得注意的地方，不是檔案格式，而是它背後代表的訊號：

✨ **網站正開始從 Human-first，逐漸走向 Human 及 Agent-first**

## llms.txt 是什麼？

`llms.txt` 是一個放在網站根目錄的文字檔：

```txt
https://example.com/llms.txt
```

通常會使用 Markdown 撰寫，內容可能長這樣：

```md
\# Product Name

簡短介紹這個網站或產品。

\#\# Docs

- [Getting Started](https://example.com/docs/start.md)
- [API Reference](https://example.com/docs/api.md)

\#\# Examples

- [Example Apps](https://example.com/examples.md)
```

它的目的不是取代網站，而是提供一份內容入口：

- 更乾淨
- 更精簡
- 更容易被 AI 理解

❗ **換句話說，它不是給人類看的，而是給 AI 看的內容**

## 為什麼會出現這東西？

因為 AI 其實很不擅長閱讀現代網站。

🔥 **不是 AI 能力不夠，而是現代網站本來就不是為了 AI 設計的**

現在的網站通常包含：

- 大量 JavaScript
- SPA Hydration
- 追蹤腳本（ex. Google Analytics）
- 廣告
- 五花八門的結構

👀 **人類可以透過視覺快速忽略這些東西**

⚡ **但對 AI 來說，它們全都是 token，真正有價值的內容，可能只佔整個頁面的 5%**

AI 在讀網站時，很容易遇到大量像這樣的內容：

```html
<div class="container___x92asd"></div>
```

💸 **這些東西對人類沒影響，但對 Context Window 是實際成本**

而且 AI 使用網站的方式，也跟人類不同。

人類會：

- 看畫面
- 點選單
- 掃視覺層級
- 自己判斷哪些資訊重要

但 AI 更需要的是：

- 這網站是做什麼的？
- 哪些文件最重要？
- 哪份是標準來源（Canonical Source）？
- 哪份文件最值得引用？
- 哪些內容是最新版本？

於是 `llms.txt` 的核心思想就出現了：

💡 **不要讓 AI 自己猜哪些內容重要，而是由網站主動提供一份 AI-friendly 的入口**

## 這東西真正的價值在哪？

很多人把 `llms.txt` 當成 SEO 延伸，但它真正的價值其實更接近：

### 網站層級的提示工程

因為它本質上是在幫 AI：

- 降低檢索雜訊（Retrieval Noise）
- 壓縮上下文（Context）
- 建立資訊層級（Hierarchy）
- 指向權威來源（Authoritative Source）

這件事很重要。

未來 AI 代理在使用網站時，很可能不會從首頁開始理解產品，而是：

```txt
1. 先讀 llms.txt
2. 找重要文件
3. 找 API 參考
4. 找範例
5. 建立上下文
```

這代表網站開始出現兩層結構：

```txt
Human-facing Website
Agent-facing Entry
```

這才是 `llms.txt` 真正有趣的地方。

它不是單純的文字檔，而是：

> **網站開始出現「AI-readable Layer」的早期跡象**

但這裡要先冷靜一下。

🔧 **支援的現狀**

目前 `llms.txt` 還不是正式 Web 標準，也沒有被所有主流 AI 平台正式全面採用。

它現在比較像：

- 社群提案
- 開發者慣例
- AI-friendly 文件實驗方向

不過已經有一些大型 AI 平台開始提供自己的 `llms.txt` 或類似入口。

例如：

- OpenAI（ex. [OpenAI API docs](https://developers.openai.com/api/docs/llms.txt)）
- Anthropic（ex. [Anthropic Developer Documentation](https://platform.claude.com/llms.txt)）

都已經提供更容易被 AI 閱讀的文件入口。

這代表：

> 即使 `llms.txt` 本身未必成為最終標準，「AI-readable Layer」這件事已經開始成形。

所以真正值得關注的，不是：

> `llms.txt` 會不會變成標準？

而是：

> 未來網站是否需要 AI-readable Layer？

這兩件事其實不一樣。

## Human-first 正在變成 Human 及 Agent-first

我認為這才是整件事最重要的地方。

過去的網站，本質上是：

```txt
HTML → Browser → Human
```

網站設計的核心問題是：

- 人怎麼看？
- 人怎麼點？
- 人怎麼搜尋？
- 人怎麼理解資訊？

---

但 AI 代理出現後，網站不再只面對人類。

開始也要面對：

- LLM
- AI 助理
- 程式碼撰寫代理
- 瀏覽器代理
- 自動化系統

於是網站開始變成：

```txt
Content → Agent → Human
```

這會改變很多事情。

例如：

- 文件架構
- SEO
- 元資料
- API 可發現性
- 內容建模
- 資訊層級

以前網站只需要：

> Human-readable

未來還會需要：

> Agent-readable

這其實是很大的轉變。

## 對工程師真正有價值的是什麼？

如果你是工程師，那真正該思考的事情，不是：

> 我要不要加一個 llms.txt？

而是：

> 我的產品能不能被 AI 正確理解？

這會影響很多東西。

## 入口內容是否乾淨？

如果你的內容：

- 版本混亂
- 標準來源不清楚
- 範例太少
- 導航太深
- HTML 雜訊過高

那 AI 很容易讀錯。

> AI 吃到垃圾，就只會吐出垃圾。（你還妄想可以變黃金？不可能 😅）

## Markdown 會越來越重要

這也是為什麼：

- Docs-as-code
- MDX
- README-first
- Knowledge Base

會越來越重要。

因為 Markdown 對：

> 人類可讀，AI 也友善

## 結構化內容也會越來越重要

未來網站可能不只需要：

> 漂亮 UI

還需要：

> 可被 AI 結構化理解

例如：

- 問答
- 範例
- API 結構
- 更新日誌
- 功能描述

都會變得更重要。

## GEO（Generative Engine Optimization）

以前網站競爭的是：

> 誰在 Google 排名比較前面

未來可能會慢慢變成：

> 誰比較容易被 AI 正確引用

這其實是完全不同的問題。

## llms.txt 也可能只是過渡產物

我不確定 `llms.txt` 最後會不會變成正式標準。

它可能：

- 被搜尋引擎整合
- 被瀏覽器標準化
- 被 AI 平台自訂格式取代

但它提出的問題不會消失。

因為網站正在慢慢從：

> 給人看的網站

變成：

> 給人與 AI 一起使用的系統

而 `llms.txt` 的真正意義，其實不是那個文字檔本身。

而是它第一次很明確地讓大家開始思考：

> 如果網站也要給 AI 使用，那網站應該長什麼樣子？

這才是它真正重要的地方。

## 結語

`llms.txt` 表面上看起來只是個小規格。

但它背後反映的，其實是整個網站生態正在改變。

未來網站不只需要：

- 被搜尋引擎索引
- 被人類閱讀

還需要：

- 被 AI 理解
- 被 AI 引用
- 被 AI 正確操作

而這種從 Human-first 走向 Human 及 Agent-first 的轉變，可能才是 AI 時代網站最值得注意的事情之一。

## 參考

💭 [The /llms.txt file](https://llmstxt.org)
