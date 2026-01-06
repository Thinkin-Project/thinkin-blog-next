---
title: '介面隔離原則 ISP'
description: '依賴你所需要的'
slug: 'oo-interface-segregation-principle'
date: '2020-03-13'
drafted: false
featured: false
topic: 'object-oriented-design-principles'
tags: ['solid']
authors: ['neil']
---

此篇文章偏重於以圖解方式，簡單帶大家了解 **介面隔離原則** 哦，有興趣就往下看吧！

ISP 為 Interface Segregation Principle 簡寫，均意為介面隔離原則。

👍 若開發途中有持續遵循 ISP 原則的話，其實你會發現程式也漸漸會降低耦合哦！

換句話說，就是軟體模組之間依賴性沒有那麼強，解耦好處可參考之前寫的 [DIP](/posts/oo-dependency-inversion-principle) 文章。

## 定義

以下擷取自 [wikipedia](https://en.wikipedia.org/wiki/Interface_segregation_principle)

> No client should be forced to depend on methods it does not use.

**不應強迫客戶端去依賴它不使用的方法！**

## 見解

一般來說，都會**盡量避免掉具體類別之間的依賴關係**，因為風險實在太多了···

⭐️ 介面就是一個解除耦合的關鍵，如果操作介面得宜，就能改變依賴關係，進而改善系統架構。

❓ 那有什麼時機點可以**很直覺套用 ISP 原則**？回頭再來告訴各位。

## 類別圖探討

這邊依舊拿 [SRP](/posts/oo-single-responsibility-principle) 最後討論出來的方案 C 做說明，如下原圖：

![srp-5](/assets/posts/oo-single-responsibility-principle/view-class-diagram-think-srp-5.jpg)

<center>
    Plan C
</center>

進一步再畫成如下圖（**若有其它元件互動情況下**）：

![isp-1](/assets/posts/oo-interface-segregation-principle/viewclassdiagramthinkisp-1.jpg)

<center>
    Plan C & Other component
</center>

有發現哪裡不對勁了嗎 Σ(\*ﾟдﾟﾉ)ﾉ ？

回頭看完定義，再回來看匯出元件（Export Component），確實已經違反了 ISP 原則，為什麼？

假設今天有其它元件（Other Component）也想要利用匯出元件來匯出檔案，所以**理論上工程師修改範圍可能就落在其它（Other）及匯出（Export）元件，但工程師卻忘了匯出元件有被「別的元件（Utility Component）」所使用，變動過大的話，這個所謂「別的元件」就需要重新編譯及部署！**

再者，如果我們站在其它元件（Other Component）的角度來看，我可以給文章（Article）或檔案（file）來匯出，但這個其它元件真的會需要知道「給文章來匯出」這件事嗎？

Ans：**如果說這個其它元件職責就只有「給檔案來匯出」，那它就不應該知道有「給文章來匯出」這件事！**

<center>
    ···
</center>

如何讓其它元件避免知道它不應該需要知道的事？**介面（Interface）此時就能派上用場了！**

加上介面來隔離之後，如下圖：

![isp-2](/assets/posts/oo-interface-segregation-principle/viewclassdiagramthinkisp-2.jpg)

<center>
    Added interface
</center>

紅圈處就是關鍵，這兩個介面（ExportFile、ExportArticle）達成了兩個目的！

1. 資訊隱藏（可參考之前寫的 [OCP](/posts/oo-open-closed-principle) 文章）
2. 避免讓使用匯出元件者知道它不應該需要知道的事

## 使用 ISP 時機點

⭐️ 最直覺的時機點：**使用他人所撰寫之第三方元件**

❓ 你可能會覺得直接用第三方元件有什麼不對？幹嘛多一個介面來搞自己？

## 舉例

假設今天客戶有自己的 LDAP 元件（對主系統來說屬於外部元件），在進入主系統前需要先透過 LDAP 驗證是合法的使用者才可登入，程式碼（以 C# 為例子）你可能會這樣寫：

```csharp
// AuthenticationMethod.cs
using xxx.ldap;

public class AuthenticationMethod {

    // 驗證使用者密碼
    public bool VerifyUserPassword(string userId, string password) {

        // 預設驗證失敗
        bool flag = false;

        Ldap ldap = new Ldap();

        try {
            ldap.Open(...);
            flag = ldap.VerifyUserPassword(userId, password);
        } catch(Exception ex) {
            // 錯誤處理...
        } finally {
            ldap.Close();
        }

        return flag;
    }
}
```

VerifyUserPassword 如果功能要正常運行，勢必需要它人家的 LDAP 元件才行（**間接來看就是AuthenticationMethod 和 Ldap 有耦合關係**）。

❓ 當今天你要對 VerifyUserPassword 撰寫單元測試時，你會發現寫不出來 (((ﾟДﾟ;))) ，為什麼？

回想一下它要怎麼樣能夠正常運行就知道原因了，因為 LDAP 沒辦法實際取得所需資料，沒取得資料也無從驗證是否斷言（Assert）會過···

再想一下，我只是要做單元測試而已，又不是真的要實際取得客戶的 LDAP 資料，所以我應該要想辦法偽造（Fake）一個 LDAP 元件出來，這樣就能順利驗證 VerifyUserPassword （無法取得 LDAP 連線情況下）。

<center>
    ···
</center>

那要怎麼偽造出一個 LDAP 元件？**介面（Interface）這時又能派上用場了！**

程式碼：

```csharp
// ILdapBasic.cs

public interface ILdapBasic {
    // 開啟連線
    void Open(...);
    // 驗證使用者密碼
    bool VerifyUserPassword(string userId, string password);
    // 關閉連線
    void Close();
}
```

```csharp
// LdapBasic.cs
using xxx.ldap;

public class LdapBasic : ILdapBasic {

    private Ldap _Ldap;

    public Ldap Ldap
    {
        get {
            if (_Ldap == null) {
                _Ldap = new Ldap();
            }
            return _Ldap;
        }
        set {
            _Ldap = value;
        }
    }

    // 開啟連線
    public void Open(...) {
        Ldap.Open(...);
    }

    // 驗證使用者密碼
    public bool VerifyUserPassword(string userId, string password) {
        return Ldap.VerifyUserPassword(userId, password);
    }

    // 關閉連線
    public void Close() {
        Ldap.Close();
    }
}
```

```csharp
// AuthenticationMethod.cs

public class AuthenticationMethod {

    private ILdapBasic _LdapBasic;

    public ILdapBasic LdapBasic
    {
        get {
            if (_LdapBasic == null) {
                _LdapBasic = (ILdapBasic)Assembly.Load(...).CreateInstance(...);
            }
            return _LdapBasic;
        }
        set {
            _LdapBasic = value;
        }
    }

    // 驗證使用者密碼
    public bool VerifyUserPassword(string userId, string password) {

        // 預設驗證失敗
        bool flag = false;

        try {
            LdapBasic.Open(...);
            flag = LdapBasic.VerifyUserPassword(userId, password);
        } catch(Exception ex) {
            // 錯誤處理...
        } finally {
            LdapBasic.Close();
        }

        return flag;
    }
}
```

從上面程式碼可以觀察到幾個有趣的現象：

1. AuthenticationMethod 本來有 xxx.ldap 的引用（include）被拿掉了，已經轉嫁給 LdapBasic 去承擔了（所以 LdapBasic 裡面的實作都會跟 xxx.ldap 息息相關）。
2. AuthenticationMethod 現在是依賴 ILdapBasic 介面，而不是 xxx.ldap 中的具體實作（解耦）。
3. 現在可以透過偽造 ILdapBasic ，進而達到可以於單元測試中給出預期的回應，這樣一來 VerifyUserPassword 即使不用真的連上 LDAP，就能夠進行模擬回應。

## 總結

**使用第三方元件之前，先要評估外部帶給系統的影響，如果說要將系統跟外部做隔離，那就是會建議墊一層介面，介面本身就帶有侷限特性，而實作該介面的具體實作內部應該就都會是跟外部有關的實作！**

## 迷思

❓ 好像寫單元測試會需要一併異動”被測試”程式？

Ans：**如果有發生這種現象，那很有可能你不是在寫單元測試，反而可能是在做整合測試···**

從剛剛套用 ISP 原則的程式碼來看，LdapBasic 屬性只有在功能正常運行時，才會取得真正的實例（\_LdapBasic），而如果在單元測試執行途中，你需要做的是偽造一個實例出來並把它設定給 LdapBasic 屬性，這樣一來就不存在你寫單元測試會一併調整被測試程式這件事情 (´・ω・`)···

## 結尾

感謝各位花時間看完此篇文章，如果本文中有描述錯誤，還請各位指教。

希望這篇文章可以讓大家了解 Interface Segregation Principle，一般來說我們都會希望自己的系統好維護，其中透過使程式不去依賴它所不需要的東西，看似一件單純的事情，而真正有意識到的卻是少數，介面本身除了有規範的效果，但同樣也有制約的效果，如果介面操作得宜，將能使系統逐步單純化！
