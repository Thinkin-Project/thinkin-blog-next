---
title: '別再搞混了：Windows PowerShell 與 PowerShell 到底差在哪？'
description: '很多人會把 Windows PowerShell 和 PowerShell 當成同一個東西，但它們其實代表不同世代的 PowerShell'
slug: 'powershell-vs-windows-powershell'
date: '2026-06-10'
drafted: false
featured: false
topic: 'command-line'
tags: ['windows-powershell', 'powershell']
authors: ['neil-tsai']
---

很多人在 Windows 上使用命令列工具時，會把「Windows PowerShell」和「PowerShell」混在一起講。

**這件事看起來只是命名問題，但在實務上可能會造成不少誤會。**

例如：你以為自己正在使用新版 PowerShell 7，結果其實是在 Windows PowerShell 5.1 裡執行腳本；或是你看到某篇教學寫 PowerShell，卻沒有說清楚它到底指的是哪一個版本。

所以，這篇文章要來整理清楚：

> Windows PowerShell 和 PowerShell 到底差在哪？

## 先講結論

簡單來說：

**Windows PowerShell** 是舊版 PowerShell，主要指 Windows 內建的 **Windows PowerShell 5.1**。

**PowerShell** 則是新版 PowerShell，通常指 **PowerShell 7**，它是跨平台、開源並基於現代 .NET 建置的版本。

最簡單的判斷方式是：

```powershell
$PSVersionTable
```

如果看到版本是 `5.1`，通常就是 Windows PowerShell。

如果看到版本是 `7.x`，通常就是新版 PowerShell。

## 名稱上的差異

這兩個名稱很像，但其實有明確差別。

### Windows PowerShell

Windows 系統長期內建的版本，常見版本是 5.1。

它的執行檔通常是：

```powershell
powershell.exe
```

在 Windows 開始選單中看到的「Windows PowerShell」，通常就是它。

### PowerShell

新版 PowerShell 從 PowerShell 6 開始轉向跨平台與開源路線，而現在大家常說的新版 PowerShell，通常是 PowerShell 7。

它的執行檔通常是：

```powershell
pwsh.exe
```

在開始選單中通常會顯示為「PowerShell 7」。

## 差異比較表

| 項目     | Windows PowerShell               | PowerShell                                                   |
| -------- | -------------------------------- | ------------------------------------------------------------ |
| 常見版本 | 5.1                              | 7.x                                                          |
| 執行檔   | `powershell.exe`                 | `pwsh.exe`                                                   |
| 支援平台 | Windows                          | Windows、Linux、macOS                                        |
| 底層架構 | .NET Framework                   | 現代 .NET                                                    |
| 是否開源 | 否，主要是 Windows 內建元件      | 是                                                           |
| 安裝方式 | Windows 內建                     | 通常需要另外[安裝](https://github.com/powershell/powershell) |
| 發展狀態 | 以相容性維護為主                 | 主要發展方向                                                 |
| 適合情境 | 舊系統、舊模組、Windows 專用管理 | 新專案、跨平台、自動化腳本                                   |

## 最大差異：底層架構不同

Windows PowerShell 5.1 是建立在 .NET Framework 上。

PowerShell 7 則是建立在現代 .NET 上。

**這件事很重要，因為 PowerShell 腳本有時會直接使用 .NET 類別或方法。當底層 .NET 不同時，某些腳本、模組或行為就可能出現差異。**

也就是說：

💥 不是所有能在 Windows PowerShell 5.1 執行的腳本，都能百分之百無痛搬到 PowerShell 7。

💥 反過來也一樣，新版 PowerShell 裡可用的功能，也不一定能在 Windows PowerShell 5.1 使用。

## PowerShell 7 不會取代 Windows PowerShell 5.1

這也是很多人容易誤會的地方。

在 Windows 上安裝 PowerShell 7 之後，它不會把 Windows PowerShell 5.1 覆蓋掉。

**兩者其實可以並存。**

所以如果你只是說「打開 PowerShell」，其實還不夠精準。最好明確說：

- Windows PowerShell 5.1
- PowerShell 7

這樣才不會讓別人搞錯環境。

## 模組相容性要注意

大多數常用模組已經可以在 PowerShell 7 使用，但仍然有一些舊模組或高度依賴 Windows / .NET Framework 的模組，可能還是需要在 Windows PowerShell 5.1 中執行。

💥 尤其是一些老舊的 Windows 管理腳本，過去可能是針對 Windows PowerShell 5.1 寫的。如果你把它們直接搬到 PowerShell 7，有可能遇到模組載入失敗、cmdlet 行為不同，或 .NET API 差異造成的問題。

因此，實務上比較保守的做法是：

✨ 如果是新專案，優先考慮 PowerShell 7。

🔍 如果是維護舊腳本，先確認它原本是在哪個版本上執行。

🔥 如果是 Windows 系統管理相關腳本，尤其是老舊環境，則要特別留意 Windows PowerShell 5.1 的相容性。

## 該用哪一個？

一般建議如下：

### 新專案：使用 PowerShell 7

如果你正在寫新的自動化腳本，或希望腳本能跨 Windows、Linux、macOS 執行，建議使用 PowerShell 7。

**它是目前主要發展方向，也比較適合現代開發與部署環境。**

### 舊專案：先確認原本環境

如果你接手的是舊腳本，不要急著直接丟到 PowerShell 7 執行。

**先檢查原本使用的版本，再確認相關模組是否支援 PowerShell 7。**

### Windows 專用管理腳本：視情況使用 Windows PowerShell 5.1

如果腳本依賴舊版 Windows 管理模組，或在公司內部環境已經長期用 Windows PowerShell 5.1 執行，那就不要貿然升級。

**建議先測試，再遷移。**

## 補充：為什麼 UTF-8 腳本在 PowerShell 7 可以跑，但 Windows PowerShell 不行？

⚡ 還有一個很常見、但容易被忽略的差異：**腳本檔案的文字編碼**。

💥 如果你的 `.ps1` 檔案是 **UTF-8 no BOM**，在 PowerShell 7 通常可以正常執行；但同一份檔案拿到 Windows PowerShell 5.1 執行時，卻可能失敗或出現亂碼。

原因是 PowerShell 7 預設使用 **UTF-8 no BOM**，但 Windows PowerShell 在讀取沒有 BOM 的腳本檔時，可能會把它誤判成系統傳統 ANSI Code Page。以繁體中文 Windows 環境來說，就可能被當成 Big5 之類的編碼來解讀。

只要腳本裡包含中文、特殊符號，或其他非 ASCII 字元，就可能因此解析錯誤。

例如：

```text
UTF-8 no BOM
PowerShell 7：通常可以正常執行
Windows PowerShell 5.1：可能失敗或亂碼

UTF-8 with BOM
PowerShell 7：通常可以正常執行
Windows PowerShell 5.1：通常可以正常執行
```

這裡的 BOM，也就是 Byte Order Mark，可以把它理解成檔案開頭的一個編碼標記。它會明確告訴 Windows PowerShell：

> 這個檔案是 UTF-8，請不要用 ANSI 編碼去解讀。

所以，如果你的腳本需要同時相容 PowerShell 7 和 Windows PowerShell 5.1，而且內容包含中文或其他非 ASCII 字元，建議把 `.ps1` 存成：

```text
UTF-8 with BOM
```

反過來說，如果你的腳本只會在 PowerShell 7 或跨平台環境執行，通常使用：

```text
UTF-8 no BOM
```

會比較符合現代 PowerShell 的預設行為。

😅 這也是為什麼同一份腳本在 PowerShell 7 可以跑，但在 Windows PowerShell 5.1 不行；而你只要改成 UTF-8 with BOM，它就突然正常了。

不是腳本內容本身神秘地壞掉，而是 Windows PowerShell 一開始就用錯編碼讀它。

## 總結

你可以用這句話記住兩者差異：

**Windows PowerShell 是舊版、Windows 專用、常見版本是 5.1；PowerShell 是新版、跨平台、通常指 PowerShell 7。**

下次看到教學、文件或同事說「PowerShell」時，不妨多確認一句：

> 你指的是 Windows PowerShell 5.1，還是 PowerShell 7？

這個小小的確認，往往可以避免很多環境不一致造成的問題。
