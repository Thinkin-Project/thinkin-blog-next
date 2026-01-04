<script lang="ts">
    const currentYear = new Date().getFullYear();
</script>

<footer class="pt-8 border-t border-border space-y-8">
    <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold tracking-tight">免責聲明</h2>
    </div>
    <div class="space-y-4">
        <p class="text-lg font-medium leading-relaxed text-muted-foreground">
            本網站對於任何使用或引用本網站網頁資料引致之損失或損害，概不負責。本網站亦有權隨時刪除、暫停或編輯本網站所登載之各項資料，以維護本網站之權益。除法律有強制規定外，在任何情況下，本網站對於
            (1) 使用或無法使用本網站之各項服務；(2) 經由本網站取得訊息或進行交易；(3)
            第三人在本網站上之陳述或作為；以及 (4)
            其他與本網站服務有關之事項所致生之任何直接、間接、附帶、特別、懲罰性或衍生性損害，一概不負賠償責任。
        </p>
    </div>
    <div class="flex flex-row justify-between gap-8">
        <div class="flex flex-col justify-end text-sm text-muted-foreground text-right">
            <p>CopyRight © {currentYear} Thinkin Markdown</p>
        </div>
    </div>
</footer>
