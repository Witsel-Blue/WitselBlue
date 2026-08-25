<template>
    <div id='language-menu'>
        <CursorZone label='change language' attach-to-parent />
        <ClickSound attach-to-parent />
        <button
            :class='[{ ko_active: currentLocale === "ko" }]'
            @click.stop='toggleLocale'
        >
            <p>{{ currentLocale === 'ko' ? 'KO' : 'EN' }}</p>
        </button>
    </div>
</template>

<script>
    import CursorZone from '@/components/common/CursorZone.vue';
    import ClickSound from '@/components/common/ClickSound.vue';
    import {
        getSavedLocale,
        setSavedLocale,
        SUPPORTED_LOCALES,
    } from '@/utils/localeState';
    import {
        LOCALE_MESSAGES,
        ensureLocaleMessages,
    } from '@/utils/localeMessages';

    export default {
        components: {
            CursorZone,
            ClickSound,
        },
        computed: {
            currentLocale() {
                return this.$i18n.locale;
            },
        },
        mounted() {
            const saved = getSavedLocale();
            if (saved && saved !== this.currentLocale) {
                this.applyLocale(saved);
                return;
            }

            if (!LOCALE_MESSAGES[this.currentLocale]) {
                this.applyLocale('en');
            }
        },
        methods: {
            applyLocale(locale) {
                if (!SUPPORTED_LOCALES.includes(locale)) return;
                if (this.$i18n.locale === locale) return;

                const scrollY = window.scrollY;
                ensureLocaleMessages(this.$i18n, locale);
                this.$i18n.locale = locale;
                setSavedLocale(locale);

                if (typeof this.$i18n.setLocaleCookie === 'function') {
                    this.$i18n.setLocaleCookie(locale);
                }

                const path = this.switchLocalePath(locale);
                if (path && this.$route.fullPath !== path) {
                    this.$router.replace(path).finally(() => {
                        window.scrollTo(0, scrollY);
                    });
                    return;
                }

                this.$nextTick(() => {
                    window.scrollTo(0, scrollY);
                });
            },
            toggleLocale() {
                const next = this.currentLocale === 'ko' ? 'en' : 'ko';
                this.applyLocale(next);
            },
        },
    };
</script>



<style lang='scss' scoped>
@use '@/assets/scss/base/variables.scss' as *;
    
#language-menu {

    button {
        width: 48px;
        height: 24px;
        border-radius: 24px;
        padding: 2px;
        background: rgba($gray1, 0.2);
        -webkit-backdrop-filter: blur(8px);
        backdrop-filter: blur(8px);

        p {
            display: block;
            background: url('@/assets/img/flag_uk.svg') no-repeat center center / cover;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            box-shadow: $box-shadow;
            text-indent: -9999px;
            position: absolute;
            top: 2px;
            left: 2px;
            transition: all 0.4s ease;
        }

        &.ko_active {
            p {
                background: url('@/assets/img/flag_kr.svg') no-repeat center center / cover;
                left: 26px;
                transition: all 0.4s ease;
            }
        }
    }
}

@media (max-width: $mobile) {
    #language-menu {
        top: 5vw;
        right: 5vw;
    }
}
</style>