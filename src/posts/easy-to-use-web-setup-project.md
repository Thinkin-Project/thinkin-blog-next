---
title: 'Installer Projects'
description: 'ASP.NET 網站簡易安裝方式'
ogImage: '/assets/posts/easy-to-use-web-setup-project/hero.jpeg'
slug: 'easy-to-use-web-setup-project'
date: '2020-01-11'
drafted: false
featured: false
topic: 'visual-studio'
tags: ['visual-studio-extension', 'installer-projects', 'deploy']
authors: ['neil-tsai']
---

## 前言

小弟前幾個月又有接到一個任務，這個要求是「有沒有辦法可以將**網站專案**包成安裝檔？」，因為團隊這邊想要盡可能達到自動化的方式來部署網站（手動情況）···

其實網路上有蠻多選擇，像是有 Advanced installer 、 Windows Installer XML（WiX Toolset）都是不錯的解決方式，但我在想有沒有更單純的方式來處理，於是腦筋動到了微軟 Installer Projects 上，因為只要在 Visual Studio 擴充功能市集就能找到並安裝！

![installer-project-1](/assets/posts/easy-to-use-web-setup-project/installer-project-1.jpeg)

<center>
    Microsoft Visual Studio Installer Projects
</center>

## 大致步驟

1. Visual Studio Marketplace 搜尋 Installer Projects 並安裝
2. 已有建立的網站專案（Web Project）
3. 新增網站安裝專案（Web Setup Project）並加入專案輸出（主要輸出、內容檔···其餘可視專案情況）
4. 取得安裝檔並且安裝
5. 測試網站可否運行

## 簡易教學

Visual Studio Marketplace 搜尋 Installer Projects 並安裝

![installer-project-2](/assets/posts/easy-to-use-web-setup-project/installer-project-2.jpeg)

<center>
    Extension and Updates ➡ Online ➡ Search Installer Projects
</center>

示範建立 ASP.NET Web 應用（以 Web Form 架構為例，同理 MVC 架構）

![installer-project-3](/assets/posts/easy-to-use-web-setup-project/installer-project-3.jpeg)

<center>
    Create ASP.NET Web Application
</center>

![installer-project-4](/assets/posts/easy-to-use-web-setup-project/installer-project-4.jpeg)

<center>
    Test to run web application by IIS Express
</center>

示範建立網站安裝專案

![installer-project-5](/assets/posts/easy-to-use-web-setup-project/installer-project-5.jpeg)

<center>
    Create Web Setup Project
</center>

初始的方案結構

![installer-project-6](/assets/posts/easy-to-use-web-setup-project/installer-project-6.jpeg)

<center>
    Visual studio solution structure
</center>

加入專案輸出（主要輸出、內容檔）

![installer-project-7](/assets/posts/easy-to-use-web-setup-project/installer-project-7.png)

<center>
    Add project output
</center>

![installer-project-8](/assets/posts/easy-to-use-web-setup-project/installer-project-8.jpeg)

<center>
    Add main output
</center>

![installer-project-9](/assets/posts/easy-to-use-web-setup-project/installer-project-9.jpeg)

<center>
    Add content files
</center>

現在的方案結構

![installer-project-10](/assets/posts/easy-to-use-web-setup-project/installer-project-10.jpeg)

<center>
    Now visual studio solution structure
</center>

重建網站安裝專案

![installer-project-11](/assets/posts/easy-to-use-web-setup-project/installer-project-11.png)

<center>
    Rebuild web setup project
</center>

💭 [Difference between a Debug and Release build](http://net-informations.com/faq/net/debug-release.htm)

![installer-project-12](/assets/posts/easy-to-use-web-setup-project/installer-project-12.jpeg)

<center>
    packaging file···
</center>

取得安裝檔

![installer-project-13](/assets/posts/easy-to-use-web-setup-project/installer-project-13.jpeg)

<center>
    Get .msi & .exe file
</center>

💭 [Understanding the Difference Between .exe and .msi](https://www.symantec.com/connect/articles/understanding-difference-between-exe-and-msi)

嘗試安裝（Double click ExampleWebSetup.msi）

![installer-project-14](/assets/posts/easy-to-use-web-setup-project/installer-project-14.jpeg)

![installer-project-15](/assets/posts/easy-to-use-web-setup-project/installer-project-15.jpeg)

到此要稍微注意幾點：

**網站**：選擇已建立的 IIS 網站（IIS Web Site to choose）

**虛擬目錄**：定義 IIS 應用程式名稱（IIS Application Naming）

**應用程式集區**：選擇已建立的 IIS 應用程式集區（IIS Application Pool to choose）

![installer-project-16](/assets/posts/easy-to-use-web-setup-project/installer-project-16.jpeg)

查看 Internet Information Services 是否已建立應用程式

![installer-project-17](/assets/posts/easy-to-use-web-setup-project/installer-project-17.jpeg)

測試連上本地端網站

![installer-project-18](/assets/posts/easy-to-use-web-setup-project/installer-project-18.jpeg)

安裝於 Windows 上的網站資料夾結構可能像是這樣···

![installer-project-19](/assets/posts/easy-to-use-web-setup-project/installer-project-19.jpeg)

## 結尾

感謝各位花時間看完此篇小文，如果本文中有描述錯誤，還請各位指教。

其實看到最後你會發現**網站資料夾結構**跟我直接從專案建置後拿出來部署一模一樣，這也就代表說微軟本身就有提供一個比較簡易的方式可以部署網站，而不用擔心從專案建置後拿來部署又漏東漏西。

但從上面看下來這還不是真正的一鍵安裝╮(╯_╰)╭，還有一段路要走···

如果有機會，或許以後再來補補其他包裝的方式···