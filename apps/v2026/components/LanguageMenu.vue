<template>
    <div id='language-menu'>
        <button
            :class="['mouse-hover2', { active: currentLocale === 'en' }]"
            @click="changeLocale('en')"
        >
            <TextShifting :text='"ENG"' />
        </button>
        <button
            :class="['mouse-hover2', { active: currentLocale === 'ko' }]" 
            @click="changeLocale('ko')"
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



<style lang='scss' scoped>
@use '@/assets/scss/base/variables.scss' as *;
    
#language-menu {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    position: fixed;
    top: 2.5vw;
    left: 5vw;
    z-index: 11;
        
    button {
        font-size: 0.8rem;
        opacity: 0.5;

        .text-shifting {
            display: inline-block;

            ::v-deep span {
                color: $black;
                user-select: none;
            }
        }

        &:not(:last-child)::after {
            content: '';
            display: inline-block;
            width: 1px;
            height: 0.6rem;
            background-color: $black;
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