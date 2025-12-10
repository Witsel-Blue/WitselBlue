<template>
    <div id='project_detail' class='page_detail'>

        <div class='contents'>

            <section class='main'>
                <div class='mainvisual'>
                    <client-only>
                        <ParallaxImg 
                            :key='project.slug'
                            :src='project.images.mainvisual' 
                            :srcMobile='project.images.mainvisual_mb || project.images.mainvisual'
                        />
                    </client-only>
                </div>
                <div class='title'>
                    <p>{{ project.tags.work[$i18n.locale] }}</p>
                    <a
                        v-if='project.link'
                        class='mouse-hover1'
                        target='_blank'
                        :href='project.link.href'
                        @mouseenter='showCursorImage(true)'
                        @mouseleave='showCursorImage(false)'
                    >
                        <TextShifting :text='localizedTitle' />
                    </a>
                </div>
                <div class='desc' v-if='project.desc'>
                    <div class='inner'>
                         <ul>
                            <li v-if='project.desc.agency || project.desc.client'>
                                <dl>
                                    <dt>Team<span v-if='project.desc.client'> / Client</span></dt>
                                    <dd>
                                        {{ project.desc.agency[$i18n.locale] }}
                                        <span v-if='project.desc.client'> / {{ project.desc.client[$i18n.locale] }}</span>
                                    </dd>
                                </dl>
                            </li>
                            <li v-if='project.desc.duration'>
                                <dl>
                                    <dt>Work Period</dt>
                                    <dd>
                                        {{ project.desc.duration.start }}
                                        <span v-if='project.desc.duration.end'> - {{ project.desc.duration.end }}</span>
                                    </dd>
                                </dl>
                            </li>
                            <li v-if='project.desc.stack'>
                                <dl>
                                    <dt>Main Stack</dt>
                                    <dd>{{ project.desc.stack[$i18n.locale] }}</dd>
                                </dl>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <section class='about'>
                <div class='inner'>
                    <p
                        v-if='project.content.about'
                        class='txt-c' 
                        v-html='project.content.about[$i18n.locale]'
                    ></p>
                    <ButtonRound
                        v-if='project.link && project.link.href'
                        class='txt-c'
                        :link='{ ...project.link, text: project.link.text[$i18n.locale] }'
                    />
                </div>
            </section>

            <section class='img-gif bg' v-if='project.images.gif'>
                <div class='inner'>
                    <div class='device_pc'>
                        <img src='@/assets/img/device-laptop.png' class='device' loading='lazy' decoding='async'>
                        <div class='res-box-wrap'>
                            <div class='res-box'>
                                <img :src='project.images.gif' class='img' loading='lazy' decoding='async' />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class='img-pc' v-if='project.images.pc1'>
                <div class='inner'>
                    <img :src='project.images.pc1' loading='lazy' decoding='async'>
                    <img v-if='project.images.pc2' :src='project.images.pc2' loading='lazy' decoding='async'>
                    <img v-if='project.images.pc3' :src='project.images.pc3' loading='lazy' decoding='async'>
                </div>
            </section>

            <section class='img-mb bg' v-if='project.images.mb1'>
                <div class='inner'>
                    <ul class='device_mb'>
                        <li>
                            <img :src='project.images.mb1' class='img' loading='lazy' decoding='async'>
                        </li>
                        <li>
                            <img :src='project.images.mb2' class='img' loading='lazy' decoding='async'>
                        </li>
                        <li>
                            <img :src='project.images.mb3' class='img' loading='lazy' decoding='async'>
                        </li>
                    </ul>
                </div>
            </section>

            <section class='img-pc2' v-if='project.images.pc4'>
                <div class='inner'>
                    <img :src='project.images.pc4' loading='lazy' decoding='async'>
                    <img v-if='project.images.pc5' :src='project.images.pc5' loading='lazy' decoding='async'>
                    <img v-if='project.images.pc6' :src='project.images.pc6' loading='lazy' decoding='async'>
                </div>
            </section>

            <section class='detail' v-if='project.content.detail1' >
                <div class='inner'>
                    <h3 v-if='project.content.detail1'>
                        {{ project.content.detail1_title[$i18n.locale] }}
                    </h3>
                    <ul>
                        <li 
                            v-for='(item, index) in project.content.detail1[$i18n.locale]' :key='index'
                            v-html='item'
                        >
                        </li>
                    </ul>
                    <h3 v-if='project.content.detail2'>
                        {{ project.content.detail2_title[$i18n.locale] }}
                    </h3>
                    <ul>
                        <li 
                            v-for='(item, index) in project.content.detail2[$i18n.locale]' :key='index'
                            v-html='item'
                        >
                        </li>
                    </ul>
                    <h3 v-if='project.content.detail3'>
                        {{ project.content.detail3_title[$i18n.locale] }}
                    </h3>
                    <ul>
                        <li 
                            v-for='(item, index) in project.content.detail3[$i18n.locale]' :key='index'
                            v-html='item'
                        >
                        </li>
                    </ul>
                </div>
            </section>
            
        </div>
    </div>
</template>

<script>
import projectsData from '@/assets/data/projects.js';
import PageTransition from '@/layouts/PageTransition.vue';
import ParallaxImg from '@/components/ParallaxImg.vue';
import ButtonRound from '@/components/ButtonRound.vue';
import TextShifting from '@/components/TextShifting.vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
    
export default {
    components: {
        PageTransition,
        ParallaxImg,
        ButtonRound,
        TextShifting,
    },
    data() {
        return {
            project: null,
            cursorText: '',
        }
    },
    computed: {
        localizedTitle() {
            return this.project?.title?.[this.$i18n.locale] || '';
        }
    },
    async asyncData({ params, store }) {
        const project = projectsData.find(p => p.slug === params.slug);
        return { project };
    },
    beforeRouteEnter(to, from, next) {
        const project = projectsData.find(p => p.slug === to.params.slug);
        const index = projectsData.findIndex(p => p.slug === to.params.slug);

        next(vm => {
            // 다른 카테고리 데이터 클리어
            vm.$store.commit('clearArchiveDev');
            vm.$store.commit('clearArchiveMusic');
            
            vm.project = project;
            vm.$nextTick(() => {
                vm.$store.commit('setDetailPage', true);
                vm.$store.commit('setAllProjects', projectsData);
                vm.$store.commit('setCurrentProjectIndex', index);
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
        
        const project = projectsData.find(p => p.slug === to.params.slug);
        const index = projectsData.findIndex(p => p.slug === to.params.slug);

        this.project = project;
        next();
        
        this.$nextTick(() => {
            // 다른 카테고리 데이터 클리어
            this.$store.commit('clearArchiveDev');
            this.$store.commit('clearArchiveMusic');
            
            this.$store.commit('setDetailPage', true);
            this.$store.commit('setAllProjects', projectsData);
            this.$store.commit('setCurrentProjectIndex', index);
            
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
        this.$store.commit('clearNextProject');
        
        this.$store.commit('cursor/setCursorClass', '');
        this.$store.commit('cursor/setCursorText', '');
        this.$store.commit('cursor/setCursorImage', false);
        this.$store.commit('cursor/setCursorLottie', false);
        this.$store.commit('cursor/setCursorAnimation', null);
    },
    mounted() {
        setTimeout(() => {
            this.getMbHeight();
        }, 1000);
        window.addEventListener('resize', this.getMbHeight);
    },
    methods: {
        showCursorImage(show) {
            window.dispatchEvent(new CustomEvent('cursor-show-image', { detail: { show } }));
        },
        getMbHeight() {
            var mb = document.querySelector('.device_mb .device');
            if (!mb) return;
            var mbH = mb.clientHeight;
            var mbImg = document.querySelectorAll('.device_mb .img');
                
            mbImg.forEach(img => {
                img.style.height = mbH + 'px';
            });
        },
    }
}
</script>

<style lang='scss' scoped>
    @import '@/assets/scss/layout/page_detail.scss';
</style>