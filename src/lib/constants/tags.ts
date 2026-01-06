import type { Tag } from '$lib/types';

export const TAGS: Tag[] = [
    { name: '創建型模式', slug: 'creational-pattern' },
    { name: 'SOLID 原則', slug: 'solid' },
    { name: 'Chrome 擴充功能', slug: 'chrome-extension' },
    { name: 'JMeter', slug: 'jmeter' },
    { name: 'BlazeMeter', slug: 'blazemeter' },
    { name: '壓力測試', slug: 'stress-test' },
    { name: '單元測試', slug: 'unit-test' },
    { name: 'Windows', slug: 'windows' },
    { name: 'Command Prompt', slug: 'command-prompt' },
    { name: 'Windows Powershell', slug: 'windows-powershell' },
    { name: 'IDE', slug: 'ide' },
    { name: 'Visual Studio 擴充功能', slug: 'visual-studio-extension' },
    { name: 'Installer Projects', slug: 'installer-projects' },
    { name: '部署', slug: 'deploy' },
    { name: 'AxoCover', slug: 'axocover' },
    { name: '程式碼覆蓋率', slug: 'code-coverage' },
    { name: '指令', slug: 'command' },
    { name: 'exp', slug: 'exp' },
    { name: 'imp', slug: 'imp' },
    { name: '資料存取', slug: 'data-access' }
];

/**
 * 根據 slug 取得標籤名稱
 */
export function getTagName(slug: string): string {
    return TAGS.find((t) => t.slug === slug)?.name || slug;
}
