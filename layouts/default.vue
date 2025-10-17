<template>
    <div id="app">
        <Intro v-if="showIntro" @end="handleIntroEnd" />
        
        <PageTransition 
            v-if="showPageTransition"
            :title="pageTransitionTitle"
            @end="handlePageTransitionEnd"
        />
        <CursorCustom 
            :extra-class="$store.state.cursor.extraClass"
            :showLottie="showCursorLottie"
        />
        <GNB v-if="!isNoUIPage" />
        <Nuxt :key="$route.fullPath" />
        <Footer v-if="showFooter" />
        <DetailFooter
            v-if="showDetailFooter"
            :next-project="nextProject"
            :next-archive-dev="nextArchiveDev"
            :next-archive-music="nextArchiveMusic"
        />
    </div>
</template>

<script>
import Intro from '@/layouts/Intro.vue';
import PageTransition from '@/layouts/PageTransition.vue';
import CursorCustom from '@/components/CursorCustom.vue';
import GNB from '@/layouts/gnb.vue';
import Footer from '@/layouts/Footer.vue';
import DetailFooter from '@/layouts/DetailFooter.vue';

export default {
    components: { Intro, PageTransition, CursorCustom, GNB, Footer, DetailFooter },
    data() {
        return {
            hasVisitedHome: false,
        };
    },
    computed: {
        showIntro() {
            return this.$store.state.showIntro;
        },
        isNoUIPage() {
            return this.$store.state.isNoUIPage;
        },
        showFooter() {
            const s = this.$store.state;
            return !s.isDetailPage && !s.isNoUIPage;
        },
        showDetailFooter() {
            const s = this.$store.state;
            return s.isDetailPage && (s.nextProject || s.nextArchiveDev || s.nextArchiveMusic) && !s.isNoUIPage;
        },
        nextProject() {
            return this.$store.state.nextProject;
        },
        nextArchiveDev() {
            return this.$store.state.nextArchiveDev;
        },
        nextArchiveMusic() {
            return this.$store.state.nextArchiveMusic;
        },
        showCursorLottie() {
            return this.$store.state.cursor.showLottie || false;
        },
        showPageTransition() {
            const show = this.$store.state.showPageTransition;
            console.log('[default.vue] showPageTransition computed:', show);
            return show;
        },
        pageTransitionTitle() {
            const title = this.$store.state.pageTransitionTitle;
            console.log('[default.vue] pageTransitionTitle computed:', title);
            return title;
        },
    },
    mounted() {
        this.initLocale();
        this.checkIntro(true);
    },
    watch: {
        '$route.fullPath'(to, from) {
            this.initLocale();
            this.checkIntro(false);
        },
    },
    methods: {
        handleIntroEnd() {
            console.log('[default] handleIntroEnd called');
            this.$store.commit('setShowIntro', false);
            this.hasVisitedHome = true;
            sessionStorage.setItem('introShown', 'true');
            console.log('[default] sessionStorage set, dispatching intro-end event');
            
            this.$nextTick(() => {
                console.log('[default] Dispatching intro-end event');
                window.dispatchEvent(new Event('intro-end'));
            });
        },
        handlePageTransitionEnd() {
            this.$store.commit('setShowPageTransition', false);
        },
        checkIntro(isInitialLoad) {
            const path = this.$route.path;
            const homePaths = ['/', '/ko'];

            if (!homePaths.includes(path)) {
                this.$store.commit('setShowIntro', false);
                return;
            }

            const perfEntries = performance.getEntriesByType('navigation');
            const isReload = perfEntries.length && perfEntries[0].type === 'reload';

            const sessionStored = sessionStorage.getItem('introShown') === 'true';

            if (isInitialLoad && (!sessionStored || isReload)) {
                this.$store.commit('setShowIntro', true);
                sessionStorage.removeItem('introShown');
                this.hasVisitedHome = false;
            } else {
                this.$store.commit('setShowIntro', !this.hasVisitedHome && !sessionStored);
            }
        },
        initLocale() {
            this.$store.dispatch('locales/initLocale');
            const locale = this.$store.state.locales.locale;
            if (this.$i18n.locale !== locale) {
                this.$i18n.setLocale(locale);
            }
        },
    },
};
</script>

<style lang="scss">
@use '@/assets/scss/base/variables.scss' as *;

#app {
    background-color: $white2;
    color: $black1;
    overflow: hidden;
}
</style>
