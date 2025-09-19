<template>
    <div id='archive_detail' class='page_detail' v-if='dev'>

        <CursorCustom />

        <div class='contents'>

            <section class='main'>
                <div class='mainvisual' data-aos='fade-up'>
                    <ParallaxImg :src='dev.images.mainvisual' />
                </div>
                <div class='title' data-aos='fade-up'>
                    <p>{{ dev.tags.work }}</p>
                    <a
                        v-if='dev.link'
                        class='mouse-hover1'
                        target='_blank'
                        :href='dev.link.href'
                        @mouseenter='showCursorImage(true)'
                        @mouseleave='showCursorImage(false)'
                    >
                        <TextShifting :text='dev.title' />
                    </a>
                    <TextShifting v-else :text='dev.title' class='mouse-hover1' />
                </div>
                <div class='def'>
                    <div class='inner'>
                        <p
                            v-if='dev.content.about'
                            data-aos='fade-up'
                            class='txt-c' 
                            v-html='dev.content.about'
                        ></p>
                    </div>
                </div>
            </section>

            <section class='showcase'>
                <div class='inner'>
                    <iframe class='iframe mouse-none'
                        v-if='dev.slug'
                        :src='`/showcase/dev/${dev.slug}/index.html`'
                        frameborder='0'
                        width='100%'
                        height='80vh'
                    ></iframe>
                </div>
            </section>

            <section class='viewcode'>
                <ButtonRound
                    v-if='dev.link'
                    data-aos='fade-up'
                    class='txt-c'
                    :link='dev.link'
                />
            </section>

        </div>
    </div>

    <div v-else>
        <p class='txt-c'>해당 아카이브를 찾을 수 없습니다.</p>
    </div>
</template>

<script>
import archiveDevData from '@/assets/data/archive_dev.js';
import CursorCustom from '@/components/CursorCustom.vue';
import ParallaxImg from '@/components/ParallaxImg.vue';
import ButtonRound from '@/components/ButtonRound.vue';
import TextShifting from '@/components/TextShifting.vue';

export default {
    components: {
        CursorCustom,
        ParallaxImg,
        ButtonRound,
        TextShifting,
    },
    data() {
        return {
            dev: null,
            cursorText: '',
        }
    },
    async asyncData({ params, store }) {
        const dev = archiveDevData.find(item => item.slug === params.slug);
        return { dev: dev };
    },
    beforeRouteEnter(to, from, next) {
        const dev = archiveDevData.find(p => p.slug === to.params.slug);
        const index = archiveDevData.findIndex(p => p.slug === to.params.slug);
        const nextArchiveDev = { ...archiveDevData[(index + 1) % archiveDevData.length], category: 'archive_dev' };

        next(vm => {
            vm.dev = dev;

            // 상태를 nextTick으로 적용
            vm.$nextTick(() => {
            vm.$store.commit('setDetailPage', true);
            vm.$store.commit('setNextArchiveDev', nextArchiveDev);
            });
        });
    },
    beforeRouteUpdate(to, from, next) {
        const dev = archiveDevData.find(p => p.slug === to.params.slug);
        const index = archiveDevData.findIndex(p => p.slug === to.params.slug);
        const nextArchiveDev = { ...archiveDevData[(index + 1) % archiveDevData.length], category: 'archive_dev' };

        this.dev = dev;

        this.$nextTick(() => {
            this.$store.commit('setDetailPage', true);
            this.$store.commit('setNextArchiveDev', nextArchiveDev);
        });

        next();
    },
    beforeDestroy() {
        this.$store.commit('setDetailPage', false);
        this.$store.commit('clearNextArchiveDev');
    },
    mounted() {
        window.addEventListener('resize', this.getMbHeight);
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