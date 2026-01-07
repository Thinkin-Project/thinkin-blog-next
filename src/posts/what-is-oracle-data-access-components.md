---
title: '什麼是 Oracle Data Access Components?'
description: '深入了解 Oracle Data Access Components'
ogImage: '/assets/posts/what-is-oracle-data-access-components/hero.jpeg'
slug: 'what-is-oracle-data-access-components'
date: '2020-01-01'
drafted: false
featured: false
topic: 'oracle'
tags: ['odac', 'oracle-client', 'data-access']
authors: ['neil']
---

## 前言

小弟剛進公司時，前輩們已有準備開發用 VM (很多設定我們都不需要再處理)，接著很快就下專案維運了，但也因此少知道了很多事情，其中一件事就是這個 ODAC (Oracle Data Access Components)，那時候就在想···

1. .NET 應用程式怎麼操作 Oracle 資料庫？
2. 為什麼裝完 ODAC 並設置完就可以運作？
3. 到底是要裝 Oracle Client 還是 ODAC 好呢？

相信你/妳應該有類似的疑問，於是這篇文章就誕生了，讓我們往下看吧!

## Oracle Data Access Components 官方描述

> From Oracle Data Access Components Documentation 12c Release 3 (12.1.0.2.1) Overview
>
> Oracle Data Access Components (ODAC) are a set of Windows and .NET data access drivers and tools. They include support for .NET, COM, and ODBC data access; Microsoft Visual Studio tools for developing Oracle database applications; ASP.NET providers; and .NET stored procedure support. ODAC provides comprehensive client support for advanced Oracle database functionality, including performance, high availability, and security, among other features. It is tightly integrated with Visual Studio and Windows to provide a seamless development experience for Windows developers.

簡單來說當我們在開發 .NET 應用程式時會需要對 Oracle 資料庫進行相關操作時則會需要使用到此組件的相關服務協助我們做到這件事。

## Oracle Data Access Components 安裝方案

![ODAC-1](/assets/posts/what-is-oracle-data-access-components/ODAC-1.jpeg)

<center>
    Oracle 針對 “使用情況” 給出幾種安裝方案
</center>

1️⃣ **專案開發期各版本所需（較輕量）**

- **Oracle Developer Tools for Visual Studio**
- Oracle Data Provider for .NET, Managed Driver
- Oracle Providers for ASP.NET

2️⃣ **專案開發期全版本通用及一些 Oracle 資料庫擴充套件（較重量）**

- **Oracle Developer Tools for Visual Studio**
- Oracle Data Provider for .NET
- Oracle Providers for ASP.NET
- Oracle Database Extensions for .NET — available in 12.2 and earlier for upgrade only
- Oracle Provider for OLE DB
- Oracle OLAP Provider for OLE DB — 18c and higher
- Oracle Services for Microsoft Transaction Server
- Oracle ODBC Driver
- Oracle SQL*Plus
- Oracle Instant Client

3️⃣ **專案後期上線輕量部署（ XCopy 版本 ）**

- Oracle Data Provider for .NET
- Oracle Providers for ASP.NET
- Oracle Provider for OLE DB
- Oracle OLAP Provider for OLE DB — 18c and higher
- Oracle Services for Microsoft Transaction Server
- Oracle Instant Client

從上可以得知[1️⃣、2️⃣]和3️⃣有一蠻明顯的不同點，就是**少了 Oracle Developer Tools for Visual Studio**。

## Oracle Developer Tools for Visual Studio（ODT）

> From Visual Studio Marketplace – Oracle Developer Tools for Visual Studio 2017
>
> Oracle Developer Tools for Visual Studio 2017 is a free VS addin that makes it easy to browse and modify Oracle schema objects and data, edit and debug PL/SQL, generate SQL deployment scripts, perform schema comparisons, tune SQL and .NET app performance, and much more. .

簡單來說就是在 IDE 內讓 Oracle Database 可以像是 SQL Server 那樣簡易操作資料。

![ODAC-2](/assets/posts/what-is-oracle-data-access-components/ODAC-2.jpeg)

<center>
    資料連接選擇介面
</center>

![ODAC-4](/assets/posts/what-is-oracle-data-access-components/ODAC-4.jpeg)

<center>
    嘗試測試連接
</center>

因為對於 Server 端而言確實**不需要**因為需要安裝 Data Provider 就把整個 ODT 給安裝上去，**一是我們很少會在 Server 端開發，二是避免造成管理不易**。

💭 [Oracle ODAC + ASP.NET MVC 佈署](http://kevintsengtw.blogspot.com/2012/11/oracle-odac-aspnet-mvc.html)

## 連線手段

### System.Data.OracleClient（微軟）

元件依然存在 .NET Framework 4.0 內，但該元件已不再被維護，但一定程度內仍能使用該元件功能，但**不建議**再繼續使用囉！！

💭 [System.Data.OracleClient將走入歷史](https://blog.darkthread.net/blog/bye-ado-net-oracleclient/)

### Oracle.DataAccess.Client（甲骨文，ODP.NET）

既然第一種手段已宣告往後不再被維護，則我們將焦點移動到 Oracle 自家推出的 ODP.NET，也因 Oracle 時常會更新，所以相較於微軟推出的元件，自然會持續維護元件程式碼。

**ODP.NET 有幾點可以特別注意：**

1. 不需裝肥肥的 Oracle Client
2. 需配置 tnsnames.ora
3. 使用上有區分 32 bit / 64 bit

![ODAC-3](/assets/posts/what-is-oracle-data-access-components/ODAC-3.jpeg)

<center>
    tnsnames.ora
</center>

### Oracle.ManagedDataAccess.dll（甲骨文，Managed ODP.NET）

因為已有先知道 ODP.NET 會自己去找 32 bit / 64 bit 對應 Oracle Client 版本的機制（找註冊表）。

💭 [【茶包射手日記】ODP.NET如何找對Oracle Client檔案？](https://blog.darkthread.net/blog/how-odp-net-find-oracle-client/)

那假設 Server 端有很多 Oracle Client 版本，可能會因為 ODP.NET 自有的找檔機制，然後又因為 Server 端**人員行為管理不慎，很可能導致預期外的問題···**

所以 Oracle 自家推出了 Managed ODP.NET 來改善上述可能會發生的狀況。

**Managed ODP.NET 有幾點可以特別注意：**

1. 不需安裝 ODAC（相當等於不用去裝 Oracle Client）
2. 一顆 Oracle.ManagedDataAccess.dll 就能搞定連線
3. 不必再區分 32 bit / 64 bit

💭 [Managed ODP.NET簡介](https://blog.darkthread.net/blog/managed-odp-net/)

## 比較

從上述三種連線手段分析下來，推薦使用依序排的話：

Managed ODP.NET ➡ ODP.NET

**近期開發的應用現在都主打 Managed ODP.NET ，因為它本身目標平台放在 Any CPU，而且也因為它自己有一套解析 TNS 名稱的順序，所以不會像 ODP.NET 會去依賴註冊表，提高蠻大的彈性空間，方便集中控管。**

看到這裡你/妳會覺得奇怪，怎麼 System.Data.OracleClient 的手段不在排序上？因為阿······現在已不推薦使用，所以就沒有列上去囉。

## 結尾

感謝各位花時間看完此篇小文，如果本文中有描述錯誤，還請各位指教。

自己對 ODAC 有了新的認識，然後從原本的 VM 開發環境搬回本機開發環境，終於不用再分效能給 VM 了ヽ(・×・´)ゞ

雖然多數內容都已有詳細資料參考，所以本文列出了關於 ODAC 幾點**較重要**的部分，希望可以幫助對 ODAC 有疑惑的人快速去了解，可以**視情況去應用所知，省時又省力呢**◝( ﾟ∀ ﾟ )◟