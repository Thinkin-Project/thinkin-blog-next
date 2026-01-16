# Thinkin Markdown Blog

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

一個使用 SvelteKit 5 建構的現代化個人技術部落格，專注於軟體開發經驗與知識分享。

![demo](/img/demo.png)

## 技術架構

- **框架**: [SvelteKit](https://svelte.dev/docs/kit) + [Svelte 5](https://svelte.dev/)
- **樣式**: [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn-svelte](https://www.shadcn-svelte.com/)
- **內容**: [MDsveX](https://mdsvex.pngwn.io/) (Markdown + Svelte)
- **語法高亮**: [Shiki](https://shiki.matsu.io/)
- **搜尋**: [Fuse.js](https://fusejs.io/)
- **留言系統**: [Giscus](https://giscus.app/)
- **建置工具**: [Vite](https://vite.dev/)
- **套件管理**: [pnpm](https://pnpm.io/)

## 功能特色

- 🌙 深色/淺色主題切換
- 🔍 全站快速搜尋 (Ctrl+K)
- 📑 文章目錄 (Table of Contents)
- 🏷️ 主題分類與標籤系統
- 💬 Giscus 留言整合
- 🔒 隱私權政策頁面
- 🍪 Cookie 同意管理
- ☕ 贊助功能 (Ko-fi)
- 📖 閱讀進度條
- 📱 響應式設計
- 🔗 社群分享按鈕
- 📡 RSS Feed
- 🗺️ Sitemap

## 開始使用

### 環境需求

- Node.js 20+
- pnpm 10+

### 安裝

```bash
# 複製專案
git clone https://github.com/Thinkin-Project/thinkin-blog-next.git
cd thinkin-blog-next

# 安裝依賴
pnpm install

# 複製環境變數範例
cp .env.example .env
```

### 開發

```bash
pnpm dev
```

開啟瀏覽器前往 `http://localhost:5173`

### 建置

```bash
pnpm build
pnpm preview
```

### 部署

#### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FThinkin-Project%2Fthinkin-blog-next)

## 環境變數

複製 `.env.example` 並重新命名為 `.env`，然後根據需求修改：

| 變數名稱                  | 說明                | 預設值                                   |
| ------------------------- | ------------------- | ---------------------------------------- |
| `PUBLIC_BLOG_NAME`        | 部落格名稱          | `Thinkin Markdown`                       |
| `PUBLIC_BLOG_DESCRIPTION` | 部落格描述          | `一個專注於記錄軟體開發經驗與知識...`    |
| `PUBLIC_BLOG_URL`         | 部落格網址          | `https://www.thinkinmd.com`              |
| `PUBLIC_BLOG_AUTHOR`      | 作者名稱            | `Neil Tsai`                              |
| `PUBLIC_BLOG_KEYWORDS`    | 預設關鍵字          | `軟體開發, 工程實踐, 技術分享, 持續學習` |
| `PUBLIC_BLOG_OG_IMAGE`    | Open Graph 預設圖片 | `/assets/og-image.jpg`                   |
| `PUBLIC_BLOG_LANG`        | 部落格語系          | `zh-Hant`                                |

### 顯示限制

| 變數名稱                      | 說明         | 預設值 |
| ----------------------------- | ------------ | ------ |
| `PUBLIC_FEATURED_POSTS_LIMIT` | 置頂文章數量 | `3`    |
| `PUBLIC_NEW_POSTS_LIMIT`      | 最新文章數量 | `10`   |
| `PUBLIC_POSTS_PER_PAGE`       | 每頁文章數量 | `10`   |

### Giscus 留言系統

| 變數名稱                          | 說明              | 預設值          |
| --------------------------------- | ----------------- | --------------- |
| `PUBLIC_GISCUS_REPO`              | GitHub 儲存庫名稱 | -               |
| `PUBLIC_GISCUS_REPO_ID`           | 儲存庫 ID         | -               |
| `PUBLIC_GISCUS_CATEGORY`          | 討論分類名稱      | `Announcements` |
| `PUBLIC_GISCUS_CATEGORY_ID`       | 分類 ID           | -               |
| `PUBLIC_GISCUS_MAPPING`           | 頁面對應方式      | `title`         |
| `PUBLIC_GISCUS_STRICT`            | 嚴格匹配模式      | `0`             |
| `PUBLIC_GISCUS_REACTIONS_ENABLED` | 啟用表情回應      | `1`             |
| `PUBLIC_GISCUS_EMIT_METADATA`     | 發送 metadata     | `0`             |
| `PUBLIC_GISCUS_INPUT_POSITION`    | 輸入框位置        | `top`           |
| `PUBLIC_GISCUS_THEME`             | 主題              | `dark`          |
| `PUBLIC_GISCUS_LOADING`           | 載入模式          | `lazy`          |

## 專案結構

```
src/
├── lib/
│   ├── components/     # UI 元件
│   │   ├── ui/         # shadcn-svelte 元件
│   │   └── icons/      # 自定義圖示
│   ├── constants/      # 網站設定常數 (部分引用自 $posts/_metadata)
│   ├── server/         # 伺服器端邏輯
│   ├── utils/          # 工具函式
│   └── types.ts        # TypeScript 型別
├── posts/              # 內容中心 (整合文稿、資源與元數據)
│   ├── _metadata/      # 分類、標籤與作者定義
│   └── {slug}/         # 文章目錄
│       ├── index.md    # 文章主體
│       └── images/     # 文章專用圖片
├── routes/             # SvelteKit 路由
└── static/             # 全站通用靜態資源
```

## 腳本指令

| 指令           | 說明                |
| -------------- | ------------------- |
| `pnpm dev`     | 啟動開發伺服器      |
| `pnpm build`   | 建置生產版本        |
| `pnpm preview` | 預覽生產版本        |
| `pnpm check`   | TypeScript 型別檢查 |
| `pnpm lint`    | 程式碼品質檢查      |
| `pnpm format`  | 格式化程式碼        |
| `pnpm update`  | 更新所有依賴        |

## 如何新增文章

在 `src/posts/` 目錄下建立新的 **資料夾**，資料夾名稱將作為 URL slug，並在該資料夾內建立 `index.md`。

### Frontmatter 結構

```yaml
---
title: '文章標題'
description: '文章描述，用於 SEO 與列表顯示'
slug: 'article-url-slug'
date: '2026-01-01'
drafted: false
featured: false
topic: 'topic-slug'
tags: ['tag1', 'tag2']
authors: ['neil-tsai']
---
```

### 欄位說明

| 欄位          | 必填 | 說明                                        |
| ------------- | ---- | ------------------------------------------- |
| `title`       | ✅   | 文章標題                                    |
| `description` | ✅   | 文章描述                                    |
| `ogImage`     | ⬜   | 自訂社群分享圖片路徑                        |
| `slug`        | ✅   | URL 識別碼，需與檔案名相同                  |
| `date`        | ✅   | 發佈日期 (YYYY-MM-DD)                       |
| `updated`     | ⬜   | 最後更新日期                                |
| `drafted`     | ✅   | 是否為草稿，`true` 時不會顯示於網站         |
| `featured`    | ✅   | 是否為推薦文章，`true` 時顯示於首頁置頂區塊 |
| `topic`       | ✅   | 主題分類 slug                               |
| `tags`        | ✅   | 標籤陣列                                    |
| `authors`     | ⬜   | 作者 ID 陣列                                |
| `readingTime` | ⬜   | 預估閱讀時間 (分鐘)，未設定時自動計算       |

### 圖片資源

文章內的圖片請放置於該文章目錄下的 `images/` 目錄，並使用相對路徑引用：

```markdown
![圖片說明](./images/image.png)
```

> [!TIP]
> 採用相對路徑後，Vite 於建置時會自動優化這些圖片並處理內容雜湊（Cache Busting）。

### 主題與標籤設定

主題和標籤定義於 `src/posts/_metadata/` 目錄：

- **主題 (Topic)**: `src/posts/_metadata/topics.json`
- **標籤 (Tag)**: `src/posts/_metadata/tags.json`

新增主題或標籤時，請編輯對應的 JSON 檔案：

```json
// topics.json
[
    { "name": "設計模式", "slug": "design-pattern" }
]

// tags.json
[
    { "name": "創建型模式", "slug": "creational-pattern" }
]
```

### 作者設定

作者定義於 `src/posts/_metadata/authors.json`：

```json
{
    "neil-tsai": {
        "id": "neil-tsai",
        "name": "Neil Tsai",
        "avatar": "/assets/authors/neil.jpg",
        "bio": "作者簡介",
        "website": "https://example.com",
        "github": "https://github.com/username"
    }
}
```

作者頭像請放置於 `static/assets/authors/` 目錄。

## 關於貢獻

感謝您對本專案感興趣！

🐛 Bug 回報： 非常歡迎！請直接在 Issues 區塊提出。

📝 錯字修正 / 文檔優化： 歡迎提交 PR。

💻 核心程式碼： 由於本專案採用雙重授權模式，為了維持版權完整性以便未來維護，目前暫不接受核心架構與功能性的 Pull Request，建議您透過 Issue 提出建議，由作者評估後實作。

## 授權聲明

本專案採用 **混合授權 (Hybrid Licensing)** 模式，以兼顧原始碼保護與知識分享的自由。請詳閱以下細則：

### 1. 網站原始碼 (Project Source Code)

> 適用範圍：本專案的架構、佈景主題 (Theme)、樣式表 (CSS)、構建腳本 (Build Scripts) 等。

採用 **GNU General Public License v3.0 (GPLv3)** 授權。

- ✅ **開源共享**：您可以自由查看、修改及分發本專案的原始碼。
- ⚠️ **強制開源 (Copyleft)**：若您基於本專案修改並進行發佈（例如架設另一個網站），您的專案**必須**同樣採用 GPLv3 授權並公開原始碼。
- 🚫 **商業保留**：若您希望將本網站的架構、設計或核心代碼用於**閉源商業產品**，請務必先[聯絡作者](mailto:cdcd71517@gmail.com)取得商業授權 (Commercial License)。

### 2. 文章內容 (Article Content)

> 適用範圍：`src/posts` 或 `static/assets/posts` 目錄下的 Markdown 文字內容、圖片。

採用 **CC BY-NC-SA 4.0** 授權。

- 您可以非商業性地轉載與分享。
- **關於標示 (Attribution)**：您不需標註作者姓名，但**必須清楚標示原文連結 (URL) 作為出處**。

### 3. 文章內的程式碼片段 (Code Snippets)

> 適用範圍：文章內容中用於教學、展示的程式碼區塊。

採用 **MIT License** 授權。

- 為了方便技術交流與學習，文章內的所有程式碼片段（Snippets）均視為 MIT 授權。
- 這意味著您可以自由複製這些片段到您的個人或商業專案中，無需額外徵求同意，亦無須開源您的專案。

---

Copyright © 2026 Neil Tsai. All Rights Reserved.
