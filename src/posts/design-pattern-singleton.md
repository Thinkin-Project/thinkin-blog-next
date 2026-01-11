---
title: 'Singleton 單例模式'
description: '單純但暗藏危機'
slug: 'design-pattern-singleton'
date: '2020-03-24'
drafted: false
featured: false
topic: 'design-pattern'
tags: ['creational-pattern']
authors: ['neil-tsai']
---

此篇文章簡單帶大家了解 **Singleton 單例模式** 哦，有興趣就往下看吧！

## 目的

以下擷取自 [wikipedia](https://en.wikipedia.org/wiki/Singleton_pattern)

> The singleton pattern is a software design pattern that restricts the instantiation of a class to one “single” instance.

單例模式是軟體設計原則之一，其目的在於將類別實例化限制為一”單個”實例。

❗️ 換句話說，從應用程式開始生命週期所創造的這一”單個”實例，理論上到應用程式結束其生命週期都只會存在一個。

## 類別圖

![singleton](/assets/posts/design-pattern-singleton/singleton.jpg)

從類別圖看有幾點需注意：

1. instance 為靜態變數
2. Singleton 類別建構子為 private（不讓其它類別有機會創造實例）
3. getInstance 為靜態方法

## 程式碼

```typescript
class Singleton {

    private static instance: Singleton;

    private constructor() { }

    /**
     * 取得實例
     * @returns Singleton
     */
    public static getInstance(): Singleton {

        if(!Singleton.instance)
            Singleton.instance = new Singleton();

        return Singleton.instance;
    }
}
```

詳細可參考[範例程式碼](https://github.com/cdcd72/DesignPatterns/tree/master/Creational/Singleton)···

## 好處

1. 從應用程式生命週期開始至結束，應**保證只能取到一個且相同的實例**（物件）
2. 因第 1 點關係，故可**減少創造實例的開銷**（記憶體浪費）
3. 與全域變數不同的是該模式可以**延遲實例初始化（Lazy initialization）**，但在部分程式語言實作該模式時，仍要注意是否有同步（Synchronize）問題發生

## 壞處

1. 程式碼在無形之中有了**隱藏性的依賴關係**（因為**不是透過介面暴露而得知**）
2. 若單純僅使用該模式，它算是**打破了 [SRP](/posts/oo-single-responsibility-principle)**（Singleton 類別包含了**創建目標類別實例的職責**及**目標類別實例原有的行為執行職責**），但可以透過工廠（Factory）來分離出創建實例的職責
3. 因第 1 點關係，故會導致**類別之間緊密耦合（Tight coupling）**
4. 因第 3 點關係，**單元測試會變得較為困難**，因單元測試比較大的前提會是類別之間需[鬆耦合（Loose coupling）](https://en.wikipedia.org/wiki/Loose_coupling)，從而可以獨立對它們進行單元測試
5. 由於保證只能取到一個且相同的實例，所以在**[多執行緒（Multi-threading）](<https://en.wikipedia.org/wiki/Thread_(computing)#Multithreading>)下，需要特別注意狀態變化**，若要最小程度的影響應用程式，則該實例執行途中變動幅度應該要最小
6. 因第 5 點關係，一但取出之實例對於商業邏輯有極大程度影響時，則每一次商業邏輯的結果不一定會如預期，間接導致單元測試很難撰寫（因為沒有可以預期的案例）
7. 一般來說透過靜態方法來初始化實例是比較好的方式，但靜態方法會導致開發人員知道他們不需要知道的類別內部程式碼結構
8. 因第 7 點關係，若有寫過單元測試就會知道，即便使用一些單元測試框架，也非常不好處理靜態方法···
9. 要擴展該模式並非易事（若以全面性來考量，則會考慮太多狀況），可能可以透過[裝飾者模式（Decorator Pattern）](https://github.com/cdcd72/DesignPatterns/tree/master/Structural/Decorator)在不影響現階段行為下，附加新行為於物件上
10. 若以某些語言（原生或非原生）GC 回收機制來看，該模式可能會有較為棘手的記憶體管理問題出現

## 結論

其實該模式早前就於 GoF《Design Patterns: Elements of Reusable Object-Oriented Software》中出現，但其實到目前為止，還沒有一個完全的定調認為該模式屬於[反模式（Anti-pattern）](https://en.wikipedia.org/wiki/Anti-pattern)，所以網路上有蠻多人議論紛紛，到底該模式是不是一個反模式！？

總結來說，使用 Singleton 模式需要非常小心且最好經過深思熟慮，至於它是不是反模式，則端看開發人員當初的考量及如何去設計類別···

如果是我的話，我會先考慮什麼情況會需要使用單例模式，有沒有其它的替代方案可以先處理！？因為在怎麼樣我都想避掉使用靜態變數或方法，因為一但使用了靜態變數或方法，接著你開始就要考慮如何撰寫單元測試了···😱

## 參考

💭 [What Is a Singleton?](https://medium.com/better-programming/what-is-a-singleton-2dc38ca08e92)

💭 [What is so bad about singletons? [closed]](https://stackoverflow.com/questions/137975/what-are-drawbacks-or-disadvantages-of-singleton-pattern)

💭 [When Singleton Becomes an Anti-Pattern](https://dzone.com/articles/singleton-anti-pattern)
