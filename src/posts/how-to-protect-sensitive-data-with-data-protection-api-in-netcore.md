---
title: '如何在 .NET Core 運用 Data Protection API 來保護敏感資料？'
description: '運用 Data Protection API 來保護敏感資料'
slug: 'how-to-protect-sensitive-data-with-data-protection-api-in-netcore'
date: '2020-05-12'
drafted: false
featured: false
topic: 'net-core'
tags: ['crypto', 'data-protection-api']
authors: ['neil']
---

此篇文章主要帶大家**利用 Data Protection API 實作資料保護機制於 .Net Core 3.1** 上，有興趣就往下看吧！

❗ **保護敏感資料不一定要用 Data Protection API**，但 .NET Core 是有提供這一方案給各位參考的，使用上也非常單純！

## 資料保護 Data Protection API

[DPAPI](https://en.wikipedia.org/wiki/Data_Protection_API)（Data Protection API）是一個單純的密碼學應用程式介面，最早出現在 Windows 2000，其後的 Windows 作業系統也都有其影子存在···

DPAPI 理論上可以對任何種類的資料進行對稱式加密（Symmetric Encryption）···

在 Windows 作業系統中主要被用來將非對稱私鑰做對稱式加密，而其中運用使用者或系統的秘密（Secret）作為熵（Entropy）的重要來源···

❗ **DPAPI 本身不會自己儲存持久性資料，它只將明文轉換為密文（反之亦然）···**

💭 [Entropy (information theory)](https://en.wikipedia.org/wiki/Entropy_(information_theory))

## .NET Core Data Protection

其實在開發網頁應用時常會碰到需要存取敏感的安全數據（例如：客戶的識別碼），但 Windows 本就提供的 DPAPI 只適合給桌上應用（Desktop Application）並不適合給網頁應用來使用···

所以在經過一段時間淬鍊下 .NET Core Data Protection 就誕生了，其實官方他們也想了很多，才把它實現出來···

- 問題陳述
- 設計理念
- API 受眾
- 套件佈局

👍 有興趣真的可以看看下方連結！一個元件的誕生真的要考慮很多···

💭 [ASP.NET Core Data Protection](https://docs.microsoft.com/en-us/aspnet/core/security/data-protection/introduction?view=aspnetcore-3.1)

⭐ .NET Core Data Protection 旨在**取代**舊有 .NET Framework 1.x – 4.x 中大家熟悉的 MachineKey 加解密，同時可為現代應用程式隨即使用的解決方案！

### 大致步驟

1. 從 `DataProtectionProvider` 取得 `DataProtector`
2. 呼叫 `Protect` 方法保護你/妳想保護的資料
3. 呼叫 `Unprotect` 方法將被你/妳保護的資料解回原貌

### 實際演練

1️⃣ 建立一個 Security 資料夾並創建一個儲存目的字串（Purpose Strings）的類別···

![dpapi-4](/assets/posts/how-to-protect-sensitive-data-with-data-protection-api-in-netcore/dpapi-4.jpg)

<center>
    DataProtectionPurposeStrings.cs
</center>

2️⃣ 將儲存目的字串的類別註冊為 Singleton，方便之後注入···

![dpapi-5](/assets/posts/how-to-protect-sensitive-data-with-data-protection-api-in-netcore/dpapi-5.jpg)

<center>
    Startup.cs
</center>

❗️ 以上兩步供各位參考，但實際怎麼做會更好···可以再討論···😂

3️⃣ 引入 `Microsoft.AspNetCore.DataProtection` 並從 `DataProtectionProvider` 取得 `DataProtector`

![dpapi-6](/assets/posts/how-to-protect-sensitive-data-with-data-protection-api-in-netcore/dpapi-6.jpg)

<center>
    RegionController.cs
</center>

透過 DataProtectionProvider 來 CreateProtector 預設提供了三種方式：

- `CreateProtector(string purpose)`
- `CreateProtector(IEnumerable<string> purposes)`
- `CreateProtector(string purpose, params string[] subPurposes)`

❗️ 要先有一個認知，就是**透過不同 Purpose Strings 創建出來的 DataProtector 彼此之間均是獨立的**。

換句話說，就是當今天我是以字串 “A” 建立 Protector 的話，若是以字串 “B” 建立 Protector 就無法解除由 A Protector 保護的資料哦！

❗️ **Purpose Strings 不用特別去加密它，它主要是用來呈現你/妳的使用意圖！**

💭 [Purpose strings in ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/security/data-protection/consumer-apis/purpose-strings?view=aspnetcore-3.1)

🌟 官方對於 Purpose Strings 如何定義有給出一個建議答案···

眼尖的你/妳可能有發現我把它定義為字串陣列 👇

`new string[] { "Web.Controllers.RegionController", "RegionIdRouteValue" }`

你/妳可以把它理解成我的意圖 👇

在 RegionController 中去保護 RegionIdRouteValue 實際數值···

既然它是陣列，也並沒有侷限只能傳兩個，就看你/妳如何去定義。但數值當中不能有 null 哦（文件有寫😂）！

4️⃣ 對需要保護的資料呼叫 `Protect` 來保護，反之呼叫 `Unprotect` 解除保護···

![dpapi-7](/assets/posts/how-to-protect-sensitive-data-with-data-protection-api-in-netcore/dpapi-7.jpg)

<center>
    RegionController.cs
</center>

因範例專案並沒有實際去接資料庫，所以你/妳可以把 Region 當成回傳給 View 的 Model，應該會清楚不少。

實務上我並不想讓前端知道 Region 實際的 Id 是什麼，所以透過 Data Protection API 就可以幫忙我們保護實際數值，直到它真正需要被利用時才解除保護！

### 情境

❗️ 注意觀察 URI 的變化···

![dpapi-1](/assets/posts/how-to-protect-sensitive-data-with-data-protection-api-in-netcore/dpapi-1.jpg)

<center>
    Web
</center>

資料保護**前**：

![dpapi-2](/assets/posts/how-to-protect-sensitive-data-with-data-protection-api-in-netcore/dpapi-2.jpg)

資料保護**後**：

![dpapi-3](/assets/posts/how-to-protect-sensitive-data-with-data-protection-api-in-netcore/dpapi-3.jpg)


[範例專案](https://github.com/cdcd72/NetCore.DPAPI.Demo)可參考···

## 額外參考

💭 [基礎密碼學(對稱式與非對稱式加密技術)](https://medium.com/@RiverChan/%E5%9F%BA%E7%A4%8E%E5%AF%86%E7%A2%BC%E5%AD%B8-%E5%B0%8D%E7%A8%B1%E5%BC%8F%E8%88%87%E9%9D%9E%E5%B0%8D%E7%A8%B1%E5%BC%8F%E5%8A%A0%E5%AF%86%E6%8A%80%E8%A1%93-de25fd5fa537)

## 結尾

感謝各位花時間看完此篇文章，如果本文中有描述錯誤，還請各位多多指教。

我也是直到最近才知道有 DPAPI 這一現成方案可以來幫忙我們保護敏感資料，以往若是有這種需求通常都會自己造輪子來做···

造輪子也不是不好，但就難在如何把整個加解密架構做得很好很安全，理論上開發人員只需要知道如何使用加解密程式，而不能太深入了解內部如何加解密···

微軟官方針對 .NET Core Data Protection 就有想了 3 方面的受眾，你/妳就知道為什麼了···

因為開發人員的職責並沒有一定包含管理密碼，如果搞得大家都知道如何管理密碼，這樣的密碼相當於沒有安全性可言···