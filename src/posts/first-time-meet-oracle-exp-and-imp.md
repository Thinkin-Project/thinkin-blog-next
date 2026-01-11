---
title: '初探 Oracle exp & imp 指令使用方式'
description: 'Oralce 大量資料匯入匯出方式'
ogImage: '/assets/posts/first-time-meet-oracle-exp-and-imp/hero.png'
slug: 'first-time-meet-oracle-exp-and-imp'
date: '2020-02-07'
drafted: false
featured: false
topic: 'oracle'
tags: ['command', 'exp', 'imp', 'data-access']
authors: ['neil-tsai']
---

此文主要**初步了解 Oracle exp & imp 指令使用方式**哦，有興趣就往下看吧！

## 前言

最近在協助部門將**某一系統於客戶環境的測試機資料，下檔到公司環境測試機**，希望可以重現該系統的行為，以便於我們團隊之後在公司的測試便利性。

但有個直接問題浮現了，畢竟這個系統已上線許久，即便是**測試機資料也是爆多，光是 Table 就有將近 1000 ~ 2000 個，甚至有些 Table 資料筆數超過 100 萬的都有**，這要一個一個過肯定會◢▆▅▄▃崩╰(〒皿〒)╯潰▃▄▅▇◣

不過既然身為軟體工程師，這時候一個轉念（絕對不是什麼懶得做什麼的），便可豁然開朗，原來 Oracle 這麼佛已經有想到**可能使用者會需要大量匯入匯出資料這件事**，咦？它們的專業應該就是在資料庫管理啊（直接被打臉

## Oracle Original Export and Import

> This chapter describes how to use the original Export and Import utilities, invoked with the `exp` and `imp` command, respectively. These are called the original Export and Import utilities to differentiate them from the Oracle Data Pump Export and Import utilities available as of Oracle Database 10g. The Data Pump Export and Import utilities are invoked with the `expdp` and `impdp` commands, respectively.  
> [Oracle Docs – Original Export and Import](https://docs.oracle.com/cd/B28359_01/server.111/b28319/exp_imp.htm#g1070082)

引述一段從 Oracle 官方文件對於 **Original Export and Import** 的描述，其中提到使用 **exp** 及 **imp** 指令的均意指為 Original Export and Import，而後於 Oracle Database 10g 推出的 **Data Pump Export and Import** 則是使用 **expdp** 及 **impdp** 等指令，文末會在對比這兩者差異可能有哪些，往下看吧！

## exp & imp 實際情境演練

### 匯出

![expimp-1](/assets/posts/first-time-meet-oracle-exp-and-imp/expimp-01.png)

<center>
    Use exp command
</center>

**匯出特定幾個 Table 的指令（[匯出參數可參考官方文件](https://docs.oracle.com/cd/B28359_01/server.111/b28319/exp_imp.htm#CEGFIAGE)）：**

```bash
> exp UserName/Password@ServiceName file='ExportPath.dmp' log='ExportLog.log' direct=y statistics=none tables=(Table1, Table2,...)
```

- UserName：使用者名稱
- Password：密碼
- ServiceName：服務名稱
- ExportPath：匯出 dmp 檔路徑（資料）
- ExportLog：匯出 log 檔路徑
- Table1, Table2,…：多個 Table 名稱

**以上需要自行依照需求替換值哦！**

部份參數介紹

- file：如果沒有特別去搭配 filesize 參數的情況下，只會匯出一個 dmp 檔，反之則可以於 file 參數定義多個 dmp 檔名稱（依據所設定 filesize 去切割）
- log：記錄指令執行途中狀況
- direct：[是否直接路徑匯出](https://blog.csdn.net/leshami/article/details/9146023)
- statistics：統計資訊
- tables：語法範本 schemaname.tablename:partition_name

![expimp-2](/assets/posts/first-time-meet-oracle-exp-and-imp/expimp-02.png)

<center>
    Exported dmp & log file
</center>

### 匯入

![expimp-3](/assets/posts/first-time-meet-oracle-exp-and-imp/expimp-03.png)

<center>
    Use imp command
</center>

**匯入特定幾個 Table 的指令（[匯入參數可參考官方文件](https://docs.oracle.com/cd/B28359_01/server.111/b28319/exp_imp.htm#i1021478)）：**

```bash
> imp UserName/Password@ServiceName file='ImportPath.dmp' ignore=y full=y
```

- UserName：使用者名稱
- Password：密碼
- ServiceName：服務名稱
- ImportPath：欲被匯入的 dmp 檔（資料）

**以上需要自行依照需求替換值哦！**

部份參數介紹

- file：如果沒有特別去搭配 filesize 參數的情況下，可以只匯入一個 dmp 檔，反之則可以於 file 參數定義多個 dmp 檔名稱（依據所設定 filesize 去分次匯入）
- ignore：若 Table 物件已存在，仍然會匯入資料（即便在匯入途中發生錯誤也不會中斷）
- full：匯入整個 dmp 檔

## exp & expdp 指令差別？

其實這要回到上述所提到的 **Original Export and Import**（前者） 和 **Data Pump Export and Import**（後者） 之間的區別，畢竟兩者使用的元件不同。

1. **前者**可用於客戶端及伺服器端，當然客戶端那邊要能夠連線至伺服器端，而**後者**僅能使用於伺服器端
2. 若由 expdp 匯出之檔案，則無法使用 imp 來匯入，反之亦然
3. 若使用 expdp 和 impdp 在輸入指令時，並不像 exp 和 imp 需要先打上身分（UserName/Password@ServiceName）

💭 [expdp和exp 的區別和使用](https://kknews.cc/zh-tw/code/nk83rn2.html)

## 參考

💭 [IMP: ORA-12560 TNS:protocol adapter error](http://oracle-db-faq.blogspot.com/2009/02/imp-ora-12560-tnsprotocol-adapter-error.html)  

💭 [15 Oracle Exp Command Examples to Export Database Objects](https://www.thegeekstuff.com/2016/02/oracle-exp-examples/)

## 結尾

感謝各位花時間看完此篇小文，如果本文中有描述錯誤，還請各位指教。

希望這篇文章可以解決掉大多數人對於 Oracle 匯入匯出大量資料的困擾哦◝( ﾟ∀ ﾟ )◟