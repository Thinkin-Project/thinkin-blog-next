/**
 * 計算文字的預估閱讀時間 (分鐘)
 * 演算法參考：
 * - 中文字：約 300 ~ 500 字/分鐘
 * - 英文字：約 200 ~ 250 詞/分鐘
 */
export function calculateReadingTime(content: string): number {
    // 移除 HTML 標籤 (如果是純 Markdown 則可能不需要，但保險起見)
    const pureText = content.replace(/<[^>]*>?/gm, '');

    // 計算中文字數 (CJK 字元範圍)
    const chineseChars = pureText.match(/[\u4e00-\u9fa5]/g) || [];
    const chineseCount = chineseChars.length;

    // 計算英文字數 (以空格分隔的單字)
    // 先移除中文字元以準確計數英文單字
    const englishText = pureText.replace(/[\u4e00-\u9fa5]/g, ' ');
    const englishWords = englishText.split(/\s+/).filter((word) => word.length > 0);
    const englishCount = englishWords.length;

    // 計算時間
    const chineseTime = chineseCount / 300; // 300 字/分鐘
    const englishTime = englishCount / 200; // 200 詞/分鐘

    const totalTime = Math.ceil(chineseTime + englishTime);

    return totalTime > 0 ? totalTime : 1; // 至少 1 分鐘
}
