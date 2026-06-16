<template>
    <div
        id='app'
        :class="{
            'lang-ko': $i18n.locale === 'ko',
            'intro-only': !introDone,
        }"
    >
        <GNB v-show='introDone' />
        <Nuxt />
    </div>
</template>

<script>
    import GNB from '@/layouts/GNB.vue';

    export default {
        components: {
            GNB,
        },
        data() {
            return {
                introDone: false,
            };
        },
        mounted() {
            if (
                process.client &&
                sessionStorage.getItem('wb2026-intro-done') === '1'
            ) {
                this.introDone = true;
            }
            this.onIntroState = (done) => {
                this.introDone = done;
            };
            this.$root.$on('mainvisual-intro-state', this.onIntroState);
        },
        beforeDestroy() {
            this.$root.$off('mainvisual-intro-state', this.onIntroState);
        },
    };
</script>

<style lang='scss' scoped>
@use '@/assets/scss/base/variables' as *;

#app {
    min-height: 100vh;
    box-sizing: border-box;
    background-color: $black;
    color: $white;

    &.intro-only {
        height: 100vh;
        overflow: hidden;
    }
}
</style>

<style>
.ripple-target {
    min-height: 100vh;
    filter: url(#mouse-ripple-filter);
    -webkit-filter: url(#mouse-ripple-filter);
    will-change: filter;
    isolation: isolate;
}

#language-menu {
    position: fixed;
    top: 2.5vw;
    right: 2.5vw;
    z-index: 10;
}
</style>
