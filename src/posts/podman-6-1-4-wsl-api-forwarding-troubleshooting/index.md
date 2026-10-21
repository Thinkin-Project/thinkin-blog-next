---
title: 'Podman 6.1.4 升級踩坑紀錄：從 WSL cgroups 到 Windows API Forwarding'
description: '記錄 Windows Podman 5.8.3 升級至 6.1.4 後，如何排查 WSL cgroups v2 問題，以及 Windows Socket 衝突造成 Podman Desktop 無法顯示 Container 的情況'
slug: 'podman-6-1-4-wsl-api-forwarding-troubleshooting'
date: '2026-10-21'
drafted: true
featured: false
topic: 'command-line'
tags: ['podman', 'wsl2', 'windows', 'troubleshooting', 'container']
authors: ['neil-tsai', 'chatgpt']
---

最近將 Windows 環境中的 Podman 從 **5.8.3 升級至 6.1.4**，原本以為只是一般的版本更新，沒想到接連遇到兩個問題：

1. Podman Machine 無法正常啟動。
2. Podman CLI 已經可以操作 Container，但 Podman Desktop 卻看不到任何 Container。

這兩個問題表面上都與 Podman Machine 有關，實際上卻發生在不同的層級。

第一個問題與 **WSL 執行環境及 cgroups** 有關；第二個問題則出在 **Windows API Forwarding 的 Socket 衝突**。

以下記錄這次從問題發現、診斷到修復的完整過程。

## 一、環境背景

這次使用的環境如下：

| 項目            | 版本或設定             |
| --------------- | ---------------------- |
| 作業系統        | Windows                |
| Podman 舊版本   | 5.8.3                  |
| Podman 新版本   | 6.1.4                  |
| 虛擬化方式      | WSL2                   |
| Podman Machine  | podman-machine-default |
| Podman 執行模式 | rootful                |
| Container 測試  | Redis                  |

升級過程中，Podman Desktop 提示需要清除舊有的 Machine 資料，因此重新建立了 `podman-machine-default`。

然而，新的 Machine 建立完成後，卻無法正常啟動。

## 二、第一個問題：Podman Machine 無法啟動

### 2.1 Machine 狀態不一致

首先執行：

```powershell
podman machine list
```

Machine 顯示已建立，但尚未成功啟動。

接著檢查 WSL：

```powershell
wsl --list --verbose
```

卻發現 `podman-machine-default` 顯示為 `Running`。

這代表 WSL Distribution 已經啟動，但 Podman Machine 並沒有完成自己的啟動流程。

**WSL 顯示 Running，不代表 Podman Machine 一定正常。**

為了取得更完整的資訊，改用 Debug 模式啟動：

```powershell
podman --log-level=debug machine start
```

其中出現：

```text
win-sshproxy.exe failed to start, exit code: 0

API forwarding for Docker API clients is not available
```

以及：

```text
machine did not transition into running state
ssh error: machine not in running state
```

當時看起來像是 SSH 或 API Forwarding 問題，但還不能直接認定 Proxy 就是根本原因。

### 2.2 進一步檢查 WSL

先檢查 WSL 的版本：

```powershell
wsl --version
```

當時環境為：

```text
WSL version: 2.2.4.0
Kernel version: 5.15.153.1-2
```

接著進入 Podman Machine 的 WSL 環境，確認 cgroups 狀態：

```powershell
wsl -d podman-machine-default -u root -- stat -fc %T /sys/fs/cgroup
```

得到：

```text
tmpfs
```

正常的 cgroups v2 環境，通常應該回傳：

```text
cgroup2fs
```

再直接執行 Podman：

```powershell
wsl -d podman-machine-default -u root -- podman info
```

結果出現：

```text
FATA[0000] Cgroups v1 not supported
```

這是第一個真正具有診斷價值的錯誤。

Podman 6.1.4 的 Machine 環境需要能正常使用 cgroups v2，但當時 WSL 環境呈現的 cgroups 狀態並不符合需求。

因此，即使 WSL Distribution 能啟動，Podman Engine 仍無法正常運作。

### 2.3 更新 WSL

確認問題後，先更新 WSL：

```powershell
wsl --update
```

接著關閉 WSL：

```powershell
wsl --shutdown
```

再重新啟動 Podman Machine：

```powershell
podman machine start
```

這次 Machine 成功啟動。

重新執行：

```powershell
podman info
```

確認：

```yaml
cgroupVersion: v2
cgroupManager: cgroupfs
```

WSL Kernel 也更新為：

```text
6.18.54.1-microsoft-standard-WSL2
```

至此，第一個問題解決。

不過要特別注意：這次的實測證明更新 WSL 後環境恢復正常，並不代表所有相同錯誤都一定是 WSL 版本過舊造成。若遇到類似問題，仍應先確認實際的 cgroups 狀態。

## 三、第二個問題：CLI 正常，Podman Desktop 卻看不到 Container

Machine 成功啟動後，原本以為整個問題已經解決。

接著建立 Redis Container：

```powershell
podman run --name redis-lab -p 6379:6379 -d redis:latest
```

執行：

```powershell
podman ps -a
```

可以看到：

```text
CONTAINER ID  IMAGE                           STATUS  PORTS                   NAMES
7251d2154e96  docker.io/library/redis:latest  Up      0.0.0.0:6379->6379/tcp  redis-lab
```

Image 也正常存在：

```powershell
podman images
```

但打開 Podman Desktop，Containers 頁面卻沒有顯示 Redis。

這是一個容易讓人誤判的情境。

因為 CLI 能操作 Container，不代表 Desktop 一定使用相同的連線方式。

### 3.1 先排除 rootful 與 rootless 差異

Podman 可以使用 rootful 或 rootless 模式，兩者的 Container Storage 是分開的。

因此第一個懷疑是：

> Redis 建立在 rootful 環境，但 Podman Desktop 是否連到了 rootless？

執行：

```powershell
podman system connection list
```

結果顯示：

```text
podman-machine-default       Default: false
podman-machine-default-root  Default: true
```

代表 CLI 預設使用 rootful 連線。

再執行：

```powershell
podman machine inspect
```

可以看到：

```json
{
    "State": "running",
    "Rootful": true
}
```

Podman Desktop 的 Machine 頁面同樣顯示：

```text
Podman Machine (rootful)
RUNNING
```

因此可以排除單純的 rootful/rootless 設定不一致。

### 3.2 Podman Desktop 的連線診斷

接著進入 Podman Desktop 的 Troubleshooting，檢查 Container Connection。

結果顯示：

```text
Container connections: 1 (1 running)

Name: podman-machine-default
Status: started

Socket path: \\.\pipe\podman-machine-default
```

看起來 Connection 已經建立，但執行 `Ping` 和 `Check containers` 時卻都失敗：

```text
Error: connect ENOENT \\.\pipe\podman-machine-default
```

這裡的 `ENOENT` 代表指定的路徑不存在。

換句話說，Podman Desktop 知道應該連接哪個 Windows Named Pipe，但該 Pipe 並不存在。

為了確認，使用 PowerShell 檢查：

```powershell
Get-ChildItem \\.\pipe\ | Where-Object Name -match 'podman|docker'
```

結果沒有任何輸出。

至此可以確認：

**問題不是 Redis Container 沒有啟動，而是 Windows 端沒有提供可供 Podman Desktop 使用的 API 連線。**

## 四、追查 Windows API Forwarding

Podman 在 Windows 上透過 WSL 執行 Linux Container。

在這個環境中，可以簡化成兩種連線路徑：

```text
Podman CLI
    |
    | SSH
    v
Podman Engine (WSL)
    |
    v
Redis Container
```

以及：

```text
Podman Desktop
    |
    | Windows Named Pipe
    v
Windows API Forwarding
    |
    | SSH
    v
Podman Engine (WSL)
    |
    v
Redis Container
```

這也解釋了為什麼 CLI 可以正常操作 Redis，但 Desktop 卻無法取得 Container 清單。

兩者雖然最終都連到 Podman Engine，卻不一定經過相同的連線入口。

### 4.1 再次使用 Debug 模式啟動

重新執行：

```powershell
podman --log-level=debug machine start
```

再次看到：

```text
API forwarding for Docker API clients is not available
due to the following startup failures.

win-sshproxy.exe failed to start, exit code: 0
(see windows event logs)
```

但同一份 Log 最後又顯示：

```text
Machine "podman-machine-default" started successfully
```

這是整次排查最重要的發現之一：

**Podman Machine 啟動成功，不代表 Windows API Forwarding 也成功。**

Podman CLI 仍然可以透過 SSH 操作 Engine，但依賴 Windows API 連線的工具可能無法正常使用。

另外，`exit code: 0` 並不表示整個 Proxy 初始化流程成功，仍應依照後續的 API Forwarding 狀態判斷。

### 4.2 從 Windows Event Log 找出真正原因

Debug Log 提示：

```text
see windows event logs
```

因此改用 PowerShell 查詢 Windows Application Event Log：

```powershell
Get-WinEvent -FilterHashtable @{
    LogName = 'Application'
    StartTime = (Get-Date).AddMinutes(-30)
} -ErrorAction SilentlyContinue |
Where-Object {
    $_.Message -match 'win-sshproxy|podman|gvproxy'
} |
Select-Object TimeCreated, ProviderName, Id, Message |
Format-List
```

終於找到真正的錯誤：

```text
Error occurred in execution group:
error listening on socket:

C:/Users/<username>/AppData/Local/Temp/podman/
podman-machine-default-api.sock

bind: Only one usage of each socket address
(protocol/network address/port)
is normally permitted.
```

同一時間還出現：

```text
Listening on: \\.\pipe\docker_engine

Listening on: \\.\pipe\podman-machine-default
```

這代表 Proxy 曾經成功監聽 Windows Named Pipe，但在建立另一個 Unix Socket 時發生位址衝突，導致 API Forwarding 沒有成功完成啟動。

因此，真正需要處理的並不是 Linux 裡面的 Redis，也不是 rootful 設定，而是 Windows 端的 Socket。

## 五、修復 Socket 衝突

從錯誤訊息來看，可能的原因包括：

- 上一次執行後留下的 Socket。
- 仍有程序占用相同的 Socket。
- 多個 Proxy 程序嘗試使用相同路徑。

這次實際修復的方向，是停止 Machine 後處理有衝突的 Socket，再重新啟動。

### 5.1 檢查 Proxy 程序

```powershell
Get-Process win-sshproxy,gvproxy -ErrorAction SilentlyContinue | Select-Object Id, ProcessName, Path
```

### 5.2 檢查 Socket 是否存在

```powershell
$socket = Join-Path $env:LOCALAPPDATA 'Temp\podman\podman-machine-default-api.sock'

Test-Path $socket
```

如果路徑存在，可進一步檢查：

```powershell
Get-Item $socket -Force | Format-List FullName, Length, LastWriteTime
```

### 5.3 停止 Machine 並處理 Socket

先停止 Podman Machine：

```powershell
podman machine stop
```

**注意：這會中斷目前執行中的 Container。**

確認沒有 `win-sshproxy` 程序仍在使用 Socket：

```powershell
Get-Process win-sshproxy -ErrorAction SilentlyContinue
```

若已確認沒有程序使用，而且該 Socket 仍存在，可以先重新命名，避免直接刪除：

```powershell
$socket = Join-Path $env:LOCALAPPDATA 'Temp\podman\podman-machine-default-api.sock'

Rename-Item -LiteralPath $socket -NewName 'podman-machine-default-api.sock.bak'
```

這個方式保留原本的 Socket 路徑項目，方便必要時進一步調查。

要注意，**不能只因為 Socket 存在就直接刪除或重新命名**。如果仍有程序使用它，應先找出占用來源。

### 5.4 重新啟動 Machine

```powershell
podman --log-level=debug machine start
```

這次終於出現：

```text
API forwarding listening on: npipe:////./pipe/docker_engine

Docker API clients default to this address.
You do not need to set DOCKER_HOST.
```

最後也顯示：

```text
Machine "podman-machine-default" started successfully
```

與先前不同，這次不再出現：

```text
win-sshproxy.exe failed to start
```

代表 Windows API Forwarding 已經成功建立。

也因此解決了 Podman Desktop 無法取得 Container 清單的問題。

## 六、這次排查得到的幾個經驗

### 6.1 不要把 Machine Running 當成所有元件都正常

Podman Machine 涉及多個層級：

```text
Windows
  |
  +-- WSL2
  |     |
  |     +-- cgroups
  |     +-- Podman Engine
  |     +-- Containers
  |
  +-- API Forwarding
        |
        +-- win-sshproxy
        +-- Named Pipe
        +-- Unix Socket
        |
        +-- Podman Desktop
```

不同層級可能各自成功或失敗。

例如這次就出現：

- WSL 可以啟動，但 Podman Engine 無法正常使用 cgroups。
- Podman Engine 可以執行 Redis，但 Windows API Forwarding 無法建立。
- Podman Desktop 可以辨識 Machine，卻無法取得 Container 清單。

因此，排查時應先確認故障發生在哪一層，而不是看到 Machine 異常就直接重新建立。

### 6.2 CLI 正常不代表 Desktop 正常

Podman CLI 可以透過 SSH 連接 Linux Engine。

Podman Desktop 則可能依賴 Windows API Forwarding 提供的 Socket。

因此當 CLI 正常、Desktop 異常時，可以優先檢查：

```powershell
podman system connection list
```

```powershell
podman machine inspect
```

以及：

```powershell
Get-ChildItem \\.\pipe\ | Where-Object Name -match 'podman|docker'
```

這能協助判斷問題是 Engine、連線設定，還是 Windows API Forwarding。

### 6.3 Debug Log 不一定包含真正的根因

這次 Debug Log 只顯示：

```text
win-sshproxy.exe failed to start, exit code: 0
```

真正有用的錯誤反而是在 Windows Event Log：

```text
bind: Only one usage of each socket address
is normally permitted.
```

如果只看 Podman CLI 的輸出，可能會一直重複啟動 Machine，卻沒有真正處理 Socket 衝突。

所以遇到 Windows 端的程序異常時，Event Log 是值得優先檢查的資訊來源。

### 6.4 修復應從最小影響範圍開始

這次兩個問題分別透過：

1. 更新 WSL，恢復正常的 cgroups v2 環境。
2. 處理 Windows 端的 Socket 衝突，恢復 API Forwarding。

就完成修復。

沒有必要刪除 Redis Image、重建 Container，或再次移除整個 Podman Machine。

尤其在已經存在開發資料或 Volume 的環境中，重新建立 Machine 可能帶來不必要的資料遺失風險。

## 七、結語

這次 Podman 5.8.3 升級至 6.1.4，最初看起來只是 Machine 無法啟動的問題。

但在更新 WSL 後，又發現 Podman CLI 正常、Podman Desktop 卻無法顯示 Container。

最後才確認，原來是兩個不同層級的問題：

**第一個是 WSL 執行環境與 cgroups 不相容；第二個是 Windows API Forwarding 的 Unix Socket 發生位址衝突。**

整個過程最重要的並不是記住某個修復指令，而是建立一套排查順序：

**先確認 Machine，再確認 Engine，接著確認 Connection，最後追查 Proxy 與 Socket。**

當每一層的狀態都能獨立驗證時，即使錯誤訊息不夠明確，也比較容易找到真正的問題。

這次最大的收穫是：**服務能啟動，不代表所有連線路徑都正常；而真正的根因，有時藏在主程式 Log 以外的地方。**
