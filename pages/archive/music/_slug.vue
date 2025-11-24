<template>
    <div id='archive_music_detail' class='page_detail'>

        <div class='contents'>

            <section class='main'>
                <div class='mainvisual'>
                    <client-only>
                        <ParallaxImg 
                            :key='music.slug'
                            :src='music.images.thumb' 
                            :srcMobile='music.images.thumb_mb || music.images.thumb'
                        />
                    </client-only>
                </div>
                <div class='title' data-aos='fade-up'>
                    <p>{{ music.tags.work[$i18n.locale] }}</p>
                    <a
                        v-if='music.link'
                        class='mouse-hover1'
                        target='_blank'
                        :href='music.link.href'
                        @mouseenter='showCursorImage(true)'
                        @mouseleave='showCursorImage(false)'
                    >
                        <TextShifting :text='localizedTitle' />
                    </a>
                    <TextShifting v-else :text='localizedTitle' class='mouse-hover1' />
                </div>
                <div class='def'>
                    <div class='inner'>
                        <p>
                            <span data-aos='fade-up' v-if='music.tags.genre'>
                                #{{ music.tags.genre[$i18n.locale] }}
                            </span>
                            <span data-aos='fade-up' v-if='music.tags.genre2'>
                                #{{ music.tags.genre2[$i18n.locale] }}
                            </span>
                            <span data-aos='fade-up' v-if='music.tags.genre3'>
                                #{{ music.tags.genre3[$i18n.locale] }}
                            </span>
                        </p>
                         <ButtonRound
                            v-if='music.link'
                            data-aos='fade-up'
                            class='txt-c'
                            :link='{ ...music.link, text: music.link.text[$i18n.locale] }'
                        />
                    </div>
                </div>
            </section>

            <section class='player' v-if='music.player'>
                <div class='inner'>
                    <div v-for='(track, index) in music.player' :key='index' v-html='track' class='iframe mouse-none'></div>
                </div>
            </section>

            <section class='video' v-if='music.video'>
                <div class='inner'>
                    <video 
                        :src='music.video.url' 
                        controls 
                        controlsList='nodownload'
                        @contextmenu.prevent
                    ></video>
                </div>
            </section>

            <section class='setlist' v-if='music.setlist'>
                <div class='inner txt-c'>
                    <p v-for='set in music.setlist'>
                        <span>{{ set }}</span>
                    </p>
                </div>
            </section>

            <section class='about' v-if='music.content'>
                <div class='inner'>
                    <p v-html='music.content.about[$i18n.locale]'></p>
                </div>
            </section>

        </div>

    </div>
</template>

<script>
import archiveMusicData from '@/assets/data/archive_music.js';
import ButtonRound from '@/components/ButtonRound.vue';
import ParallaxImg from '@/components/ParallaxImg.vue';
import TextShifting from '@/components/TextShifting.vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default {
    components: {
        ButtonRound,
        ParallaxImg,
        TextShifting,
    },
    data() {
        return {
            music: null,
        }
    },
    computed: {
        localizedTitle() {
            return this.music?.title?.[this.$i18n.locale] || '';
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
        // 1. 스크롤을 맨 위로 이동 (가장 먼저)
        if (process.client) {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }
        
        // 2. 모든 ScrollTrigger 제거
        if (process.client && ScrollTrigger) {
            ScrollTrigger.getAll().forEach(st => st.kill());
        }
        
        // 3. 모든 ParallaxImg의 transform 초기화
        if (process.client) {
            const parallaxImgs = document.querySelectorAll('#parallax-img .img');
            parallaxImgs.forEach(img => {
                if (typeof gsap !== 'undefined') {
                    gsap.killTweensOf(img);
                    gsap.set(img, { clearProps: 'all' });
                }
            });
        }
        
        const music = archiveMusicData.find(p => p.slug === to.params.slug);
        const index = archiveMusicData.findIndex(p => p.slug === to.params.slug);
        const nextArchiveMusic = { ...archiveMusicData[(index + 1) % archiveMusicData.length], category: 'archive_music' };

        this.music = music;

        next();
        
        this.$nextTick(() => {
            this.$store.commit('setDetailPage', true);
            this.$store.commit('setNextArchiveMusic', nextArchiveMusic);
            
            setTimeout(() => {
                if (process.client) {
                    window.scrollTo({ top: 0, behavior: 'instant' });
                }
            }, 300);
            
            setTimeout(() => {
                if (process.client && ScrollTrigger) {
                    ScrollTrigger.refresh();
                }
            }, 1500);
        });
    },
    beforeDestroy() {
        this.$store.commit('setDetailPage', false);
        this.$store.commit('clearNextArchiveMusic');

        this.$store.commit('cursor/setCursorClass', '');
        this.$store.commit('cursor/setCursorText', '');
        this.$store.commit('cursor/setCursorImage', false);
        this.$store.commit('cursor/setCursorLottie', false);
        this.$store.commit('cursor/setCursorAnimation', null);
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