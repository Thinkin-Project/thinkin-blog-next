<script lang="ts">
    import { onMount } from 'svelte';

    import * as CookieConsent from 'vanilla-cookieconsent';
    import 'vanilla-cookieconsent/dist/cookieconsent.css';

    /**
     * @type {import('vanilla-cookieconsent').Config}
     */
    const config: any = {
        guiOptions: {
            consentModal: {
                layout: 'box',
                position: 'bottom right',
                equalWeightButtons: true,
                flipButtons: false
            },
            preferencesModal: {
                layout: 'box',
                position: 'left',
                equalWeightButtons: true,
                flipButtons: false
            }
        },
        categories: {
            strictly: {
                readOnly: true,
                enabled: true
            },
            functionality: {
                enabled: false,
                autoClear: {
                    cookies: [
                        {
                            name: /^__vdpl/ // Vercel deployment cookie
                        }
                    ]
                }
            },
            analytics: {
                enabled: false,
                autoClear: {
                    cookies: [
                        {
                            name: /^_ga/ // Google Analytics cookies
                        },
                        {
                            name: /^_gid/
                        }
                    ]
                }
            }
        },
        language: {
            default: 'zh-Hant',
            translations: {
                'zh-Hant': {
                    consentModal: {
                        title: 'Cookie 使用聲明',
                        description:
                            '為了提供您最佳的網站體驗，我們使用 Cookie。繼續使用本網站即代表您同意我們使用必要的 Cookie。您可以隨時調整設定。',
                        acceptAllBtn: '全部接受',
                        acceptNecessaryBtn: '僅接受必要',
                        showPreferencesBtn: '自定義設定',
                        footer: '<a href="/privacy">隱私權政策</a>'
                    },
                    preferencesModal: {
                        title: 'Cookie 偏好設定',
                        acceptAllBtn: '全部接受',
                        acceptNecessaryBtn: '僅接受必要',
                        saveSettingsBtn: '儲存設定',
                        closeIconLabel: '關閉',
                        serviceCounterLabel: '服務項',
                        sections: [
                            {
                                title: 'Cookie 使用說明',
                                description:
                                    '我們使用 Cookie 來優化功能並分析流量。您可以根據個人需求調整各項目的設定。'
                            },
                            {
                                title: '絕對必要 Cookie <span class="pm__badge">始終啟用</span>',
                                description: '這些 Cookie 對於網站的基本運作至關重要，無法關閉。',
                                linkedCategory: 'strictly'
                            },
                            {
                                title: '功能性 Cookie',
                                description:
                                    '用於提供增強功能與個人化內容（例如嵌入的 Giscus 留言系統或影片）。',
                                linkedCategory: 'functionality'
                            },
                            {
                                title: '分析型 Cookie',
                                description: '幫助我們了解訪客如何與網站互動，以便持續改進。',
                                linkedCategory: 'analytics'
                            },
                            {
                                title: '更多資訊',
                                description:
                                    '如果您有任何疑問，歡迎造訪我們的 <a href="/privacy">隱私權政策</a> 或聯繫我們。'
                            }
                        ]
                    }
                }
            },
            onConsent: () => {
                window.dispatchEvent(new CustomEvent('cc:onConsent'));
            },
            onChange: () => {
                window.dispatchEvent(new CustomEvent('cc:onConsent'));
            }
        }
    };

    onMount(() => {
        CookieConsent.run(config);

        // Expose to window for other components (like Giscus or Privacy page)
        if (typeof window !== 'undefined') {
            // @ts-ignore
            window.CookieConsent = CookieConsent;
        }
    });
</script>

<style>
    /* 整合部落格的設計語系與變數 */
    :global(:root) {
        --cc-font-family: var(--font-sans);
        --cc-modal-border-radius: var(--radius);
        --cc-btn-border-radius: calc(var(--radius) - 2px);

        /* 基礎顏色 */
        --cc-bg: var(--background);
        --cc-text: var(--foreground);

        /* 按鈕顏色 */
        --cc-btn-primary-bg: var(--primary);
        --cc-btn-primary-text: var(--primary-foreground);

        --cc-btn-secondary-bg: var(--secondary);
        --cc-btn-secondary-text: var(--secondary-foreground);

        --cc-separator-border: var(--border);
        --cc-footer-bg: var(--muted);
        --cc-footer-text: var(--muted-foreground);

        --cc-toggle-on-bg: var(--primary);
        --cc-toggle-off-bg: var(--muted-foreground);
        --cc-toggle-on-knob-bg: var(--primary-foreground);
        --cc-toggle-off-knob-bg: var(--background);
    }

    /* ============================================== */
    /* 1. 全局佈局與結構修正 (適用於 Light & Dark)    */
    /* ============================================== */

    /* 視窗與容器結構 */
    :global(#cc-main .pm) {
        height: auto !important; /* 自動高度，避免空洞 */
        max-height: 85vh !important;
        border-radius: 12px !important;
    }

    :global(#cc-main .cc__modal) {
        border-radius: 12px !important;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
        backdrop-filter: blur(16px) !important;
        overflow: hidden !important;
    }

    /* 確保所有模式下的區塊間距一致 */
    :global(#cc-main .pm__section),
    :global(#cc-main .pm__category) {
        margin-top: 1rem !important;
        margin-bottom: 1rem !important;
        border-radius: 8px !important;
        padding: 1rem !important;
    }

    /* 修正中間內容產生的滑動條問題 */
    :global(#cc-main .pm__body) {
        flex: none !important;
        padding: 0 1.2rem !important; /* 統一左右間距 */
    }

    /* ============================================== */
    /* 2. 深色模式主題 (僅覆蓋顏色，不改結構)       */
    /* ============================================== */

    /* 視窗底色 */
    :global(html.dark #cc-main),
    :global(html.dark #cc-main .cc__modal) {
        --cc-bg: #09090b !important; /* Zinc 950 */
        --cc-text: #fafafa !important; /* Zinc 50 */
        background-color: #09090b !important;
        color: #fafafa !important;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
    }

    /* Header 與 Footer 邊線 */
    :global(html.dark #cc-main .pm__header) {
        border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
    }

    :global(html.dark #cc-main .pm__footer),
    :global(html.dark #cc-main .cc__footer) {
        border-top: 1px solid rgba(255, 255, 255, 0.05) !important;
        background: rgba(9, 9, 11, 0.8) !important;
    }

    /* 區塊卡片配色 (維持結構，僅變色) */
    :global(html.dark #cc-main .pm__section),
    :global(html.dark #cc-main .pm__category) {
        background: #18181b !important; /* Zinc 900 */
        border: 1px solid #27272a !important; /* Zinc 800 */
    }

    :global(html.dark #cc-main .pm__section:hover) {
        background: #18181b !important;
        border-color: #3f3f46 !important; /* Zinc 700 */
    }

    /* 區塊內部分隔線 */
    :global(html.dark #cc-main .pm__section-title),
    :global(html.dark #cc-main .pm__category-title) {
        border-bottom-color: #27272a !important;
    }

    /* 文字顏色覆蓋 */
    :global(html.dark #cc-main .pm__title) {
        color: #fafafa !important;
    }
    :global(html.dark #cc-main .pm__section-title) {
        color: #f4f4f5 !important;
    }
    :global(html.dark #cc-main .pm__section-desc) {
        color: #a1a1aa !important;
    }

    /* 按鈕樣式 (Zinc 風格) */
    :global(#cc-main .pm__btn) {
        border-radius: 8px !important;
        font-weight: 500 !important;
    }

    /* 深色模式按鈕配色 */
    :global(html.dark #cc-main .pm__btn) {
        background: #27272a !important;
        color: #ffffff !important;
        border: 1px solid #3f3f46 !important;
    }

    :global(html.dark #cc-main .pm__btn:hover) {
        background: #3f3f46 !important;
    }

    :global(html.dark #cc-main .pm__btn--secondary) {
        background: transparent !important;
        border-color: rgba(255, 255, 255, 0.1) !important;
    }

    :global(html.dark #cc-main .pm__btn--secondary:hover) {
        background: rgba(255, 255, 255, 0.05) !important;
    }

    /* 其他元件顏色 */
    :global(html.dark #cc-main .pm__badge) {
        background: rgba(244, 114, 182, 0.1) !important;
        color: #f472b6 !important;
        border: 1px solid rgba(244, 114, 182, 0.2) !important;
    }

    :global(html.dark #cc-main .pm__category-arrow) {
        stroke: #71717a !important;
    }
    :global(html.dark #cc-main .pm__section:hover .pm__category-arrow) {
        stroke: #fafafa !important;
    }

    :global(html.dark #cc-main .cc__footer-links a) {
        color: #71717a !important;
    }
    :global(html.dark #cc-main .cc__footer-links a:hover) {
        color: #fafafa !important;
        text-decoration: underline !important;
    }
</style>
