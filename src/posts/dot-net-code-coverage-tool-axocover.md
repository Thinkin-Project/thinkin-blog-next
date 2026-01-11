---
title: 'AxoCover'
description: '.NET 分析程式碼覆蓋率工具'
ogImage: '/assets/posts/dot-net-code-coverage-tool-axocover/hero.jpeg'
slug: 'dot-net-code-coverage-tool-axocover'
date: '2020-01-03'
drafted: false
featured: false
topic: 'visual-studio'
tags: ['visual-studio-extension', 'axocover', 'unit-test', 'code-coverage']
authors: ['neil-tsai']
---

## 前言

AxoCover 是小弟最近在使用的**程式碼涵蓋率分析工具**，因為最近在幫既有專案撰寫單元測試，以往公司做法是透過 Jenkins 處理 CI/CD 會一併執行專案所寫的單元測試及分析程式碼覆蓋率並產出一份報告，但**有一個比較尷尬的問題就是需要先把程式碼 push 至遠端，這樣 Jenkins 才會被觸發要去處理這件事情(有設定好的情況下)**，但是**我想在本地端就能先看大致跑出來的涵蓋率結果**，這樣或多或少就能減少耗用 Jenkins 資源，畢竟公司專案很多，確實這個工具也給了我不少幫助！讓我們往下看吧！

![AxoCover-1](/assets/posts/dot-net-code-coverage-tool-axocover/AxoCover-1.jpeg)

<center>
    SonarQube Coverage Report
</center>

**蠻少人討論**這個工具，但實際用了之後感覺回不去的工具(〃∀〃)

## AxoCover 介紹

![AxoCover-2](/assets/posts/dot-net-code-coverage-tool-axocover/Axocover-2.jpeg)

<center>
    Microsoft Marketplace AxoCover Download Page
</center>

有幾點可以特別注意：

1. 屬 Visual Studio 擴充功能
2. 支援 .NET Framework 專案（不支援 .NET Core 及 Xamarin 專案）
3. 涵蓋狀況呈現於編輯器
4. 可輸出涵蓋率結果於靜態 HTML 上
5. 支援 MSTest、xUnit、NUnit 測試框架

## AxoCover 安裝步驟

打開 Visual Studio ➡️ 工具 ➡️ 擴充功能和更新 ➡️ 線上 ➡️ 搜尋 AxoCover ➡️ 安裝 ➡️ 重開 Visual Studio ➡️ 完成安裝!!

![AxoCover-3](/assets/posts/dot-net-code-coverage-tool-axocover/Axocover-3.jpeg)

<center>
    Extension and Updates ➡ Online ➡ Search AxoCover
</center>

## AxoCover 使用說明

![AxoCover-4](/assets/posts/dot-net-code-coverage-tool-axocover/Axocover-4.png)

<center>
    Tools ➡ AxoCover
</center>

點擊後 IDE 右側應該會出現該工具的頁籤，一開始它會去讀取整個 Solution 確認是否有單元測試專案或程式，如果沒有找到會像下面這樣：

![AxoCover-5](/assets/posts/dot-net-code-coverage-tool-axocover/Axocover-5.jpeg)

<center>
    AxoCover Not Found Unit Tests
</center>

如果發生明明有單元測試專案或程式，但依然沒有被找出來的情況，這時可以試試看**重建專案讓該工具重新讀取**。

![AxoCover-6](/assets/posts/dot-net-code-coverage-tool-axocover/Axocover-6.jpeg)

<center>
    AxoCover Founded Unit Tests
</center>

## 功能介紹

![AxoCover-7](/assets/posts/dot-net-code-coverage-tool-axocover/Axocover-7.jpeg)

<center>
    AxoCover Function list
</center>

### Tests

#### Run

編譯後執行單元測試（**不含**涵蓋率分析）。

![AxoCover-8](/assets/posts/dot-net-code-coverage-tool-axocover/Axocover-8.jpeg)

<center>
    Build Solution And Run Unit Tests
</center>

#### Cover

編譯後執行單元測試（**含**涵蓋率分析）並產生 coverageReport.xml 放於 Solution 下的 .axoCover/runs/run_YYYY–MM–DD_HH–MM–SS 資料夾內。

![AxoCover-9](/assets/posts/dot-net-code-coverage-tool-axocover/Axocover-9.jpeg)

<center>
    .axoCover
</center>

![AxoCover-10](/assets/posts/dot-net-code-coverage-tool-axocover/Axocover-10.jpeg)

<center>
    runs
</center>

![AxoCover-11](/assets/posts/dot-net-code-coverage-tool-axocover/Axocover-11.jpeg)

<center>
    coverageReport.xml
</center>

#### Build

編譯（**不含**執行單元測試**及**涵蓋率分析）

#### Collapse

收合頁籤內容

### Report

![AxoCover-12](/assets/posts/dot-net-code-coverage-tool-axocover/Axocover-12.jpeg)

<center>
    Coverage Report
</center>

#### Import

可匯入 OpenCover coverage reports（*.xml）格式資料 。

#### Export

依據當前 Coverage Report 匯出靜態 HTML Summary Report（可瀏覽器觀看）。

![AxoCover-13](/assets/posts/dot-net-code-coverage-tool-axocover/Axocover-13.jpeg)

<center>
    Click “Export” Generate Summary Report
</center>

![AxoCover-14](/assets/posts/dot-net-code-coverage-tool-axocover/Axocover-14.jpeg)

<center>
    reports
</center>

![AxoCover-15](/assets/posts/dot-net-code-coverage-tool-axocover/Axocover-15.jpeg)

<center>
    index.htm
</center>

![AxoCover-16](/assets/posts/dot-net-code-coverage-tool-axocover/Axocover-16.jpeg)

<center>
    Summary Report Page
</center>

#### Sort（Alphabetical 、Uncovered Code、Coverage）

依照字母、未涵蓋程式碼、涵蓋率排序

#### Collapse

收合頁籤內容

### Settings

![AxoCover-17](/assets/posts/dot-net-code-coverage-tool-axocover/Axocover-17.jpeg)

<center>
    Settings
</center>

#### Visualization

根據需求調整視覺呈現部分。

綠（Green）：被覆蓋程式碼（Covered lines）

黃（Yellow）：部分覆蓋程式碼（Part of covered lines）

紅（Red）：未覆蓋程式碼（Uncovered lines）

小圈圈（Circle）：條件判斷涵蓋狀況（Covered condition situation）

空心圈圈（Hollow Circle）：未涵蓋條件（Uncovered condition）

實心圈圈（Solid Circle）：已涵蓋條件（Covered condition）

![AxoCover-18](/assets/posts/dot-net-code-coverage-tool-axocover/Axocover-18.jpeg)

<center>
    Notice Inner Red Area
</center>

#### Coverage

根據需求可決定測試涵蓋率分佈到什麼程度。

#### Output directories

可直接移動到輸出目錄或清除目錄資料。

#### Test settings

可設定跑測試的目標平台 x86 或 x64 … 等等相關設定。

## 結尾

感謝各位花時間看完此篇小文，如果本文中有描述錯誤，還請各位指教。

雖然透過 CI/CD 整合 SonarQube 後一樣能做到觀察程式涵蓋率這件事，但如果能在開發時就能初步知道自己寫的單元測試能涵蓋到什麼程度也不是一件壞事哦(ゝ∀･)b

所以本文目的是希望大家可以快速了解這是什麼樣的工具及如何能夠快速去使用它，希望對大家是有幫助的！ヽ(✿ﾟ▽ﾟ)ノ

## 參考

💭 [[VisualStudio] .NET 分析測試代碼覆蓋率 AxoCover](https://marcus116.blogspot.com/2019/03/visualstudio-net-axocover.html)