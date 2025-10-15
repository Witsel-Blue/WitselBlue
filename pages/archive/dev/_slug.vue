<template>
    <div id='archive_dev_detail' class='page_detail' v-if='dev'>

        <div class='contents'>

            <section class='main'>
                <div class='mainvisual'>
                    <ParallaxImg :src='dev.images.mainvisual' />
                </div>
                <div class='title' data-aos='fade-up'>
                    <p>{{ dev.tags.work[$i18n.locale] }}</p>
                    <a
                        v-if='dev.link'
                        class='mouse-hover1'
                        target='_blank'
                        :href='dev.link.href'
                        @mouseenter='showCursorImage(true)'
                        @mouseleave='showCursorImage(false)'
                    >
                        <TextShifting :text='localizedTitle' />
                    </a>
                    <TextShifting v-else :text='localizedTitle' class='mouse-hover1' />
                </div>
                <div class='def'>
                    <div class='inner'>
                        <p
                            v-if='dev.content.about'
                            data-aos='fade-up'
                            class='txt-c' 
                            v-html='dev.content.about[$i18n.locale]'
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

            <section class='codeviewer' v-if='dev.content.snippet'>
                <div class='inner'>
                    <pre>
                        <code ref='codeBlock'>
                            {{ dev.content.snippet }}
                        </code>
                    </pre>
                </div>
            </section>

            <section class='viewcode' v-if='dev.link'>
                <ButtonRound
                    v-if='dev.link'
                    data-aos='fade-up'
                    class='txt-c'
                    :link='{ ...dev.link, text: dev.link.text[$i18n.locale] }'
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
import ParallaxImg from '@/components/ParallaxImg.vue';
import ButtonRound from '@/components/ButtonRound.vue';
import TextShifting from '@/components/TextShifting.vue';

export default {
    components: {
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
    computed: {
        localizedTitle() {
            return this.dev?.title?.[this.$i18n.locale] || '';
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

        this.$store.commit('cursor/setCursorClass', '');
        this.$store.commit('cursor/setCursorText', '');
        this.$store.commit('cursor/setCursorImage', false);
        this.$store.commit('cursor/setCursorLottie', false);
        this.$store.commit('cursor/setCursorAnimation', null);
    },
    mounted() {
        window.addEventListener('resize', this.getMbHeight);
        
        // Highlight.js
        this.$nextTick(() => {
            if (this.$refs.codeBlock) {
                this.$hljs.highlightElement(this.$refs.codeBlock);
            }
        });
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