<template>
    <div id='app'>
        <CursorCustom 
            :extra-class="$store.state.cursor.extraClass"
            :showLottie="showCursorLottie"
        />
        <GNB v-if='!isNoUIPage' />
        <Nuxt :key='$route.fullPath' />
        <Footer v-if='showFooter' />
        <DetailFooter
            v-if='showDetailFooter'
            :next-project='nextProject'
            :next-archive-dev='nextArchiveDev'
            :next-archive-music='nextArchiveMusic'
        />
    </div>
</template>

<script>
import CursorCustom from '@/components/CursorCustom.vue';
import GNB from '@/layouts/gnb.vue';
import Footer from '@/layouts/Footer.vue';
import DetailFooter from '@/layouts/DetailFooter.vue';

export default {
    components: { 
        CursorCustom,
        GNB,
        Footer,
        DetailFooter,
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
        }
    },
};
</script>

<style lang='scss'>
@use '@/assets/scss/base/variables.scss' as *;

#app {
    background-color: $white2;
    color: $black1;
    overflow: hidden;
}
</style>