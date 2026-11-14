# 工作項目

- [x] 調整文章清單的寬度分配與 hover 預留空間。
- [x] 執行可用的靜態檢查與版面驗證，記錄結果。

## 驗收條件

- 情境：桌面顯示長標題與長摘要時，文字自然換行，日期與閱讀時間完整維持單行。
- 情境：滑鼠移入清單時，文字右移仍與日期欄保持間距。
- 情境：手機顯示清單時，資訊維持上下排列，文字右移不超出可用寬度。
- 情境：摘要完整保留，文章內容及其他元件不變。

## 驗證結果

- Prettier（元件與 SDD 文件）、元件 ESLint 通過。
- SvelteKit sync 與 svelte-check 通過，0 errors / 0 warnings。
- Vite production build 通過；adapter-auto 提示未指定部署環境。
- 原始碼檢查：左右文字容器皆允許收縮；metadata 不收縮、不換行。右側 padding 預留 32px hover 位移，桌面另保留 16px gap；手機維持 flex-col。
- 尚未進行瀏覽器的多尺寸、hover 視覺驗收，需使用者確認實際畫面。
- 僅調整清單元件的 CSS classes，摘要及文章內容未變更。
