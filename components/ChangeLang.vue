<template>
    <div id='change-lang'>
        <button @click="changeLocale('en')"
            :class="['mouse-hover2', { active: currentLocale === 'en' }]"
        >
            ENG
        </button>
        <button @click="changeLocale('ko')" 
            :class="['mouse-hover2', { active: currentLocale === 'ko' }]"
        >
            KO
        </button>
    </div>
</template>

<script>
export default {
    computed: {
        currentLocale() {
            return this.$i18n.locale;
        }
    },
    methods: {
        changeLocale(locale) {
            this.$store.dispatch('locales/setLocale', locale);
            this.$i18n.setLocale(locale);
        }
    },
}
</script>

<style lang='scss' scoped>
@use '@/assets/scss/base/variables.scss' as *;
    
#change-lang {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    position: fixed;
    top: 2vh;
    left: 5vw;
    z-index: 10;
        
    button {
        font-size: 0.8rem;
        color: $black1;

        &:not(:last-child)::after {
            content: '';
            display: inline-block;
            width: 1px;
            height: 0.6rem;
            background-color: $black1;
            margin: 0 8px;
        }

        &.active {
            font-weight: bold;
        }
    }
}
</style>