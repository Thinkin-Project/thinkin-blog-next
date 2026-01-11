---
title: '里氏替換原則 LSP'
description: '先聽爸爸說'
slug: 'oo-liskov-substitution-principle'
date: '2020-03-16'
drafted: false
featured: false
topic: 'object-oriented-design-principles'
tags: ['solid']
authors: ['neil-tsai']
---

此篇文章偏重於以圖解方式，簡單帶大家了解 **里氏替換原則** 哦，有興趣就往下看吧！

LSP 為 Liskov Substitution Principle 簡寫，均意為里氏替換原則。

👍 若開發途中有持續遵循 LSP 原則的話，其實它會讓你程式越來越彈性！（越好實現出 [OCP](/posts/oo-open-closed-principle) 原則）

## 定義

以下擷取自 [wikipedia](https://en.wikipedia.org/wiki/Liskov_substitution_principle)

> if S is a subtype of T, then objects of type T may be replaced with objects of type S (i.e. an object of type T may be substituted with any object of a subtype S) without altering any of the desirable properties of the program (correctness, task performed, etc.).

假如 S 是 T 的子型態，則 T 型態的物件（OT）可以被 S 型態的物件（OS）所取代（換句話說，T 型態的物件（OT）可以被任何 S 型態的物件（OS）所替代），而不改變程式任何的描述（正確性、行為···等等）。

## 見解

確實定義不是那麼好理解，簡單說就是：

⭐️ 不論是透過**繼承（Inherit）**、**實作（Implement）的子類別**，在**程式經過替換子類別**這一手段下，以**不影響其正確性或行為**情況下，就算是有符合該原則了！

## 類別圖探討

這邊依舊拿 [SRP](/posts/oo-single-responsibility-principle) 最後討論出來的方案 C 做說明，如下原圖：

![srp-5](/assets/posts/oo-single-responsibility-principle/view-class-diagram-think-srp-5.jpg)

<center>
    Plan C
</center>

接著將焦點移向右下角 Printer 處。

![lsp-1](/assets/posts/oo-liskov-substitution-principle/view-class-diagram-think-lsp-1.jpg)

❓ 紅圈處就符合 LSP 原則，為什麼？

以程式的行為來看，要把文章做呈現（Print），但是我可以透過使用文字文件（PlainText）、可攜式文件（PDF）來呈現文章。

那假如今天我想要透過網頁（Html）來呈現，只要去實作 Printer 介面，然後讓 ConcreteUtility 替換掉原本 printer 的實例（物件）就可以了！

即便是替換掉了 printer 實例（物件） ，也沒有因此改變掉程式原本的行為（文章呈現），故符合 LSP 原則！

## 參考

💭 [PHP OO 物件導向原則:里氏替換原則LSP](https://wadehuanglearning.blogspot.com/2017/08/php-oo-lsp.html)

## 結尾

感謝各位花時間看完此篇文章，如果本文中有描述錯誤，還請各位指教。

希望這篇文章可以讓大家了解 Liskov Substitution Principle，開發途中經常會碰到需要繼承（Inherit）、實作（Implement）的時候，但**多數撰寫程式的人，一開始不太會意識到寫程式是專注於行為上，而是以寫程式的角度來操作繼承跟實作，所以不知不覺中就違反了 LSP 原則！**

我想這一部分多少也有從大學時期所帶出來的知識相關，知識的”活”用跟”硬”用，我想差別就在這了···
