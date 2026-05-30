/**
 * 作者資訊結構
 */
export interface Author {
    id: string; // 唯一識別碼
    name: string; // 作者名稱
    avatar: string; // 頭像 URL
    bio: string; // 作者簡介
    website?: string; // 個人網站
    github?: string; // GitHub 連結
    linkedin?: string; // LinkedIn 連結
    facebook?: string; // Facebook 連結
    x?: string; // X (Twitter) 連結
}
