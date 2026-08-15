# UI 與樣式

- 採 Mobile-first 設計。
- 優先使用 Tailwind CSS。
- 優先使用 Shadcn Svelte 元件。
- Theme、色彩與設計 Token 優先透過 CSS Variables 或 Theme Tokens 管理。
- 優先先定義 Design Tokens，再於 Tailwind 或 CSS 中使用，避免在模板內重複硬寫 arbitrary values。
- 僅在 Utility Classes 無法清楚表達時加入自訂 CSS。
- 當樣式涉及 pseudo-elements、多層背景、複合 gradients 或 masks、材質效果或較複雜動畫時，可使用局部 CSS 或 `@layer components`。
- 不要為了追求零 CSS 而將複合樣式硬拆成冗長的 Utility Classes。
- 不因小需求新增大型全域樣式檔。
- 若既有全域樣式已有可重用且合理的複合樣式，可沿用；新增樣式時仍以 Tailwind-first 為原則。
