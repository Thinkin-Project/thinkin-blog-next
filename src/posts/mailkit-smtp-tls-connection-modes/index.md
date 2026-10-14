---
title: 'EnableSSL=true 就代表 SMTP 一定加密嗎？從 MailKit 釐清 TLS 連線模式'
description: '藉由排查 SMTP 異常，深入剖析 MailKit 的 TLS 機制，並用 smtp4dev 驗證加密行為'
slug: 'mailkit-smtp-tls-connection-modes'
date: '2026-10-14'
drafted: false
featured: false
topic: 'net'
tags: ['mailkit', 'smtp', 'tls', 'smtp4dev']
authors: ['neil-tsai', 'chatgpt']
---

寄信程式提供了 `EnableSSL`，設定成 `true`，是不是就代表郵件一定經過加密傳送？

❗ **本文的 `EnableSSL` 是應用程式既有的設定欄位，不是 MailKit 的屬性。討論的加密範圍是寄信程式到 SMTP 伺服器之間的連線，不涵蓋後續轉送或郵件內容的端對端加密。**

最近處理一次 SMTP 連線問題時，我發現答案取決於程式如何解讀這個設定。把布林值直接傳給 MailKit，可能選錯加密方式；省略連線選項，則可能在伺服器不支援 TLS 時繼續使用明文。

這次我保留了既有設定介面，先明確定義加密策略，再用 smtp4dev 驗證成功與失敗情境。

✨ **真正要確認的，不只是信能不能寄出去，而是啟用加密之後，程式是否仍可能退回明文。**

> 本文程式碼已簡化並使用通用名稱，測試結果整理自這次修正時的本機驗證。

## 問題：有帳密與沒帳密，竟然走不同連線策略

原本的連線方式可以簡化成：

```csharp
if (hasCredentials)
{
    await client.ConnectAsync(host, port, enableSsl);
    await client.AuthenticateAsync(account, password);
}
else
{
    await client.ConnectAsync(host, port);
}
```

這裡有兩個問題。

首先，MailKit 的 `ConnectAsync(host, port, bool useSsl)` 在 `true` 時使用 `SslOnConnect`：TCP 連線建立後立即進行 TLS 握手。若伺服器期待的是 STARTTLS，雙方的連線流程便對不上，連線會失敗，而不是退回明文。布林值 `false` 也不等於明確禁止加密，而是允許在伺服器支援時使用 STARTTLS。

其次，沒有帳密時直接呼叫 `ConnectAsync(host, port)`，會使用預設的 `Auto`，使應用程式的 `EnableSSL` 根本沒有參與決策。是否登入與是否加密是兩件事，不能用前者決定後者。

## 先定義 EnableSSL 的設定語意（契約）

這次修正採用以下規則：

| EnableSSL | 埠號   | 連線模式     | 預期行為                    |
| --------- | ------ | ------------ | --------------------------- |
| false     | 任意埠 | None         | 不使用 TLS                  |
| true      | 465    | SslOnConnect | 連線建立後立即進行 TLS 握手 |
| true      | 其他埠 | StartTls     | 要求 STARTTLS；不支援就失敗 |

> `EnableSSL=true` 代表必須加密，而不是「可以加密就加密」。

這是一項沿用既有布林設定的應用程式政策，並非所有 SMTP 伺服器的通用判斷法。埠號只是本次策略的判斷依據，實際協定仍由伺服器設定決定。例如，自訂埠若採隱含式 TLS，這個規則就不適用，需要另行設計明確的模式設定。本次沒有新增設定欄位。

### 隱含式 TLS 與 STARTTLS 的差異

隱含式 TLS 從連線一開始就做 TLS 握手，常見於 465 埠。STARTTLS 則先讀取 SMTP 歡迎訊息（greeting）、交換伺服器能力，再以 `STARTTLS` 指令升級連線；升級完成後才進行登入與郵件傳輸。

`SslOnConnect` 與 `StartTls` 對應的是不同連線流程，不是同一個功能的兩個名稱。

### 為什麼沒有使用 Auto？

對 SMTP 而言，`Auto` 在 465 埠選擇 `SslOnConnect`，其他埠則選擇 `StartTlsWhenAvailable`。後者允許伺服器沒有 STARTTLS 時繼續連線，因此無法滿足「啟用後必須加密」的契約。

選用 `StartTls` 時，如果伺服器不支援 STARTTLS，MailKit 會拋出 `NotSupportedException`。這正是我們需要的失敗行為。

## 實作：集中模式選擇，將驗證與連線分開

先把設定轉換成明確的 `SecureSocketOptions`：

```csharp
using MailKit.Security;

internal static SecureSocketOptions GetSecureSocketOptions(bool enableSsl, int port)
{
    if (!enableSsl)
        return SecureSocketOptions.None;

    return port == 465
        ? SecureSocketOptions.SslOnConnect
        : SecureSocketOptions.StartTls;
}
```

寄信時先透過這個方法決定連線模式。以下是核心片段；`message` 是事先建立好的 `MimeMessage`，其他參數由呼叫端提供：

```csharp
using var client = new MailKit.Net.Smtp.SmtpClient();

try
{
    await client.ConnectAsync(host, port, GetSecureSocketOptions(enableSsl, port));

    if (!string.IsNullOrWhiteSpace(account) && !string.IsNullOrWhiteSpace(password))
        await client.AuthenticateAsync(account, password);

    await client.SendAsync(message);
}
finally
{
    if (client.IsConnected)
        await client.DisconnectAsync(true);
}
```

不論有沒有帳密，連線模式都依同一套規則決定。只有帳號與密碼都存在時，才執行驗證。

範例在清理連線前先檢查 `IsConnected`，避免連線尚未建立時繼續執行中斷操作。

## 測試分成兩層：規則與實際協定

單元測試可以驗證模式對應，但無法證明 TLS 握手成功。因此，我們同時使用純邏輯測試與 smtp4dev 手動驗證。

### 第一層：單元測試確認選項

既有單元測試涵蓋六組輸入：

| EnableSSL | Port         | 預期選項     |
| --------- | ------------ | ------------ |
| false     | 25、465、587 | None         |
| true      | 465          | SslOnConnect |
| true      | 25、587      | StartTls     |

這些測試不需要 SMTP 伺服器，能快速確認設定規則是否被後續修改破壞。它們不驗證憑證、握手或實際寄信。

### 第二層：用 smtp4dev 建立三種伺服器

[smtp4dev](https://github.com/rnwood/smtp4dev) 可配置不加密、STARTTLS 與隱含式 TLS。STARTTLS 模式表示伺服器提供升級能力；若要拒絕未加密的寄信操作，還需要啟用要求安全連線的設定。

以下使用 Windows 可執行檔與 PowerShell，是這次驗證採用的參數。不同版本請先用 `--help` 確認。每次切換情境前先停止上一個程序，避免埠號與網頁介面衝突。

#### 隱含式 TLS，要求安全連線

```powershell
.\\Rnwood.Smtp4dev.exe --smtpport=465 --tlsmode=ImplicitTls --secureconnectionrequired
```

#### STARTTLS，要求安全連線

```powershell
.\\Rnwood.Smtp4dev.exe --smtpport=587 --tlsmode=StartTls --secureconnectionrequired
```

#### 不提供 TLS

```powershell
.\\Rnwood.Smtp4dev.exe --smtpport=25 --tlsmode=None
```

上述是三次獨立啟動，不要一次全部執行。這次使用的網頁介面為 `http://localhost:5000`；實際位址請以啟動輸出為準。

### 測試前先準備自簽憑證：信任與名稱都要對

啟動 TLS 模式後，寄信前還需要處理憑證。smtp4dev 可自動產生自簽憑證，其名稱取決於伺服器 HostName 設定。客戶端使用的 Host 必須與憑證涵蓋的名稱一致。

這次的憑證使用電腦名稱，因此 TLS 情境的客戶端 Host 使用 `$env:COMPUTERNAME`，而非 `localhost`。只有不進行 TLS 握手的情境，才直接使用 `localhost`。不能把這項環境經驗當成所有憑證都適用的規則。

這次使用的 Windows 安裝把憑證放在 `%APPDATA%\smtp4dev\`，並將公開憑證匯入目前使用者的信任存放區：

```powershell
Import-Certificate -FilePath "$env:APPDATA\\smtp4dev\\selfsigned-certificate.cer" -CertStoreLocation Cert:\\CurrentUser\\Root
```

憑證位置請依實際安裝方式與啟動輸出確認。匯入信任只需要 `.cer`；含私鑰的 `.pfx` 不需要匯入，也不應放進版本控制或文章附件。

測試完成後，可使用 `certmgr.msc` 確認並移除這張測試憑證。若透過指令移除，應先核對憑證指紋，精確指定單一憑證。

這次採用信任測試憑證的方式，保留正式程式的憑證驗證。不要把「一律回傳 true」的 `ServerCertificateValidationCallback` 當成正式解法，否則就跳過了伺服器身分驗證。

將客戶端的 Host、Port 與 EnableSSL 改成對應值，再透過既有的純文字寄信測試送信。成功時檢查網頁中的信件；同時檢查 Session 記錄和客戶端例外，確認失敗發生在哪個階段。

### 五個情境，包含必須失敗的案例

| 情境 | smtp4dev 模式             | Port | EnableSSL | 實測結果         |
| ---- | ------------------------- | ---- | --------- | ---------------- |
| 1    | ImplicitTls，要求安全連線 | 465  | true      | 成功             |
| 2    | StartTls，要求安全連線    | 587  | true      | 成功             |
| 3    | StartTls，要求安全連線    | 587  | false     | 被拒絕           |
| 4    | None                      | 25   | false     | 成功             |
| 5    | None                      | 25   | true      | 失敗，不退回明文 |

情境 2 是原始問題的關鍵：客戶端應使用 STARTTLS，而不是直接進行隱含式 TLS 握手。

情境 3 用來驗證關閉加密時確實使用 `None`。測試時收到 `SmtpCommandException: Secure connection required`。被拒絕可能發生在 SMTP 命令階段，不代表 TCP 連線一定無法建立。

情境 5 則檢查最容易漏掉的降級行為。測試時收到 `NotSupportedException: The SMTP server does not support the STARTTLS extension`。若這個情境仍能送出信件，就表示客戶端還有允許明文的路徑。

成功收信本身不足以證明 TLS。本次在 TLS 情境開啟伺服器的安全連線要求，使成功寄信成為加密策略的交叉驗證；也應搭配 Session 記錄判讀。

## 把加密要求變成可以驗證的行為

修正後，模式規則由單元測試確認，實際協定行為則透過五種 smtp4dev 情境手動驗證。

`EnableSSL=true` 連到不支援 TLS 的伺服器時，現在會失敗。這符合新定義的契約，但依賴過去明文降級行為的環境，需要在更新前調整設定。

`EnableSSL=false` 現在明確表示不使用 TLS，不再沿用舊程式可能自動啟用 TLS 的行為。若原本依賴自動加密，更新前應將設定改為 `true`，並確認伺服器的連線模式符合本次策略。若在 `false` 時進行驗證，帳密便沒有 TLS 傳輸保護；本次仍允許這種設定組合，未額外加入禁止未加密驗證的政策。

這次經驗提醒我們：加密開關必須對應明確的協定與失敗條件。測試除了確認「能寄出去」，也要確認「不符合加密要求時，真的寄不出去」。

## 參考

💭 [MailKit 連線選項](https://mimekit.net/docs/html/T_MailKit_Security_SecureSocketOptions.htm)：各種 TLS 模式的用途與差異。

💭 [MailKit MailService 原始碼](https://github.com/jstedfast/MailKit/blob/master/MailKit/MailService.cs)：布林連線參數如何對應實際模式。

💭 [MailKit SMTP 常見問題](https://github.com/jstedfast/MailKit/blob/master/FAQ.md)：SMTP 埠號與自動選擇連線模式的說明。

💭 [MailKit ConnectAsync 文件](https://mimekit.net/docs/html/M_MailKit_Net_Smtp_SmtpClient_ConnectAsync_2.htm)：強制 STARTTLS 時的例外行為。

💭 [smtp4dev TLS 說明](https://github.com/rnwood/smtp4dev/blob/master/docs/TLS-SSL-for-SMTP.md)：TLS 模式、自簽憑證與主機名稱設定。

💭 [smtp4dev 伺服器設定](https://github.com/rnwood/smtp4dev/blob/master/Rnwood.Smtp4dev/appsettings.json)：TLS 與安全連線要求的設定項目。
