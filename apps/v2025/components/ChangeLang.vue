<template>
    <div id='change-lang'>
        <button @click="changeLocale('en')"
            :class="['mouse-hover2', { active: currentLocale === 'en' }]"
        >
            <TextShifting :text='"ENG"' />
        </button>
        <button @click="changeLocale('ko')" 
            :class="['mouse-hover2', { active: currentLocale === 'ko' }]"
        >
            <TextShifting :text='"KO"' />
        </button>
    </div>
</template>

<script>
import TextShifting from '@/components/TextShifting.vue';

export default {
    components: {
        TextShifting,
    },
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

<style lang='scss'>
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
        color: var(--btn-color, $black1);

        .text-shifting {
            display: inline-block;
        }

        &:not(:last-child)::after {
            content: '';
            display: inline-block;
            width: 1px;
            height: 0.6rem;
            background-color: var(--after-color, $black1);
            margin: 0 8px;
        }

        &.active {
            font-weight: bold;
        }
    }
}

// mobile
@media all and (max-width: $mobile) {
    #change-lang {
        position: initial;
        justify-content: flex-end;

        .text-shifting {
            span {
                color: $white1 !important;
            }
        }

        button:not(:last-child)::after {
            background-color: $white1;
        }
    }    
}
</style>