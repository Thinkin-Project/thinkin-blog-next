<script lang="ts">
    import { onMount } from 'svelte';

    import * as CookieConsent from 'vanilla-cookieconsent';
    import 'vanilla-cookieconsent/dist/cookieconsent.css';

    /**
     * @type {CookieConsent.CookieConsentConfig}
     */
    const config: CookieConsent.CookieConsentConfig = {
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
                        savePreferencesBtn: '儲存設定',
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
            }
        },
        onConsent: () => {
            window.dispatchEvent(new CustomEvent('cc:onConsent'));
        },
        onChange: () => {
            window.dispatchEvent(new CustomEvent('cc:onConsent'));
        }
    };

    onMount(() => {
        CookieConsent.run(config);

        // Expose to window for other components (like Giscus or Privacy page)
        if (typeof window !== 'undefined') {
            window.CookieConsent = CookieConsent;
        }
    });
</script>

<style>
    /* ============================================== */
    /* 全局佈局與結構修正 (適用於 Light & Dark)    */
    /* ============================================== */
    :global(#cc-main .pm__body) {
        padding: 1rem !important;
    }

    /* 確保所有模式下的區塊間距一致 */
    :global(#cc-main .pm__section),
    :global(#cc-main .pm__category) {
        margin-top: 1rem !important;
        margin-bottom: 1rem !important;
        border-radius: 8px !important;
        padding: 1rem !important;
    }

    :global(#cc-main .cm__btns) {
        padding: 1rem !important;
    }

    /* ============================================== */
    /* 淺色模式主題    */
    /* ============================================== */
    :global(#cc-main .cm__btn[data-role='all']) {
        background-color: #27272a;
        border: none;
    }

    :global(#cc-main .cm__btn[data-role='all']:hover) {
        background-color: #3f3f46;
    }

    :global(#cc-main .cm__btn[data-role='necessary']) {
        background-color: #27272a;
        border: none;
    }

    :global(#cc-main .cm__btn[data-role='necessary']:hover) {
        background-color: #3f3f46;
    }

    :global(#cc-main .pm__btn[data-role='all']) {
        background-color: #27272a;
        border: none;
    }

    :global(#cc-main .pm__btn[data-role='all']:hover) {
        background-color: #3f3f46;
    }

    :global(#cc-main .pm__btn[data-role='necessary']) {
        background-color: #27272a;
        border: none;
    }

    :global(#cc-main .pm__btn[data-role='necessary']:hover) {
        background-color: #3f3f46;
    }

    /* ============================================== */
    /* 深色模式主題    */
    /* ============================================== */
    :global(html.dark #cc-main .cm__body) {
        background-color: var(--secondary);
    }

    :global(html.dark #cc-main .cm__title) {
        color: #ffffff;
    }

    :global(html.dark #cc-main .cm__desc) {
        color: var(--muted-foreground);
    }

    :global(html.dark #cc-main .cm__btns) {
        border-color: var(--muted-foreground);
    }

    :global(html.dark #cc-main .cm__btn[data-role='all']) {
        background-color: var(--primary);
        color: var(--primary-foreground);
        border: none;
    }

    :global(html.dark #cc-main .cm__btn[data-role='all']:hover) {
        background-color: var(--primary);
        opacity: 0.9;
    }

    :global(html.dark #cc-main .cm__btn[data-role='necessary']) {
        background-color: var(--primary);
        color: var(--primary-foreground);
        border: none;
    }

    :global(html.dark #cc-main .cm__btn[data-role='necessary']:hover) {
        background-color: var(--primary);
        opacity: 0.9;
    }

    :global(html.dark #cc-main .cm__footer) {
        background-color: var(--secondary);
        border-color: var(--muted-foreground);
    }

    :global(html.dark #cc-main .cm__links .cm__link-group a) {
        color: var(--primary);
    }

    :global(html.dark #cc-main .pm--box) {
        background-color: var(--secondary);
    }

    :global(html.dark #cc-main .pm__header) {
        border-color: var(--muted-foreground);
        color: #ffffff;
    }

    :global(html.dark #cc-main .pm__section-title[role='heading']) {
        background-color: transparent;
        border-color: var(--primary-foreground);
        color: #ffffff;
    }

    :global(html.dark #cc-main .pm__section-title[role='heading']):hover {
        background-color: transparent;
    }

    :global(html.dark #cc-main .pm__section-title:not([role='heading'])) {
        background-color: var(--primary-foreground);
        border-color: var(--primary-foreground);
        color: #ffffff;
    }

    :global(html.dark #cc-main .pm__section-title):hover {
        background-color: #141416;
        border-color: #141416;
        color: #ffffff;
    }

    :global(html.dark #cc-main .pm__section-desc-wrapper) {
        border-color: var(--primary-foreground);
    }

    :global(html.dark #cc-main .pm__section-desc) {
        background-color: transparent;
        color: var(--muted-foreground);
    }

    :global(html.dark #cc-main .pm__section-desc a) {
        color: var(--primary);
    }

    :global(html.dark #cc-main .pm__section:last-child) {
        background-color: var(--secondary);
        border-color: var(--primary-foreground);
    }

    :global(html.dark #cc-main .pm__section:last-child):hover {
        background-color: var(--primary-foreground);
    }

    :global(html.dark #cc-main .pm__btn[data-role='all']) {
        background-color: var(--primary);
        color: var(--primary-foreground);
        border: none;
    }

    :global(html.dark #cc-main .pm__btn[data-role='all']:hover) {
        background-color: var(--primary);
        opacity: 0.9;
    }

    :global(html.dark #cc-main .pm__btn[data-role='necessary']) {
        background-color: var(--primary);
        color: var(--primary-foreground);
        border: none;
    }

    :global(html.dark #cc-main .pm__btn[data-role='necessary']:hover) {
        background-color: var(--primary);
        opacity: 0.9;
    }

    :global(html.dark #cc-main .pm__footer) {
        border-color: var(--muted-foreground);
    }
</style>
