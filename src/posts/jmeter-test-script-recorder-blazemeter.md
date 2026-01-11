---
title: 'BlazeMeter'
description: 'JMeter 腳本錄製插件初探'
ogImage: '/assets/posts/jmeter-test-script-recorder-blazemeter/hero.jpeg'
slug: 'jmeter-test-script-recorder-blazemeter'
date: '2020-01-05'
drafted: false
featured: false
topic: 'browser-extension'
tags: ['chrome-extension', 'jmeter', 'blazemeter', 'stress-test']
authors: ['neil-tsai']
---

如何簡單錄製 JMeter 測試腳本，試試 Chrome 擴充功能的 BlazeMeter 吧，讓我們看下去!!

## 前言

小弟所在的團隊最近將要上線一個新系統，不外乎要做**壓力測試**這件事情，但對於我來說卻是很陌生，甚至連怎麼做都不太清楚，所以藉著這次機會詢問了在北部的同仁，因他近期常駐點在客戶端，對這件事必然需要有一定了解，以便在將來我也能夠處變不驚處理這件事 σ`∀´)σ

但此文主旨會先放在**如何簡單錄製 JMeter 測試腳本**這塊，畢竟壓力測試要做得事情還有很多呢 ◢▆▅▄▃崩╰(〒皿〒)╯潰▃▄▅▇◣

## BlazeMeter 介紹

![blazemeter-1](/assets/posts/jmeter-test-script-recorder-blazemeter/BlazeMeter-1.jpeg)

<center>
    BlazeMeter Web Site
</center>

![blazemeter-2](/assets/posts/jmeter-test-script-recorder-blazemeter/BlazeMeter-2.jpeg)

<center>
    BlazeMeter Features & Requirements
</center>

有幾點可以特別注意：

1. 可記錄**使用者行為**及**這一行為下所發出的要求（Requests）**
2. 兼容 Apache JMeter
3. 可以**不需要測試工具**就能執行測試（這部分本文不會特別說明細節）
4. 有些功能**需要登入**才能使用
5. 部分功能使用上**有最低 Chrome 版本限制**

## BlazeMeter 安裝步驟

Chrome 線上應用程式商店（Chrome Web Store）➡️ 搜尋 BlazeMeter ➡️ 安裝擴充功能 ➡️ 安裝完成

![blazemeter-3](/assets/posts/jmeter-test-script-recorder-blazemeter/BlazeMeter-3.jpeg)

<center>
    Chrome Extensions – BlazeMeter
</center>

## 使用說明

安裝完後瀏覽器右上角會有 BlazeMeter 擴充功能。

![blazemeter-4](/assets/posts/jmeter-test-script-recorder-blazemeter/BlazeMeter-4.jpeg)

<center>
    BlazeMeter Extensions
</center>

點開後長這樣。

![blazemeter-5](/assets/posts/jmeter-test-script-recorder-blazemeter/BlazeMeter-5.png)

<center>
    Initial Status
</center>

1. 停止記錄（Stop recording）
2. 開始記錄（Start recording）
3. 重設選項（Reset all options）
4. 客製選項（Advanced options）

假設我要測試登入流程的話，點擊”紅圈圈”就會開始記錄囉。

![blazemeter-6](/assets/posts/jmeter-test-script-recorder-blazemeter/BlazeMeter-6.jpeg)

<center>
    Record of Login Flow
</center>

看到以下畫面時，表示已經開始記錄了，這時候要開始操作系統流程！

![blazemeter-7](/assets/posts/jmeter-test-script-recorder-blazemeter/BlazeMeter-7.jpeg)

<center>
    Recording…
</center>

嘗試登入行為。

![blazemeter-8](/assets/posts/jmeter-test-script-recorder-blazemeter/BlazeMeter-8.jpeg)

<center>
    Try to Login
</center>

如果覺得已經 OK 了，按下”紅色方塊”停止記錄。

![blazemeter-9](/assets/posts/jmeter-test-script-recorder-blazemeter/BlazeMeter-9.jpeg)

<center>
    Recording End
</center>

已經錄製完畢了！

![blazemeter-10](/assets/posts/jmeter-test-script-recorder-blazemeter/BlazeMeter-10.jpeg)

<center>
    End of Record
</center>

### Run

會將測試腳本上傳至雲上並實際去跑（視需求決定，不一定要這麼做）。

![blazemeter-11](/assets/posts/jmeter-test-script-recorder-blazemeter/BlazeMeter-11.jpeg)

<center>
    “Run” Function list
</center>

### Edit

可以再編輯測試腳本。

![blazemeter-12](/assets/posts/jmeter-test-script-recorder-blazemeter/BlazeMeter-12.jpeg)

<center>
    “Edit” Function list
</center>

### Save

匯出測試腳本。

![blazemeter-13](/assets/posts/jmeter-test-script-recorder-blazemeter/BlazeMeter-13.jpeg)

<center>
    “Save” options
</center>

![blazemeter-14](/assets/posts/jmeter-test-script-recorder-blazemeter/BlazeMeter-14.jpeg)

<center>
    Export JMeter File
</center>

![blazemeter-15](/assets/posts/jmeter-test-script-recorder-blazemeter/BlazeMeter-15.jpeg)

<center>
    Import JMeter File
</center>

## 結尾

感謝各位花時間看完此篇小文，如果本文中有描述錯誤，還請各位指教。

這次跟大家介紹了**從瀏覽器透過了解使用者行為並匯出測試腳本**是這樣一件單純的事情，節省了不少時間呢(ゝ∀･)b

所以本文目的是希望大家可以快速了解 BlazeMeter 是什麼樣的工具及如何能夠快速去使用它，希望對大家是有幫助的！ヽ(✿ﾟ▽ﾟ)ノ

## 參考

💭 [Day 20 Jmeter 壓力測試工具](https://ithelp.ithome.com.tw/articles/10203900?sc=hot)
