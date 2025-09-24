<template>
    <div id='archive_music_detail' class='page_detail'>

        <div class='contents'>

            <section class='main'>
                <div class='mainvisual' data-aos='fade-up'>
                    <ParallaxImg :src='music.images.thumb' />
                </div>
                <div class='title' data-aos='fade-up'>
                    <p>{{ music.tags.work }}</p>
                    <a
                        v-if='music.link'
                        class='mouse-hover1'
                        target='_blank'
                        :href='music.link.href'
                        @mouseenter='showCursorImage(true)'
                        @mouseleave='showCursorImage(false)'
                    >
                        <TextShifting :text='music.title' />
                    </a>
                    <TextShifting v-else :text='music.title' class='mouse-hover1' />
                </div>
                <div class='def'>
                    <div class='inner'>
                        <p>
                            <span data-aos='fade-up' v-if='music.tags.genre'>
                                #{{ music.tags.genre }}
                            </span>
                            <span data-aos='fade-up' v-if='music.tags.genre2'>
                                #{{ music.tags.genre2 }}
                            </span>
                            <span data-aos='fade-up' v-if='music.tags.genre3'>
                                #{{ music.tags.genre3 }}
                            </span>
                        </p>
                         <ButtonRound
                            v-if='music.link'
                            data-aos='fade-up'
                            class='txt-c'
                            :link='music.link'
                        />
                    </div>
                </div>
            </section>

            <section class='player' v-if='music.player'>
                <div class='inner'>
                    <div v-for='(track, index) in music.player' :key='index' v-html='track' class='iframe mouse-none'></div>
                </div>
            </section>

            <section class='setlist' v-if='music.setlist'>
                <div class='inner txt-c'>
                    <p v-for='set in music.setlist'>
                        <span>{{ set }}</span>
                    </p>
                </div>
            </section>
        </div>

    </div>
</template>

<script>
import archiveMusicData from '@/assets/data/archive_music.js';
import ButtonRound from '@/components/ButtonRound.vue';

export default {
    components: {
        ButtonRound,
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
        const nextArchiveMusic = { ...archiveMusicData[(index + 1) % archiveMusicData.length], category: 'archive_music' };

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
        const nextArchiveMusic = { ...archiveMusicData[(index + 1) % archiveMusicData.length], category: 'archive_music' };

        this.music = music;

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
    methods: {
        showCursorImage(show) {
            window.dispatchEvent(new CustomEvent('cursor-show-image', { detail: { show } }));
        },
    }
}
</script>

<style lang='scss' scoped>
    @import '@/assets/scss/layout/page_detail.scss';
</style>