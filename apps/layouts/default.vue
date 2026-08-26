<template>
    <div
        id='app'
        :class="{
            'lang-ko': $i18n.locale === 'ko',
            'intro-only': introOnlyActive,
        }"
    >
        <SiteHeader />
        <SiteCursor />
        <div
            v-show='headerFixed && introDone'
            class='header-blur'
            aria-hidden='true'
        />
        <GNB v-show='introDone' />
        <Nuxt />
        <SiteFooter v-show='introDone' />
    </div>
</template>

<script>
    import SiteHeader from '@/layouts/Header.vue';
    import SiteCursor from '@/layouts/Cursor.vue';
    import GNB from '@/layouts/GNB.vue';
    import SiteFooter from '@/layouts/Footer.vue';
    import { isHomeRoute } from '@/utils/introState';

    export default {
        components: {
            SiteHeader,
            SiteCursor,
            GNB,
            SiteFooter,
        },
        data() {
            return {
                introDone: false,
                headerFixed: false,
            };
        },
        computed: {
            isHome() {
                return isHomeRoute(this.$route);
            },
            introOnlyActive() {
                return this.isHome && !this.introDone;
            },
        },
        watch: {
            '$route.path'() {
                this.syncIntroLayout();
            },
        },
        mounted() {
            this.syncIntroLayout();
            this.onIntroState = (done) => {
                if (!this.isHome) return;
                this.introDone = done;
            };
            this.onHeaderFixed = (fixed) => {
                this.headerFixed = fixed;
            };
            this.$root.$on('mainvisual-intro-state', this.onIntroState);
            this.$root.$on('header-fixed-state', this.onHeaderFixed);
        },
        beforeDestroy() {
            this.$root.$off('mainvisual-intro-state', this.onIntroState);
            this.$root.$off('header-fixed-state', this.onHeaderFixed);
        },
        methods: {
            syncIntroLayout() {
                if (!process.client) return;

                if (!this.isHome) {
                    this.introDone = true;
                    return;
                }

                this.introDone = false;
            },
        },
    };
</script>

<style lang='scss' scoped>
    @use '@/assets/scss/base/variables' as *;

    #app {
        min-height: 100vh;
        box-sizing: border-box;

        &.intro-only {
            height: 100vh;
            overflow: hidden;
        }
    }

    .header-blur {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: calc(40px + 5vw);
        z-index: 8;
        pointer-events: none;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        mask-image: linear-gradient(to bottom, #000 0%, transparent 100%);
        -webkit-mask-image: linear-gradient(to bottom, #000 0%, transparent 100%);
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
