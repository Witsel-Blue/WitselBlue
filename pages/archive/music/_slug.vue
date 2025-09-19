<template>
    <div id='archive_music_detail' class='page_detail'>
      
        <CursorCustom />

        <div class='contents'>
            <section class='main'>
                <h1>{{ music?.title || 'Not Found' }}</h1>
            </section>
        </div>
    </div>
</template>

<script>
import archiveMusicData from '@/assets/data/archive_music.js'
import CursorCustom from '@/components/CursorCustom.vue';

export default {
    components: {
        CursorCustom,
    },
    data() {
        return {
            music: null,
        }
    },
    async asyncData({ params, store }) {
        const music = archiveMusicData.find(p => p.slug === params.slug);
        return { music };
    },
    beforeRouteEnter(to, from, next) {
        const music = archiveMusicData.find(p => p.slug === to.params.slug);
        const index = archiveMusicData.findIndex(p => p.slug === to.params.slug);
        const nextArchiveMusic = { ...archiveMusicData[(index + 1) % archiveMusicData.length], category: 'projects' };

        next(vm => {
            vm.music = music;
            vm.$nextTick(() => {
                vm.$store.commit('setDetailPage', true);
                vm.$store.commit('setNextArchiveMusic', nextArchiveMusic);
            });
        });
    },
    beforeRouteUpdate(to, from, next) {
        const music = archiveMusicData.find(p => p.slug === to.params.slug);
        const index = archiveMusicData.findIndex(p => p.slug === to.params.slug);
        const nextArchiveMusic = { ...archiveMusicData[(index + 1) % archiveMusicData.length], category: 'projects' };

        this.project = project;

        this.$nextTick(() => {
            this.$store.commit('setDetailPage', true);
            this.$store.commit('setNextArchiveMusic', nextArchiveMusic);
        });

        next();
    },
    beforeDestroy() {
        this.$store.commit('setDetailPage', false);
        this.$store.commit('clearNextArchiveMusic');
    },
}
</script>

<style lang='scss' scoped>
    @import '@/assets/scss/layout/page_detail.scss';
</style>