<template>
    <div id='language-menu'>
        <button
            :class='[{ ko_active: currentLocale === "ko" }]'
            @click.stop='toggleLocale'
        >
            <p>{{ currentLocale === 'ko' ? 'KO' : 'EN' }}</p>
        </button>
    </div>
</template>

<script>
    import en from '@/locales/en.js';
    import ko from '@/locales/ko.js';

    const LOCALE_MESSAGES = { en, ko };

    export default {
        computed: {
            currentLocale() {
                return this.$i18n.locale;
            },
        },
        mounted() {
            if (!LOCALE_MESSAGES[this.currentLocale]) {
                this.applyLocale('en');
            }
        },
        methods: {
            applyLocale(locale) {
                if (this.$i18n.locale === locale) return;

                const scrollY = window.scrollY;
                const messages = LOCALE_MESSAGES[locale];
                if (messages) {
                    this.$i18n.setLocaleMessage(locale, messages);
                }
                this.$i18n.locale = locale;

                if (typeof this.$i18n.setLocaleCookie === 'function') {
                    this.$i18n.setLocaleCookie(locale);
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
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;

    button {
        background-color: rgba(35, 34, 33, 0.4);
        width: 48px;
        height: 24px;
        border-radius: 24px;
        padding: 2px;

        p {
            display: block;
            background: url('@/assets/img/flag_uk.svg') no-repeat center center / cover;
            width: 20px;
            height: 20px;
            border-radius: 50%;
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
</style>