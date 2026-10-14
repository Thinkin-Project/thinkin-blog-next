---
title: 'RabbitMQ 發佈沒有例外，訊息卻沒進 Queue：補上 Publisher Confirms 與非同步 Retry'
description: '解析 RabbitMQ 掉訊息問題，釐清發佈確認、重試與重複消費的可靠性權衡'
slug: 'rabbitmq-publisher-confirms-async-retry'
date: '2026-10-14'
drafted: false
featured: false
topic: 'net'
tags: ['rabbitmq', 'publisher-confirms', 'asynchronous-programming', 'retry', 'error-handling']
authors: ['neil-tsai', 'chatgpt']
---

最近處理了一個 RabbitMQ 問題：應用程式的發佈前後 log 都正常，也沒有收到例外，但訊息偶爾就是沒有出現在 Queue。

如果只看呼叫端，這次發佈似乎已經成功。但沿著程式往下查，才發現「方法執行完畢」、「broker 接受訊息」及「訊息能路由到 Queue」，原本沒有被完整串在一起。

這次修正先補齊發佈確認與錯誤處理，再將發佈流程改成可以一路 `await` 的非同步 API，讓失敗真正進入 Retry，也能回到呼叫端。

✨ **可靠的訊息發佈，第一步是讓「成功」有明確定義，讓「失敗」有機會被看見。**

> 本文以專案當時使用的 RabbitMQ.Client 7.2.1 與 Polly 傳統 `Policy` API 為背景，未採用 v8 的 `ResiliencePipeline` API。程式碼使用通用名稱並省略專案封裝；測試結果整理自這次修正的本機驗證。

## 先看結論

- **根因**：沒啟用 Publisher Confirms、`mandatory` 退回沒被處理、同步 Retry 包住 async 發佈，再加上 `async void` 與 Channel 狀態檢查不足。
- **修法**：啟用確認追蹤、處理 mandatory 退回，並把發佈改成一路 `await` 的非同步 Retry。
- **刻意不做**：不加發佈逾時，也沒有訊息去重。
- **仍存在的邊界**：單次發佈可能持續等待；結果不明時的重送仍可能造成重複訊息；取得發佈確認不代表 Consumer 已處理完成；共用 `IChannel` 的併發發佈尚未驗證。

## 沒有例外，為什麼不代表發佈成功？

原本的問題並不是單一設定，而是幾個非同步與協定處理上的缺口疊在一起：

| 缺口                                       | 後果                                                                           |
| ------------------------------------------ | ------------------------------------------------------------------------------ |
| 建立 Channel 時沒有啟用 Publisher Confirms | 呼叫端沒有 broker 確認的依據，`BasicPublishAsync` 完成不等於 broker 已接受訊息 |
| 設定了 `mandatory: true`，卻沒處理退回     | 無法路由的訊息被 broker 透過 `basic.return` 退回，應用程式卻仍視為成功         |
| 同步 Policy 包住 async lambda              | 外層提早返回，稍後的例外進不了重試流程（最關鍵）                               |
| Setup 使用 `async void`，只檢查 Connection | 宣告是否完成無從得知，Channel 單獨關閉時也不會被發現                           |

第三個缺口最容易被忽略：同步的 Policy 收到 async lambda 卻沒有等待它完成，結果就是 log 看起來走完了，真正的發佈工作卻還沒結束。

以下是這類錯誤的示意，並非原專案程式碼。這裡明確將 async lambda 指派給 `Action`，因此它會成為 `async void`：

```csharp
Action publish = async () => await PublishCoreAsync(message);
syncRetryPolicy.Execute(publish);
```

當非同步操作尚未完成、lambda 在 `await` 處交還控制權時，`Action` 就會返回。同步 Policy 沒有可等待的 `Task`，因此無法等待整次發佈，也無法透過同步呼叫捕捉非同步發佈的例外。

`async void` 的例外無法由呼叫端的 `try/catch` 捕捉，而會交由執行環境的例外處理機制處理；若未被處理，可能導致行程終止。

若另一種寫法回傳了 `Task`，卻沒有讓 Policy 等待它，同樣無法讓非同步失敗進入重試。修正的重點是讓 Policy 與呼叫端都等待同一條非同步流程。

## 先定義這次的成功條件

這次處理的是 Producer 到 broker 這一段的可靠性。

我們希望發佈方法完成時，代表它已取得 broker 的發佈確認；若訊息無法路由，或發佈收到失敗結果，就必須進入錯誤處理，而不是靜默成功。

| 機制                 | 要解決的問題                 | 注意事項                           |
| -------------------- | ---------------------------- | ---------------------------------- |
| Publisher Confirms   | 取得 broker 對發佈的確認     | 不代表 Consumer 已完成業務處理     |
| mandatory 與退回處理 | 發現無法路由到 Queue 的訊息  | 不代表指定的每一個 Consumer 都收到 |
| 非同步 Retry         | 對已觀察到的發佈失敗重新嘗試 | 本文未設定單次發佈逾時             |
| 連線與 Channel 重建  | 恢復後續發佈能力             | 不會自動補送所有未確認訊息         |

Publisher Confirms 與 Consumer Acknowledgements 是不同方向的確認：前者確認發佈結果，後者由 Consumer 回報訊息處理結果。本文沒有調整接收端的業務處理或 ACK 邏輯。

## 用 Publisher Confirms 與 mandatory 補齊發佈結果

建立 Channel 時，同時啟用確認與追蹤：

```csharp
var channel = await connection.CreateChannelAsync(
    new CreateChannelOptions(
        publisherConfirmationsEnabled: true,
        publisherConfirmationTrackingEnabled: true));
```

Confirmations 讓 Channel 進入 confirm mode，由 broker 回報發佈結果；Tracking 則讓 .NET Client 追蹤每筆發佈。兩者一起啟用後，`BasicPublishAsync` 會等待該筆訊息的確認，並在收到 nack（broker 對發佈的負向確認）或 mandatory 訊息退回時拋出 `PublishException`（可用 `IsReturn` 區分是否為退回）。nack 表示 broker 未能承擔該次發佈的責任；return 則表示訊息無法路由到任何 Queue，兩者是不同的結果。

這也改變了 `await` 的意義：發佈流程不再只是送出資料後往下走，而是等待確認結果。

接著記錄退回原因：

```csharp
channel.BasicReturnAsync += (_, args) =>
{
    logger.LogError(
        "Message returned: {ReplyCode}, {ReplyText}, " +
        "Exchange: {Exchange}, RoutingKey: {RoutingKey}",
        args.ReplyCode,
        args.ReplyText,
        args.Exchange,
        args.RoutingKey);

    return Task.CompletedTask;
};
```

這個 handler 負責留下診斷資訊；讓發佈失敗的關鍵，是前面啟用的確認追蹤，並不是單靠 log 或在事件裡丟例外。

實際發佈仍需設定 `mandatory: true`：

```csharp
var properties = new BasicProperties
{
    Persistent = true
};

await channel.BasicPublishAsync(
    exchange: exchangeName,
    routingKey: routingKey,
    mandatory: true,
    basicProperties: properties,
    body: Encoding.UTF8.GetBytes(message));
```

Persistent 會將訊息的 delivery mode 設為 persistent，但不取代確認機制。以 Classic Queue 為例，要讓訊息在節點重啟後保留下來，還需要使用 durable Queue；不同 Queue 類型的持久化與複寫語意也不完全相同。

也要注意：無法路由的訊息仍可能收到 broker 的 ack。ack 表示 broker 已處理這次發佈，不等於一定有 Queue 接收；因此不能只看 ack，忽略 mandatory return。

## 非同步工作，要交給非同步 Retry

發佈流程改成回傳 `Task`，讓呼叫端明確等待：

```csharp
await eventBus.PublishAsync(message);
```

Producer 內部則使用 `WaitAndRetryAsync` 與 `ExecuteAsync`。以下示意沿用這次的預設值：最多重試 5 次，每次等待時間以 2 的次方增加。

```csharp
const int maxRetries = 5;

var retryPolicy = Policy
    .Handle<Exception>()
    .WaitAndRetryAsync(
        retryCount: maxRetries,
        sleepDurationProvider: attempt => TimeSpan.FromSeconds(Math.Pow(2, attempt)),
        onRetry: (exception, delay, attempt, context) =>
        {
            logger.LogWarning(
                exception,
                "Publish retry {Attempt}/{MaxRetries} after {DelaySeconds}s",
                attempt,
                maxRetries,
                delay.TotalSeconds);
        });

await retryPolicy.ExecuteAsync(() => PublishCoreAsync(message));
```

`PublishCoreAsync` 代表一次完整的發佈嘗試，包含必要的連線確認與 `BasicPublishAsync`。這個方法必須把失敗向外傳遞，Policy 才能觀察並重試。

| 重試次數 | 等待時間 |
| -------- | -------- |
| 1        | 2 秒     |
| 2        | 4 秒     |
| 3        | 8 秒     |
| 4        | 16 秒    |
| 5        | 32 秒    |

這是初次嘗試之外，最多再執行 5 次，合計最多 6 次發佈嘗試。

退避等待合計為 62 秒，但不包含每次連線與發佈所花的時間，不能當成總逾時。

這次也修正了重試 log，分別輸出「第幾次／最多幾次」與「下次等待幾秒」，避免把等待時間誤認成重試次數。

既有策略處理所有 `Exception`，因此無法路由這類問題也會重試。它提供暫時恢復的機會，但不會自動修復錯誤的 Routing Key 或缺少的 Binding；條件始終沒有改善時，重試用盡後仍會把例外交回呼叫端。

## 發佈卡住時，Retry 不會啟動

在沒有自行設定發佈逾時的情況下，「等 Queue 狀況恢復後再試」需要分成兩種情況來看：

| 當下狀態                 | 程式行為                                         |
| ------------------------ | ------------------------------------------------ |
| 發佈已拋出例外           | 依退避間隔重試，直到成功或次數用盡               |
| 發佈仍在等待 broker 回應 | 繼續等待同一次操作，不會因等待時間長而自動 Retry |

例如原本唯一能接收訊息的 Queue 被刪除，訊息已無法路由到任何 Queue，mandatory 訊息被退回，就會進入 Retry。在後續嘗試時，如果 Queue 與路由已恢復，發佈才有機會成功。在本文實作中，若既有 Connection 與 Channel 仍開啟，重試不會重新執行 Queue 宣告；這時需要外部（人或部署流程）先恢復 Queue 與 Binding。若重試觸發連線重建，則仍可能由初始化流程重新宣告。

但若 broker 暫時沒有回應，`BasicPublishAsync` 還沒有完成，也沒有拋出例外，外面的 Retry 就不會啟動。這不是定期輪詢 Queue，而是等待原本那次發佈的結果。

當次驗證把 RabbitMQ 容器暫停，分別等待約 10 秒與 45 秒，發佈沒有因為等待過久而失敗；解除暫停後，原本的發佈才完成。

Heartbeat 也可能讓連線層先偵測到故障。實際逾時值由用戶端與 broker 協商，不能只依預設值推論本次測試的斷線時機；本次沒有驗證更長時間的容器暫停。

> 沒有發佈逾時，表示 Retry 次數有上限，但單次發佈的等待時間沒有由這次實作設定上限。

連線故障仍可能由用戶端或網路層偵測並回報例外；不能把「沒有自行設定發佈逾時」理解成所有故障都一定永久等待。

非同步等待也不等於業務已經完成。它可以釋放執行緒，但呼叫它的 HTTP request 或背景工作仍可能長時間保持未完成狀態。RabbitMQ 的資源壓力也可能阻擋發佈，因此不能只看 Queue 是否存在，還需要觀察 broker 狀態。

## 為什麼沒有直接加上逾時？

驗證期間曾試過加入發佈逾時，並在逾時後重新發佈。

但逾時只表示用戶端沒有及時取得結果，不代表 broker 一定沒有接受先前的訊息。容器恢復之後，前面那些已逾時的發佈仍可能被處理，加上後續重試，就出現同一則訊息收到 4 次的實測結果。

因此，最後沒有保留這項機制。

⚡ **加上逾時可以限制等待，但若結果不明時重新發佈，就必須一起考慮重複訊息。**

若之後要採用逾時重試，需要另行設計穩定的訊息識別、接收端去重或冪等處理。只有加上 `MessageId`，並不會讓 RabbitMQ 自動替我們去重。

這次選擇先等待確認，避免主動因逾時而再次發佈。然而，這也不等於能保證完全不重複：如果 broker 已接受訊息，但確認在連線故障中遺失，後續重試仍可能重送。沒有去重機制，就不能宣稱 exactly-once。

## 連線恢復，也要處理 Channel 與併發建立

原本只看 Connection 是否開啟，會漏掉 Channel 已被單獨關閉的情況。修正後會一起檢查兩者，並在需要重建時釋放舊資源。

```csharp
bool IsConnected =>
    connection is not null && connection.IsOpen
    && channel is not null && channel.IsOpen;
```

Queue 與 Exchange 的 setup 也從 `async void` 改為 `Task`，讓宣告完成後才繼續發佈，並讓 setup 的例外可以被觀察。

新增非同步發佈時，還發現第一次併發建立連線的問題：多個請求同時看到「尚未連線」，便各自建立 Connection，後建立的資源覆蓋前一組，造成多餘連線沒有釋放。

處理方式是在非同步鎖內再次檢查狀態：

```csharp
private readonly SemaphoreSlim connectLock = new(1, 1);

async Task EnsureConnectedAsync(Func<Task> connectAsync)
{
    if (IsConnected)
        return;

    await connectLock.WaitAsync();
    try
    {
        if (!IsConnected)
            await connectAsync();
    }
    finally
    {
        connectLock.Release();
    }
}
```

Producer 本身的首次建立也補上鎖內檢查。實測同時送出 50 個請求，修正前建立了 50 條發佈連線，修正後只建立 1 條；強制關閉連線後再同時送出 50 個請求，也只重建一次，沒有依賴重試。

這個併發問題的觀察結果是連線增加，不是訊息遺失。連線建立鎖只保護初始化與重建流程，並沒有保護後續的 `BasicPublishAsync`。

若多個執行流程共用同一個 `IChannel`，必須確保發佈操作互斥，或讓各發佈流程使用各自的 Channel，避免同一個 Channel 被同時用來發佈。這是安全使用共用 Channel 的必要條件；上面的連線建立鎖並未滿足這項要求。因此，這次 50 筆併發測試只能證明連線沒有被重複建立，不能視為共用 Channel 已通過完整的併發安全驗證。

> 這是本文方案的**已知限制**。若你的服務會併發發佈，建議在照抄之前先為發佈加上互斥（例如另一個 `SemaphoreSlim`），或改為每個發佈流程使用各自的 Channel，並自行驗證。

## 我們怎麼驗證這些行為？

這次使用既有測試站台，搭配手動啟動的 RabbitMQ 容器進行驗收，沒有新增自動化測試專案。

測試站台有兩個發佈入口：這次修正前就存在的既有入口，以及這次新增、可一路 `await` 的 `PublishAsync` 入口，兩者共用底層發佈程式。下表的「既有入口」「非同步入口」即指這兩者。

閱讀下表前，先說明驗證範圍：

- 容器暫停情境是在既有入口實測，新增的 `PublishAsync` 沒有重新執行這項測試；兩者共用底層發佈程式，但這不等同於新版入口的實測。
- 手動驗收主要涵蓋 Direct 路徑；Topic 與 Fanout 以程式碼審查確認改法一致。
- 真實 broker 的 nack 情境沒有成功製造，不能把 return 的實測當成 nack 的實測。
- 50 筆併發測試用來確認連線建立與重建次數，未完成共用 Channel 的併發安全驗證。

| 情境                     | 觀察結果                                       |
| ------------------------ | ---------------------------------------------- |
| 正常發佈                 | 確認後返回，管理介面可看到訊息                 |
| 刪除 Queue 後發佈        | 無法路由產生例外；非同步入口重試用盡後回報失敗 |
| 暫停容器                 | 既有入口等待；解除暫停後完成                   |
| 強制關閉連線             | 下一次發佈可重建並成功                         |
| 重啟容器                 | 恢復後再發佈，訊息可進入 Queue                 |
| 首次併發發佈 50 筆       | 一條發佈連線，訊息送達，沒有重試               |
| 關閉連線後併發發佈 50 筆 | 只重建一次，沒有重試                           |

刪除 Queue 的案例，是先讓 Producer 完成初始化，再刪除 Queue 並重發，才能觀察既有 Channel 上的無法路由行為，避免首次連線的宣告流程先把 Queue 建回來。

Podman 的暫停與恢復指令如下；`rabbitmq-test` 是示意容器名稱，請改成自己的名稱：

```powershell
podman pause rabbitmq-test

# 從另一個終端機或測試站台發佈，觀察尚未完成的請求
# 確認等待行為後恢復容器
podman unpause rabbitmq-test
```

## 先讓結果可信，再擴大可靠性邊界

這次最重要的改變，是把確認、例外與重試串成呼叫端能等待的流程：成功要有 broker 確認，無法路由要被看見，失敗要能重試，也要能傳回呼叫端。

這些改善仍有明確邊界。沒有發佈逾時，就可能持續等待；沒有去重，就不能保證重送不會造成重複；取得發佈確認，也不代表 Consumer 已完成業務處理；共用 `IChannel` 的併發發佈也還需要另外處理。

對這次的需求而言，我們先接受等待的代價，補齊最容易造成靜默失敗的缺口。後續若要限制等待時間，應把逾時、結果不明時的重送，以及接收端去重一起設計，而不是只多加一個 Retry。

## 參考

💭 [RabbitMQ .NET/C# Client API Guide](https://www.rabbitmq.com/client-libraries/dotnet-api-guide)：發佈、mandatory、連線恢復與併發使用的注意事項。

💭 [Reliable Publishing with Publisher Confirms](https://www.rabbitmq.com/tutorials/tutorial-seven-dotnet)：.NET 非同步發佈與確認追蹤範例。

💭 [Consumer Acknowledgements and Publisher Confirms](https://www.rabbitmq.com/docs/confirms)：Producer 與 Consumer 確認的差異、mandatory return、ack／nack，以及無法路由與持久化訊息的確認時機。

💭 [CreateChannelOptions](https://rabbitmq.github.io/rabbitmq-dotnet-client/api/RabbitMQ.Client.CreateChannelOptions.html)：Channel 的 Publisher Confirms 與 Tracking 設定。

💭 [Memory and Disk Alarms](https://www.rabbitmq.com/docs/alarms)：broker 資源不足時對發佈連線的阻擋行為。

💭 [Polly v7 → v8 Migration Guide](https://www.pollydocs.org/migration-v8.html)：傳統 `Policy` API 與 v8 `ResiliencePipeline` API 的差異。
