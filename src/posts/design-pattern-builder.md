---
title: 'Builder 建造者模式'
description: '複雜物件建構及樣貌分離'
slug: 'design-pattern-builder'
date: '2020-12-14'
drafted: false
featured: false
topic: '軟體設計原則'
tags: ['創建型模式']
authors: ['neil']
---

此篇文章簡單帶大家了解 **Builder 建造者模式**，有興趣就往下看吧！

## 目的

以下擷取自 [wikipedia](https://en.wikipedia.org/wiki/Builder_pattern)

> The builder pattern is a design pattern designed to provide a flexible solution to various object creation problems in object-oriented programming. The intent of the Builder design pattern is to separate the construction of a complex object from its representation.

建造者模式是軟體設計原則之一，被設計來提供一個彈性解法來**處理創建多樣貌的物件問題**，其目的在於**將複雜物件的建構及樣貌分離**。

## Builder 實務使用路線圖

![builder-1](/assets/posts/design-pattern-builder/builder-1.jpg)

❗ 文章會專注說明 Route 1 做法，而 Route 2 只需要把 Director 拿掉即可，不再贅述！

## 類別圖

![builder-2](/assets/posts/design-pattern-builder/builder-2.png)

## 程式碼範例

### Director

```typescript
// 旅行社 - Director
export class TravelAgency {

    private vocationBuilder: VocationBuilder;

    constructor(vocationBuilder: VocationBuilder) {
        this.vocationBuilder = vocationBuilder;
    }

    /**
     * 創造假期
     * @param  {Date} beginDate?
     * @param  {Date} endDate?
     * @param  {Hotel} hotel?
     * @param  {Restaurant} restaurant?
     * @returns Vocation
     */
    createVocation(beginDate?: Date, endDate?: Date, hotel?: Hotel, restaurant?: Restaurant): Vocation {
        return this.vocationBuilder
                .setBeginDate(beginDate) // 設定開始日期
                .setEndDate(endDate) // 設定結束日期
                .setHotel(hotel) // 設定旅館
                .setRestaurant(restaurant) // 設定餐廳
                .create();
    }
}
```

### Builder

```typescript
// 假期建造者 - Builder
export interface VocationBuilder {

    /**
     * 設定開始日期
     * @param  {Date} date?
     * @returns VocationBuilder
     */
    setBeginDate(date?: Date): VocationBuilder;

    /**
     * 設定結束日期
     * @param  {Date} date?
     * @returns VocationBuilder
     */
    setEndDate(date?: Date): VocationBuilder;

    /**
     * 設定住哪間旅館
     * @param  {Hotel} hotel?
     * @returns VocationBuilder
     */
    setHotel(hotel?: Hotel): VocationBuilder;

    /**
     * 設定吃哪間餐廳
     * @param  {Restaurant} restaurant?
     * @returns VocationBuilder
     */
    setRestaurant(restaurant?: Restaurant): VocationBuilder;

    /**
     * 讓使用者能取得假期物件
     * @returns Vocation
     */
    create(): Vocation;
}

// 七天假期建造者 - ConcreteBuilder
export class SevenDaysVocationBuilder implements VocationBuilder {

    // 每天經過毫秒數
    private PER_DAY_MILLISECONDS: number = 1000 * 60 * 60 * 24;

    private beginDate?: Date;
    private endDate?: Date;
    private hotel?: Hotel;
    private restaurant?: Restaurant;

    setBeginDate(date?: Date): VocationBuilder {
        this.beginDate = date;
        return this;
    }

    setEndDate(date?: Date): VocationBuilder {

        // ... 需滿足假期 7 天相關計算邏輯 ...
        if(this.beginDate !== undefined && date !== undefined) {
            if(this.diffDays(this.beginDate, date) === 7) {
                // 日期剛好差 7 天
                this.endDate = date;
            } else {
                // 日期可能小於或大於 7 天，則依據開始日期 + 7 天
                this.endDate = new Date(this.beginDate.getTime() + (7 * this.PER_DAY_MILLISECONDS))
            }
        }
        // ...

        return this;
    }

    setHotel(hotel?: Hotel): VocationBuilder {
        this.hotel = hotel;
        return this;
    }

    setRestaurant(restaurant?: Restaurant): VocationBuilder {
        this.restaurant = restaurant;
        return this;
    }

    create(): Vocation {

        // 若無設定結束日期，則依據開始日期 + 7 天
        if(this.beginDate !== undefined && this.endDate === undefined)
            this.endDate = new Date(this.beginDate.getTime() + (7 * this.PER_DAY_MILLISECONDS));

        return new Vocation(this.beginDate, this.endDate, this.hotel, this.restaurant);
    }

    /**
     * 計算差異天數
     * @param  {Date} date1
     * @param  {Date} date2
     * @returns number
     */
    private diffDays(date1: Date, date2: Date): number {
        return Math.abs(date1.getTime() - date2.getTime()) / this.PER_DAY_MILLISECONDS;
    }
}
```

### Model

```typescript
// 假期 - Product
export class Vocation {

    private beginDate?: Date;
    private endDate?: Date;
    private hotel?: Hotel;
    private restaurant?: Restaurant;

    constructor(beginDate?: Date, endDate?: Date, hotel?: Hotel, restaurant?: Restaurant) {
        this.beginDate = beginDate;
        this.endDate = endDate;
        this.hotel = hotel;
        this.restaurant = restaurant;
    }

    /**
     * 取得開始日期
     * @returns Date
     */
    getBeginDate(): Date | undefined {
        return this.beginDate;
    }

    /**
     * 取得結束日期
     * @returns Date
     */
    getEndDate(): Date | undefined {
        return this.endDate;
    }

    /**
     * 取得旅館
     * @returns Hotel
     */
    getHotel(): Hotel | undefined {
        return this.hotel;
    }

    /**
     * 取得餐廳
     * @returns Restaurant
     */
    getRestaurant(): Restaurant | undefined {
        return this.restaurant;
    }
}
```

```typescript
// 旅館
export class Hotel {

    private name: string;

    constructor(name: string) {
        this.name = name;
    }

    /**
     * 取得名稱
     * @returns string
     */
    getName(): string {
        return this.name;
    }

    // ...
}
```

```typescript
// 餐廳
export class Restaurant {

    private name: string;

    constructor(name: string) {
        this.name = name;
    }

    /**
     * 取得名稱
     * @returns string
     */
    getName(): string {
        return this.name;
    }

    // ...
}
```

詳細可參考[範例程式碼](https://github.com/cdcd72/DesignPatterns/tree/master/Creational/Builder)···

## Builder 使用時機

1. **當你/妳今天想要創造同一物件，但它可以有不同樣貌時** (可以想像每個人可規劃不同的假期，但最終都是假期這件事···)
2. **想要簡化創造物件的複雜程度** (每個人可規劃不同假期，但總不可能一開始就把條件都給好，那假設有 100 種可能？所以我需要寫能滿足這 100 種可能的建構子？)

## 好處

1. 可以一步一步依照需求來建構不同樣貌的相同物件
2. Builder 顧名思義，只負責建構你/妳所需的物件，所以可以跟你/妳的業務邏輯有所區隔 (符合[單一職責原則](/posts/oo-single-responsibility-principle))

## 壞處

1. 增加可維護性的代價，你/妳懂得 😅 ··· (你/妳可能會有許多 Builder，若更嚴謹點再把 Director 加進來，類別數量上升了，數量變多管理上就會變得不容易，更何況是多人協作情況···)

## 補充

1. 整個複雜物件的建構過程被封裝起來，所以客戶端無法影響物件建立的步驟 (物件建立這件事對客戶端是隱藏的)
2. 對於客戶端而言，允許用多個步驟來建立物件，但要是不知道有哪些方法可以用，可能也無法建立出想要的物件
3. 對其下生成的複雜物件之間會有部分 (is-part-of) 關係，意指藉由多個部分才算一個整體 (假期中沒有旅館可能就怪怪的···)
4. Director 實際扮演的角色為指揮 Builder 如何建構物件，但多數實務上會把 Director 省略掉，讓客戶端直接控制其建構步驟

## 結論

眼尖的朋友可能會注意到 Builder 介面定義的方法均是回傳介面自己，或許這不是很純正的 Builder Pattern，但這樣寫是有好處的，讓我娓娓道來 😏 ···

其實 Builder Pattern 可以結合 Fluent Interface 做到更進階的用法，詳細可以參考我之前寫的「[Fluent Interface｜一種程式碼”寫作”風格](/posts/coding-style-of-fluent-interface)」哦！

看完 Builder Pattern 之後醒悟不少，了解到如果需要不同樣貌的相同物件，可以不需要透過補上建構子來達成這件事，往往實務在看一個類別的建構子，太多選擇反而會不知道怎麼用這個類別，不然就是一定要給不太需要的參數，程式可讀性就變差了 😩 ···

而套用 Builder Pattern 甚至可以把一些建構方式條件化或者是推遲建構的時間，種種這些皆變成了可能，更彈性的建構物件，善用 Builder Pattern 吧！

## 參考

💭 [Builder](https://refactoring.guru/design-patterns/builder)
