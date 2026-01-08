---
title: 'Worker Service 長時間服務託管'
description: '.NET Core 3 新功能'
slug: 'net-core-3-to-implement-worker-service'
date: '2020-04-13'
drafted: false
featured: false
topic: 'net-core'
tags: ['worker-service']
authors: ['neil']
---

此篇文章主要帶大家**利用 .NET Core 3.1 實作 Worker Service**，有興趣就往下看吧！

## Worker Service

### 介紹

**Worker Service** 是 .NET Core 3.0 新釋出的功能，官方也有釋出一專案範本（Template）供開發者去使用，讓開發者可以快速發展自己所需的**背景服務**！

![workerservice-0](/assets/posts/net-core-3-to-implement-worker-service/workerservice-0.jpg)

<center>
    Worker service project template
</center>

👉 一般來說 Worker Service 會被用來執行**需要長時間處理**或**定期需要做**的事情！（其實就有點像 Windows 平台上的 Windows Service、Linux 平台上的 Daemon Service）

舉幾個例子：

- 處理佇列（queue）上的訊息（message）或事件（event）
- 偵測改變（ex. 檔案、物件···）並快速做出回應
- 從各方資料來源彙總並利用
- 從資料攝取管道（data ingestion pipeline）中擷取所需片段
- 定期資料清理

⭐ 若搭配一些已有的排程套件（ex. Coravel），就可以讓 Worker Service 客製批次工作更加彈性化！

除上面所述之外，既然是從 .NET Core 衍生出來的功能，那它當然也有保留原有的那些被大幅簡化的特徵（日誌、依賴注入、組態設定···等等），好 Worker Service 不用嗎？ _(:3 ⌒ﾞ)_

### 基本使用步驟

#### 初始化專案

1️⃣ 建立 `global.json` 檔案，將 .NET Core SDK 限定在 `3.1.201` 版本

```bash
dotnet new globaljson --sdk-version 3.1.201
```

2️⃣ 建立 WorkerServiceDemo 專案

```bash
dotnet new worker -n WorkerServiceDemo
cd WorkerServiceDemo
```

以上做完，最基本可運行的 Worker Service 就做完了，真的不唬 😎···

#### 觀察專案結構

就是以 .NET Core 為基底的專案呀，不是錯覺 (◔౪◔)···

![workerservice-1](/assets/posts/net-core-3-to-implement-worker-service/workerservice-1.jpg)

<center>
    Project structure
</center>

❗ 關鍵差在使用了 `Microsoft.Extensions.Hosting` 套件，考試會考很重要？！

💭 [在 ASP.NET Core 中使用託管服務的背景工作](https://docs.microsoft.com/zh-tw/aspnet/core/fundamentals/host/hosted-services?view=aspnetcore-3.1&tabs=visual-studio)

該套件含有 `IHostedService` 介面，後續會再提及該介面為什麼很關鍵～

<center>
    ···
</center>

先看 `Worker` 類別好了···

![workerservice-3](/assets/posts/net-core-3-to-implement-worker-service/workerservice-3.jpg)

<center>
    Worker.cs
</center>

其實官方文件也描述得蠻清楚了，這個 `BackgroundService` 類別就是繼承了 `IHostedService` 及 `IDisposable` 介面，則開發者一定要覆寫的方法為 `ExecuteAsync` ，其餘 `StartAsync`、`StopAsync`、`Dispose` 等方法可視需求覆寫，但切記覆寫完最後依然要呼叫父類別方法哦！

💭 [利用.NET Core中的Worker Service，来创建windows服务或linux守护程序](https://www.cnblogs.com/OpenCoder/p/12191164.html)

<center>
    ···
</center>

接著來看 `Program` 類別···

![workerservice-2](/assets/posts/net-core-3-to-implement-worker-service/workerservice-2.jpg)

<center>
    Program.cs
</center>

需要於 `ConfigureServices` 中註冊所需的託管服務（有繼承 `IHostedService` 介面），以圖片為例就是 `Worker` 類別！

所以你/妳現在知道它的來龍去脈了嗎？當然若你/妳想了解更深入可以看看官方文件或已開源的程式碼唷～

#### 轉換為 Windows Service （Optional）

那如果我們想把已經寫好的 Worker Service 轉換為可以在 Windows 執行的服務，該怎麼做呢？

只要於專案新增 `Microsoft.Extensions.Hosting.WindowsServices` 套件就行了···

```bash
dotnet add package Microsoft.Extensions.Hosting.WindowsServices
```

接著在 `Program` 類別 `CreateHostBuilder` 處加上 `UseWindowsService()`，完工！

![workerservice-4](/assets/posts/net-core-3-to-implement-worker-service/workerservice-4.jpg)

<center>
    Add UseWindowsService()
</center>

<center>
    ···
</center>

部署為 Windows 服務的語法（透過 PowerShell）可參考如下：

```bash
# Build and Publish Application
dotnet build
dotnet publish -c Release -o "PathToPublish"

# Create ServiceName Service
sc.exe create ServiceName binpath="PathToPublish\ServiceName.exe"
```

- PathToPublish：將專案發行的路徑位置
- ServiceName：自定義服務名稱

語法執行完應該會類似如下圖，表示已建立了一個新服務：

![workerservice-6](/assets/posts/net-core-3-to-implement-worker-service/workerservice-6.jpg)

<center>
    Windows Service
</center>

這邊在附上一些控制服務的語法（透過 PowerShell）可參考如下：

```bash
# Start ServiceName Service
sc.exe start ServiceName  

# Stop ServiceName Service
sc.exe stop ServiceName   

# Query ServiceName Service Status
sc.exe query ServiceName  

# Delete ServiceName Service
sc.exe delete ServiceName 
```

- ServiceName：自定義服務名稱

#### 轉換為 Linux Daemon Service（Optional）

那如果我們想把已經寫好的 Worker Service 轉換為可以在 Linux 執行的服務，該怎麼做呢？

只要於專案新增 `Microsoft.Extensions.Hosting.Systemd` 套件就行了···

```bash
dotnet add package Microsoft.Extensions.Hosting.Systemd
```

接著在 `Program` 類別 `CreateHostBuilder` 處加上 `UseSystemd()`，完工！

![workerservice-5](/assets/posts/net-core-3-to-implement-worker-service/workerservice-5.jpg)

<center>
    Add UseSystemd()
</center>

部署為 Linux 服務的語法這部分我就沒有特別去深入了解了，之後有碰到我再回來補 😜···

#### 範例專案

可參考[範例專案](https://github.com/cdcd72/NetCore.WorkerService.Demo)···

## 參考

💭 [Upgrade net core2.2 app to net core3.1 as worker service](https://medium.com/ricos-note/upgrade-net-core2-2-app-to-net-core3-1-as-worker-service-cdf5aa6a329e)

💭 [Introduction to Worker Services in .NET Core 3.0](https://medium.com/@nickfane/introduction-to-worker-services-in-net-core-3-0-4bb3fc631225)

💭 [Creating a Worker Service in ASP .NET Core 3.0](https://medium.com/swlh/creating-a-worker-service-in-asp-net-core-3-0-6af5dc780c80)

💭 [WHAT ARE .NET WORKER SERVICES?](https://www.stevejgordon.co.uk/what-are-dotnet-worker-services)

💭 [[NETCore] ASP.NET Core 3.0 Worker Service 搭配 Coravel 建立排程服務](https://marcus116.blogspot.com/2019/09/netcore-aspnet-core-30-worker-service-with-coravel.html)

## 結尾

因為自己本身平常幾乎都是在 Windows 上開發，所以對於 .NET 的 Windows Service 不是很陌生，但那時候就覺得要部署一個 Windows Service 怎麼這個麻煩 😩···

而且視專案狀況，有可能會很肥（佔硬碟容量），更何況是若管理不慎，甚至會影響整台主機效能！

我也是最近才知道 .NET Core 3 釋出的 Worker Service（去年就有了），好奇研究了一下，結果好像回不去了 😂···

Worker Service 簡單且省力，趕緊來試試看吧！