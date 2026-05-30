/**
 * 主題結構
 */
export interface Topic {
    name: string;
    slug: string;
    aliases: string[];
}

/**
 * 標籤結構
 */
export interface Tag {
    name: string;
    slug: string;
    aliases: string[];
}
