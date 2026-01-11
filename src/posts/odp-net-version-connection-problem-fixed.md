---
title: 'ODP.NET 位元版本連線異常排除'
description: '解決 ODP.NET 位元版本連線異常問題'
ogImage: '/assets/posts/odp-net-version-connection-problem-fixed/hero.jpeg'
slug: 'odp-net-version-connection-problem-fixed'
date: '2020-01-11'
drafted: false
featured: false
topic: 'oracle'
tags: ['odp-net', 'error-handling', 'data-access']
authors: ['neil-tsai']
---

## 前言

小弟我最近有在協助公司新進人員排除一些 Oracle 資料庫連線問題，有碰到一個用 **Sql Developer 可以連線**，但是**應用程式使用 ODP.NET 卻無法連線**的情況···

## 狀況釐清

1. 應用程式編譯目標平台為 Any CPU
2. 已安裝 ODP.NET 64 位元版本

## ODP.NET 問題

應用程式執行時丟出來的錯誤，感覺上是 Spring 在注入時有發生異常···

![ODP.NET-version-problem-1](/assets/posts/odp-net-version-connection-problem-fixed/ODP.NET-version-problem-1.jpeg)

<center>
    Application Throw Exception
</center>

## ODP.NET 問題排除

後來問了有經驗的同仁，他說可以確認看看 IIS Application Pool 的**進階設定**，其中裡面的**啟用 32 位元應用程式**是 True 還是 False。

![ODP.NET-version-problem-2](/assets/posts/odp-net-version-connection-problem-fixed/ODP.NET-version-problem-2.jpeg)

<center>
    修改前
</center>

**如果這個設定被設定為 True，則須要安裝 32 位元版本相容的 ODP.NET，應用程式才可正常運行！**

![ODP.NET-version-problem-3](/assets/posts/odp-net-version-connection-problem-fixed/ODP.NET-version-problem-3.jpeg)

<center>
    修改後
</center>

因為我的應用程式目標平台不是瞄準在 32 位元，所以就將此開關調整為 False，後來就能正常執行應用程式了。

## 結尾

之前就有稍微研究過 ODP.NET 是怎麼樣去連線 Oracle 資料庫，可參考下文···

💭 [什麼是 Oracle Data Access Components?](/posts/what-is-oracle-data-access-components)

結果還是被 **ODP.NET 位元版本問題**搞到不能自己_(┐「ε:)_

感謝各位花時間看完此篇小文，如果本文中有描述錯誤，還請各位指教。

本文目的是希望如果有遇到類似問題，可以嘗試藉此排除看看！節省一點時間···

## 參考

💭 [【茶包射手日記】ODP.NET如何找對Oracle Client檔案？](https://blog.darkthread.net/blog/how-odp-net-find-oracle-client/)