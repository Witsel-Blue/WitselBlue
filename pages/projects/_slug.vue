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
                <div class='title' data-aos='fade-up'>
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
                                <dl data-aos='fade-up'>
                                    <dt>Team<span v-if='project.desc.client'> / Client</span></dt>
                                    <dd>
                                        {{ project.desc.agency[$i18n.locale] }}
                                        <span v-if='project.desc.client'> / {{ project.desc.client[$i18n.locale] }}</span>
                                    </dd>
                                </dl>
                            </li>
                            <li v-if='project.desc.duration'>
                                <dl data-aos='fade-up'>
                                    <dt>Work Period</dt>
                                    <dd>
                                        {{ project.desc.duration.start }}
                                        <span v-if='project.desc.duration.end'> - {{ project.desc.duration.end }}</span>
                                    </dd>
                                </dl>
                            </li>
                            <li v-if='project.desc.stack'>
                                <dl data-aos='fade-up'>
                                    <dt>Main Stack</dt>
                                    <dd>{{ project.desc.stack[$i18n.locale] }}</dd>
                                </dl>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <section class='img-gif bg' data-aos='fade-up' v-if='project.images.gif'>
                <div class='inner'>
                    <div class='device_pc' data-aos='fade-up'>
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
                    <img :src='project.images.pc1' data-aos='fade-up' loading='lazy' decoding='async'>
                    <img v-if='project.images.pc2' :src='project.images.pc2' data-aos='fade-up' loading='lazy' decoding='async'>
                    <img v-if='project.images.pc3' :src='project.images.pc3' data-aos='fade-up' loading='lazy' decoding='async'>
                </div>
            </section>

            <section class='img-mb bg' data-aos='fade-up' v-if='project.images.mb1'>
                <div class='inner'>
                    <ul class='device_mb'>
                        <li data-aos='fade-up'>
                            <img :src='project.images.mb1' class='img' loading='lazy' decoding='async'>
                        </li>
                        <li data-aos='fade-up'>
                            <img :src='project.images.mb2' class='img' loading='lazy' decoding='async'>
                        </li>
                        <li data-aos='fade-up'>
                            <img :src='project.images.mb3' class='img' loading='lazy' decoding='async'>
                        </li>
                    </ul>
                </div>
            </section>

            <section class='about'>
                <div class='inner'>
                    <p
                        v-if='project.content.about'
                        data-aos='fade-up'
                        class='txt-c' 
                        v-html='project.content.about[$i18n.locale]'
                    ></p>
                    <ButtonRound
                        v-if='project.link && project.link.href'
                        data-aos='fade-up'
                        class='txt-c'
                        :link='{ ...project.link, text: project.link.text[$i18n.locale] }'
                    />
                </div>
            </section>

            <section class='detail' v-if='project.content.detail' >
                <div class='inner'>
                    <p 
                        v-for='(item, index) in project.content.detail' :key='index'
                        v-html='item'
                        data-aos='fade-up'
                    >
                    </p>
                </div>
            </section>

            <section class='img-pc2' v-if='project.images.pc4'>
                <div class='inner'>
                    <img :src='project.images.pc4' data-aos='fade-up' loading='lazy' decoding='async'>
                    <img v-if='project.images.pc5' :src='project.images.pc5' data-aos='fade-up' loading='lazy' decoding='async'>
                    <img v-if='project.images.pc6' :src='project.images.pc6' data-aos='fade-up' loading='lazy' decoding='async'>
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
        const nextProject = { ...projectsData[(index + 1) % projectsData.length], category: 'projects' };
        const prevProject = { ...projectsData[(index - 1 + projectsData.length) % projectsData.length], category: 'projects' };
        const prevPrevProject = { ...projectsData[(index - 2 + projectsData.length) % projectsData.length], category: 'projects' };
        const nextNextProject = { ...projectsData[(index + 2) % projectsData.length], category: 'projects' };
        const nextNextNextProject = { ...projectsData[(index + 3) % projectsData.length], category: 'projects' };

        next(vm => {
            vm.project = project;
            vm.$nextTick(() => {
                vm.$store.commit('setDetailPage', true);
                vm.$store.commit('setNextProject', nextProject);
                vm.$store.commit('setPrevProject', prevProject);
                vm.$store.commit('setPrevPrevProject', prevPrevProject);
                vm.$store.commit('setNextNextProject', nextNextProject);
                vm.$store.commit('setNextNextNextProject', nextNextNextProject);
            });
        });
    },
    beforeRouteUpdate(to, from, next) {
        console.log('[_slug] beforeRouteUpdate - start');
        
        // 1. 스크롤을 맨 위로 이동 (가장 먼저)
        if (process.client) {
            window.scrollTo({ top: 0, behavior: 'instant' });
            console.log('[_slug] Scroll set to 0');
        }
        
        // 2. 모든 ScrollTrigger 제거
        if (process.client && ScrollTrigger) {
            ScrollTrigger.getAll().forEach(st => st.kill());
            console.log('[_slug] All ScrollTriggers killed');
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
            console.log('[_slug] ParallaxImg transforms cleared');
        }
        
        const project = projectsData.find(p => p.slug === to.params.slug);
        const index = projectsData.findIndex(p => p.slug === to.params.slug);
        const nextProject = { ...projectsData[(index + 1) % projectsData.length], category: 'projects' };
        const prevProject = { ...projectsData[(index - 1 + projectsData.length) % projectsData.length], category: 'projects' };
        const prevPrevProject = { ...projectsData[(index - 2 + projectsData.length) % projectsData.length], category: 'projects' };
        const nextNextProject = { ...projectsData[(index + 2) % projectsData.length], category: 'projects' };
        const nextNextNextProject = { ...projectsData[(index + 3) % projectsData.length], category: 'projects' };

        this.project = project;

        // next()를 먼저 호출하여 라우트 변경 완료
        next();
        
        // 라우트 변경 후 DOM 업데이트 대기
        this.$nextTick(() => {
            this.$store.commit('setDetailPage', true);
            this.$store.commit('setNextProject', nextProject);
            this.$store.commit('setPrevProject', prevProject);
            this.$store.commit('setPrevPrevProject', prevPrevProject);
            this.$store.commit('setNextNextProject', nextNextProject);
            this.$store.commit('setNextNextNextProject', nextNextNextProject);
            
            // 스크롤이 0인지 재확인
            setTimeout(() => {
                if (process.client) {
                    window.scrollTo({ top: 0, behavior: 'instant' });
                    console.log('[_slug] Scroll confirmed at 0, current scrollY:', window.scrollY);
                }
            }, 300);
            
            // ScrollTrigger refresh - ParallaxImg가 생성된 후
            setTimeout(() => {
                if (process.client && ScrollTrigger) {
                    console.log('[_slug] beforeRouteUpdate - refreshing all ScrollTriggers');
                    ScrollTrigger.refresh();
                    console.log('[_slug] Current ScrollTriggers count:', ScrollTrigger.getAll().length);
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