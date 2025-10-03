<template>
    <div id="app">
        <Intro v-if="showIntro" @end="handleIntroEnd" />

        <div v-else>
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
    </div>
</template>

<script>
import Intro from '@/layouts/Intro.vue';
import CursorCustom from '@/components/CursorCustom.vue';
import GNB from '@/layouts/gnb.vue';
import Footer from '@/layouts/Footer.vue';
import DetailFooter from '@/layouts/DetailFooter.vue';

export default {
    components: { Intro, CursorCustom, GNB, Footer, DetailFooter },
    data() {
        return {
            showIntro: false,
            hasVisitedHome: false,
        };
    },
    computed: {
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
            this.showIntro = false;
            this.hasVisitedHome = true;
            sessionStorage.setItem('introShown', 'true');
        },
        checkIntro(isInitialLoad) {
            const path = this.$route.path;
            const homePaths = ['/', '/ko'];

            if (!homePaths.includes(path)) {
                this.showIntro = false;
                return;
            }

            const perfEntries = performance.getEntriesByType('navigation');
            const isReload = perfEntries.length && perfEntries[0].type === 'reload';

            const sessionStored = sessionStorage.getItem('introShown') === 'true';

            if (isInitialLoad && (!sessionStored || isReload)) {
                this.showIntro = true;
                sessionStorage.removeItem('introShown');
                this.hasVisitedHome = false;
            } else {
                this.showIntro = !this.hasVisitedHome && !sessionStored;
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
