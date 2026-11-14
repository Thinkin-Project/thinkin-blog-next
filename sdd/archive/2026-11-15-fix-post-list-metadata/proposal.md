# fix-post-list-metadata

類型：修 bug

## 為什麼做

文章清單的長標題或摘要會壓縮右側日期，使日期換行；hover 的文字位移也可能侵入資訊欄。

## 要改什麼

- 左側使用剩餘寬度，標題與摘要完整自然換行。
- 日期與閱讀時間不收縮、不換行。
- 預留 hover 位移與欄間距，手機維持上下排列。
- 不截斷摘要，不修改文章內容或精選文章元件。

## 影響範圍

- `src/lib/components/PostListItem.svelte`
- `sdd/fix-post-list-metadata/proposal.md`
- `sdd/fix-post-list-metadata/tasks.md`

使用者已於本輪授權依推薦方案建立任務後直接實作，並要求合併回報。
