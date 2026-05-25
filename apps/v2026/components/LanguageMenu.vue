<template>
    <div id='language-menu'>
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
            this.$router.push(this.switchLocalePath(locale));
        },
    },
}
</script>



<style lang='scss'>
@use '@/assets/scss/base/variables.scss' as *;
    
#language-menu {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    position: fixed;
    top: 2vh;
    left: 5vw;
    z-index: 10;
        
    button {
        font-size: 0.8rem;
        color: $white;
        opacity: 0.5;

        .text-shifting {
            display: inline-block;
        }

        &:not(:last-child)::after {
            content: '';
            display: inline-block;
            width: 1px;
            height: 0.6rem;
            background-color: $white;
            margin: 0 8px;
            opacity: 0.5;
        }

        &.active {
            font-weight: bold;
            opacity: 1;
        }
    }
}
</style>