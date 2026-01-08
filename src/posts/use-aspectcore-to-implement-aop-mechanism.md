---
title: 'AspectCore'
description: '.Net Core 輕量 AOP 實現'
slug: 'use-aspectcore-to-implement-aop-mechanism'
date: '2020-03-20'
drafted: false
featured: false
topic: 'net-core'
tags: ['aop', 'aspectcore']
authors: ['neil']
---

此篇文章主要帶大家**利用 AspectCore 實作 AOP 機制於 .Net Core 3.1** 上，有興趣就往下看吧！

## 剖面導向程式設計 AOP

AOP 為 Aspect-Oriented Programming 簡寫，均意為剖面導向程式設計。

## 目的

以下擷取自 [wikipedia](https://en.wikipedia.org/wiki/Aspect-oriented_programming)

👉 **將橫切關注點（Cross-cutting concerns）與業務主體進行進一步分離，以提高程式碼的模組化程度！**

## 見解

當今天系統擁有足夠多的商業邏輯（服務、使用案例···）時，你會希望在每一支商業邏輯上都加上記錄 Log 的功能嗎？

倘若從不同角度來看這件事：

- 使用者：當然要留下記錄阿！
- 開發者：哇！這可能要改到死了···（維護成本太高）

所以回過頭看 AOP 的目的就能知道是要**將一些不應該屬於商業邏輯的其它功能（日誌、安全檢查···）切離！**

換句話說，我可以決定（透過設定一些規則）哪些商業邏輯需要去記錄 Log 這件事，而記錄 Log 的程式碼則不會存在於商業邏輯之中。

更詳細的內容可參考下方連結，就不再多描述囉···

💭 [AOP 觀念與術語](https://openhome.cc/Gossip/SpringGossip/AOPConcept.html)

## AspectCore

### 介紹

AspectCore 是適用於 .Net Core 上的輕量級 AOP 解決方案，它更好的遵循 .Net Core 模組化開發理念，可以更容易建構低耦合、易擴展的 Web 應用程式。AspectCore 使用 Emit 實現高效的動態代理而不依賴任何第三方 AOP 函式庫。

### 基本使用步驟

#### 初始化專案

1. 建立 `global.json` 檔案，將 .NET Core SDK 限定在 `3.1.101` 版本
   ```bash
   dotnet new globaljson --sdk-version 3.1.101
   ```
2. 建立 `AspectCoreAopDemo` 專案
   ```bash
   dotnet new webapi -n AspectCoreAopDemo
   cd AspectCoreAopDemo
   ```
3. 安裝 `AspectCore.Extensions.DependencyInjection` 套件
   ```bash
   dotnet add package AspectCore.Extensions.DependencyInjection
   ```

#### 定義攔截器

透過繼承 `AbstractInterceptorAttribute` 可以自行定義攔截器。

```csharp
// ServiceAopAttribute.cs

public class ServiceAopAttribute : AbstractInterceptorAttribute
{
    // 自定義攔截器也可以透過 DI 注入所需服務...
    [FromServiceContext]
    public ILogger<ServiceAopAttribute> Logger { get; set; }

    public async override Task Invoke(AspectContext context, AspectDelegate next)
    {
        try
        {
            await next(context);  // 進入 Service 前會於此處被攔截（如果符合被攔截的規則）...
        }
        catch (Exception ex)
        {
            Logger.LogError(ex.ToString());  // 記錄例外錯誤...
            throw;
        }
    }
}
```

#### 設定動態代理

1. `Startup.cs` 於 `ConfigureServices` 方法內設定動態代理（代理規則設定）
   ```csharp
   // Startup.cs
   // 略...

    public void ConfigureServices(IServiceCollection services)
    {
        // 注入所需 Services
        services.AddTransient<ICustomService, CustomService>();
        services.AddTransient<IOtherService, OtherService>();

        services.AddControllers();

        // 設定動態代理
        services.ConfigureDynamicProxy(config => { config.Interceptors.AddTyped<ServiceAopAttribute>(Predicates.ForMethod("Execute*")); });
    }

    // 略...
   ```
   ❗️ **它是會爬介面定義，不是只有單純看類別（只有類別且無實作介面，好像就不會被偵測到需要代理）。**

   **常用代理規則**設定：

   - 全域會被代理：  
    `config.Interceptors.AddTyped<ServiceAopAttribute>();`
   - 後綴為 Service 會被代理：  
    `config.Interceptors.AddTyped<ServiceAopAttribute>(Predicates.ForService("*Service"));`
   - 前綴為 Execute 的方法會被代理：  
    `config.Interceptors.AddTyped<ServiceAopAttribute>(Predicates.ForMethod("Execute*"));`
   - App1 命名空間下的 Service 不會被代理：  
    `config.NonAspectPredicates.AddNamespace("App1");`
   - 最後一層為 App1 的命名空間下的 Service 不會被代理：  
    `config.NonAspectPredicates.AddNamespace(".App1");`
   - ICustomService 不會被代理：  
    `config.NonAspectPredicates.AddService("ICustomService");`
   - 後綴為 Service 不會被代理：  
    `config.NonAspectPredicates.AddService("Service");`
   - 命名為 Query 的方法不會被代理：  
    `config.NonAspectPredicates.AddMethod("Query");`
   - 後綴為 Query 的方法不會被代理：  
    `config.NonAspectPredicates.AddMethod("*Query");`

   ❗️ AspectCore 也提供 `NonAspectAttribute` 來使得 Service 或 Method **不會**被代理：

   ```csharp
   // IOtherService.cs

   public interface IOtherService
   {
        string Execute();

        [NonAspect]
        string ExecuteXXXX(); // 此方法並不會被代理...（即便是 Startup 有設定其代理規則，也會被排除...）

        string GetXXXX();
   }
   ```

2. `Program.cs` 於 `CreateHostBuilder` 處加上 `UseServiceProviderFactory(new DynamicProxyServiceProviderFactory())`，將預設 DI 交由 AspectCore 處理
   ```csharp
   // Program.cs
   // 略...
   
   public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>();
            })
            // 略...
            .UseServiceProviderFactory(new DynamicProxyServiceProviderFactory());
   ```

若上述都有做完，基本的 AOP 機制也就被實現完了👏

回頭思考做了哪些動作呢？

1. 增加自定義攔截器
2. 設定代理規則
3. 替換預設 DI 交由 AspectCore 處理

最簡單的情況大概就是動了三個檔案吧··· 😂

換句話說，即便是等到**開發中後期才套入 AOP 機制也都不會太麻煩**呢！

### 實際使用情形

可以參考[範例專案](https://github.com/cdcd72/NetCore.AspectCore.AOP.Demo)，其中 `README.md` 有相關使用上的描述！

#### 情境

代理規則設定：`config.Interceptors.AddTyped<ServiceAopAttribute>(Predicates.ForMethod ("Execute*"));`

![aspect-core-4](/assets/posts/use-aspectcore-to-implement-aop-mechanism/aspect-core-4.jpg)

<center>
    ICustomService.cs
</center>

![aspect-core-5](/assets/posts/use-aspectcore-to-implement-aop-mechanism/aspect-core-5.jpg)

<center>
    IOtherService.cs
</center>

1️⃣ 若我打 `https://localhost:44389/customexecutexxxx`，結果為：

![aspect-core-2](/assets/posts/use-aspectcore-to-implement-aop-mechanism/aspect-core-2.jpg)

<center>
    Executed method can catched by serviceaop
</center>

因為符合所設定的代理規則，所以呼叫 `CustomService.ExecuteXXXX` 方法前會經由 ServiceAop（被攔截）。

2️⃣ 若我打 `https://localhost:44389/otherexecutexxxx`，結果為：

![aspect-core-3](/assets/posts/use-aspectcore-to-implement-aop-mechanism/aspect-core-3.jpg)

<center>
    Executed method can’t catched by serviceaop
</center>

由於 IOtherService 該方法處加上 NonAspectAttribute， 所以呼叫 `OtherService.ExecuteXXXX` 方法前不會經由 ServiceAop（不會被攔截）。

## 參考

我所使用 `AspectCore.Extensions.DependencyInjection` 版本為 2.0.0 唷！

雖然都是從以下連結參考內容，但已不建議再去看囉，因為資訊已過時了。

💭 [ASP.NET Core 3.0 使用 AspectCore-Framework 实现 AOP](https://www.cnblogs.com/king-23100/p/11821020.html)

💭 [Asp.Net Core轻量级Aop解决方案：AspectCore](https://www.cnblogs.com/liuhaoyang/p/aspectcore-introduction-1.html)

💭 [.NET Core中使用开源的AOP框架 AspectCore](http://www.vnfan.com/buffett/d/f51118e10b91283.html)

## 結尾

以前在維護公司專案的時候，也有使用到 AOP 的概念來切離關注點，只是那時候對 AOP 的認識甚少，少到我根本也不知道為什麼要套用 AOP，直到最近需要 Survey AOP 概念時，才真正了解為什麼要 AOP？那它究竟能幫助我們到什麼程度？

其實 .Net Core 本身也就有 Middleware 可以實作類似 AOP 的概念（Ex. 攔截要求···等等），但是要從頭思考怎麼用 Middleware 去實現時，我決定先去找找有沒有更單純的替代方案··· 😂

於是我找到了 AspectCore 並試用了一下，覺得操作真的很單純，基本上不用動到太多程式碼，代理規則愛怎麼換就怎麼換，故分享給大家知道！因為網路上大多數會找到對岸的文章，但是多數文章資訊都已經過時了···