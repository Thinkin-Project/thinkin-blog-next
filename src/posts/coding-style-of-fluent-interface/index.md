---
title: 'Fluent Interface'
description: '一種程式碼”寫作”風格'
slug: 'coding-style-of-fluent-interface'
date: '2020-03-02'
drafted: false
featured: false
topic: 'api-design-pattern'
tags: ['fluent-interface', 'code-readability']
authors: ['neil-tsai']
---

其實 [Fluent Interface（流暢介面）](https://en.wikipedia.org/wiki/Fluent_interface)不是新概念，早在西元 2005 年就由 [Eric Evans](https://en.wikipedia.org/w/index.php?title=Eric_Evans_(technologist)&action=edit&redlink=1) 和 [Martin Fowler](https://en.wikipedia.org/wiki/Martin_Fowler_(software_engineer)) 所提出，但我覺得值得讓大家初步了解其實作概念，因為真的很有趣呀ヽ(✿ﾟ▽ﾟ)ノ

## Fluent Interface 介紹

它其實也是一種**[物件導向（Object-oriented）](https://en.wikipedia.org/wiki/Object-oriented_design)API 的實作**，而該實作上會**廣泛地依賴[方法鏈（Method chaining）](https://en.wikipedia.org/wiki/Method_chaining)**。

⭐️ 最終目標：**增加寫[特定領域語言（Domain-specific language）](https://en.wikipedia.org/wiki/Domain-specific_language)的程式碼可讀性！！！**

⭐️ 三種**特性**：

- 透過呼叫方法的回傳值來定義（物件內容）
- 有自我參考特性，傳出及傳入物件等價
- 透過回傳 void 或造成傳出及傳入物件不等價情況則可以終止（意即結尾）

## 未套用 Fluent Interface

舉個例子來說，當**使用者在旅遊網站預訂了一個假期**，背後實際程式（以 TypeScript 為例）可能是這樣寫：

```typescript
interface VocationBuilder {

    /**
     * 設定開始日期
     * @returns void
     */
    setBeginDate(date: Date): void;

    /**
     * 設定結束日期
     * @returns void
     */
    setEndDate(date: Date): void;

    /**
     * 設定住哪間旅館
     * @returns void
     */
    setHotel(hotel: Hotel): void;

    /**
     * 設定吃哪間餐廳
     * @returns void
     */
    setRestaurant(restaurant: Restaurant): void;

    /**
     * 讓使用者能取得假期物件
     * @returns Vocation
     */
    create(): Vocation;
}
```

```typescript
class ConcreteVocationBuilder implements VocationBuilder {

    // 定義假期屬性
    private beginDate: Date;
    private endDate: Date;
    private hotel: Hotel;
    private restaurant: Restaurant;
    
    // 設定假期起始日
    setBeginDate(date: Date): void {
        this.beginDate = date;
    }

    // 設定假期結束日
    setEndDate(date: Date): void {
        this.endDate = date;
    }

    // 設定旅館
    setHotel(hotel: Hotel): void {
        this.hotel = hotel;
    }

    // 設定餐廳
    setRestaurant(restaurant: Restaurant): void {
        this.restaurant = restaurant;
    }

    // 創造假期
    create(): Vocation {
        return new Vocation(this.beginDate, this.endDate, this.hotel, this.restaurant);
    }
}
```

```typescript
// 假期物件建造者
const vocationBuilder: VocationBuilder = new ConcreteVocationBuilder();

// 起始日期
const beginDate: Date = new Date('2019-12-23');

// 結束日期
const endDate: Date = new Date('2019-12-30');

// 某旅館
const hotel: Hotel = new Hotel('Some Hotel');

// 某餐廳
const restaurant: Restaurant = new Restaurant('Some Restaurant');

// 設定假期物件建造者
vocationBuilder.setBeginDate(beginDate);
vocationBuilder.setEndDate(endDate);
vocationBuilder.setHotel(hotel);
vocationBuilder.setRestaurant(restaurant);

// 創造假期
const vocation: Vocation = vocationBuilder.create();
```

以**工程師的角度**來看，上面程式碼其實看起來沒什麼太大問題，因為**最終目標是取得假期物件來做一些頁面呈現、資料操作**···等等。

倘若我們會**需要和 PM、SA 討論的角度**來看，程式碼可讀性可能就差了，更何況是我如果把 VocationBuilder 的設定事項移到程式碼較前面幾行（行數小位置），最後幾行我才取得假期物件，就變成工程師還要找程式碼上下文 ··· 眼神死 (›´ω`‹ )

## 套用 Fluent Interface

那實際導入流暢介面會變成怎麼樣呢？

```typescript
interface VocationBuilder {

    /**
     * 設定開始日期
     * @param  {Date} date
     * @returns VocationBuilder
     */
    setBeginDate(date: Date): VocationBuilder;

    /**
     * 設定結束日期
     * @param  {Date} date
     * @returns VocationBuilder
     */
    setEndDate(date: Date): VocationBuilder;

    /**
     * 設定住哪間旅館
     * @param  {Hotel} hotel
     * @returns VocationBuilder
     */
    setHotel(hotel: Hotel): VocationBuilder;

    /**
     * 設定吃哪間餐廳
     * @param  {Restaurant} restaurant
     * @returns VocationBuilder
     */
    setRestaurant(restaurant: Restaurant): VocationBuilder;

    /**
     * 讓使用者能取得假期物件
     * @returns Vocation
     */
    create(): Vocation;
}
```

```typescript
class ConcreteVocationBuilder implements VocationBuilder {

    // 定義假期屬性
    private beginDate: Date;
    private endDate: Date;
    private hotel: Hotel;
    private restaurant: Restaurant;
    
    // 設定假期起始日
    setBeginDate(date: Date): VocationBuilder {
        this.beginDate = date;
        return this;
    }

    // 設定假期結束日
    setEndDate(date: Date): VocationBuilder {
        this.endDate = date;
        return this;
    }

    // 設定旅館
    setHotel(hotel: Hotel): VocationBuilder {
        this.hotel = hotel;
        return this;
    }

    // 設定餐廳
    setRestaurant(restaurant: Restaurant): VocationBuilder {
        this.restaurant = restaurant;
        return this;
    }

    // 創造假期
    create(): Vocation {
        return new Vocation(this.beginDate, this.endDate, this.hotel, this.restaurant);
    }
}
```

```typescript
// 假期物件建造者
const vocationBuilder: VocationBuilder = new ConcreteVocationBuilder();

// 起始日期
const beginDate: Date = new Date('2019-12-23');

// 結束日期
const endDate: Date = new Date('2019-12-30');

// 某旅館
const hotel: Hotel = new Hotel('Some Hotel');

// 某餐廳
const restaurant: Restaurant = new Restaurant('Some Restaurant');

// 創造假期
const vocation: Vocation = vocationBuilder.setBeginDate(beginDate)
                                          .setEndDate(endDate)
                                          .setHotel(hotel)
                                          .setRestaurant(restaurant)
                                          .create();
```

相較於未套用情況，其實**只有調整介面內的方法回傳自己介面本身**，這樣表示**只要是實作該介面的類別都能相容**！

❗️ **不過還是要注意的是上面所提到關於它的特性，需維持傳出及傳入物件等價，才能使其使用上成立。**

## 好處

1. 維持類別封裝（透過呼叫方法操作物件本身）
2. 簡化程式碼撰寫量並增加可讀性（寫程式像在說話一樣，換句話說就是程式碼逐漸 Domain 化）
3. 對於程式的解讀可擴大到整個團隊，而不是只有工程師小圈圈 (´_ゝ`)

## 壞處

1. 某些時候不一定好除錯

## 使用時機

1. 有物件難以設置或使用的情況
2. 想提供給別人使用的 API 逐漸往特定領域語言化（意指於特定領域可以較直覺去使用）
3. 針對同一物件需大量設定或方法呼叫的場合

## Fluent Interface vs. Extension Method

可能有人會問 Fluent Interface 和 C# 3.0 推出的 Extension Method 有什麼不一樣？

Extension Method 其實光是**特性**就和 Fluent Interface 有蠻大差異哦！

⭐️ 三種**特性**：

- 通常回傳常數
- 沒有特定的終止條件，可依需求一再呼叫使用
- 傳出及傳入並無實質等價關係（下一次的傳入會受前一次傳出而有不同，以此類推）

Extension Method 也蠻值得討論的，不過微軟官方文件已經寫得蠻清楚了，詳細可以看看下方連結！

💭 [擴充方法 (C# 程式設計手冊)](https://docs.microsoft.com/zh-tw/dotnet/csharp/programming-guide/classes-and-structs/extension-methods)

## 參考

💭 [Fluent Interface from Java design patterns](https://java-design-patterns.com/patterns/fluentinterface/)

💭 [How to Design and Implement the Fluent Interface Pattern in C#](https://assist-software.net/blog/design-and-implement-fluent-interface-pattern-c)

💭 [利用 Swift 5.1 新功能實作 Fluent Interface 讓程式碼更易讀流暢！](https://www.appcoda.com.tw/fluent-interface/)

💭 [[.NET] Fluent Interface: 實作 Method Chaining 又不會有耦合性的作法](https://dotblogs.com.tw/regionbbs/2012/01/12/fluent_interface_in_net)

## 結尾

感謝各位花時間看完此篇小文，如果本文中有描述錯誤，還請各位指教。

希望這篇文章可以讓大家初步了解 Fluent Interface 及其實作，其實它就是運用一些 OO 的基本觀念去改變程式碼樣貌，進而使程式碼逐漸變得像我們人所說話一樣，就好像我們寫文章一樣，每個人都有自己的”寫作”風格哦！