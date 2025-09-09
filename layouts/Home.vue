<template>
    <div id='home'>
        <CursorCustom 
            :extra-class='cursorClass' 
            :showLottie='showLottie' 
            :animationData='animationData'
        />
        <section id='main' ref='main' @mouseenter='onMouseEnterMain' @mouseleave='onMouseLeaveMain'>
            <Mainvisual />
            <div class='inner'>
                <p class='subtext'>
                    frontend developer
                </p>
                <TextScroll :text="'WitselBlue'" />
            </div>
        </section>
        <div @mouseleave='onMouseLeaveMain'>
            <section class='profile' ref='profile'>
                <div class='inner'>
                    <div data-aos='fade-up'>
                        <ParallaxImg :src='profile.img' />
                    </div>
                    <div class='text'>
                        <TextStagger 
                            :paragraphs="[
                                'Hi,<br class=&quot;mb&quot;> this is <span class=&quot;mouse-hover1&quot;>WitselBlue</span> from Seoul.',
                                'I try to make <span class=&quot;mouse-hover1&quot;>interactive</span> websites',
                                'and <span class=&quot;mouse-hover1&quot;>scalable</span> clean codes.',
                                'My aim is to be <br class=&quot;mb&quot;>a <span class=&quot;mouse-hover1&quot;>frontend developer</span>',
                                'who can <span class=&quot;mouse-hover1&quot;>create</span> new experiences',
                                'beyond just obtaining information.'
                            ]"
                            triggerMode='middle'
                            speedMode='slow'
                        />
                        <div class='arrow' data-aos='fade-up'>
                            <span>hover texts!</span>
                            <Lottie :animationData='Arrow' />
                        </div>
                    </div>
                    <ul class='profile-hover-img'>
                        <li v-for='(img, idx) in profileHoverImgs'
                            :key='idx'
                            :class='{ active: activeHoverImgs[idx] }'
                            :style='{ top: img.y, left: img.x }'>
                            <img :src='img.src' alt='preview' />
                        </li>
                    </ul>
                </div>
                <TextMarquee text='witselblue' />
            </section>
            <section class='selected' ref='selected' id='selected'>
                <ul class='container' ref='comp'>
                    <li
                        class='panel'
                        v-for='list in selected'
                        :key='list.name'>
                        <div class='wrap'>
                            <SkewCardX :img='list.img' :path='list.path' />
                            <div class='desc'>
                                <p class='work'>{{ list.work }}</p>
                                <Nuxt-link 
                                    class='title mouse-hover1'
                                    :to=list.path>
                                    <TextShifting :text='list.name'></TextShifting>
                                </Nuxt-link>
                            </div>
                        </div>
                    </li>
                </ul>
            </section>
            <section class='skills' ref='skills'>
                <div class='inner'>
                    <h1 class='subtitle ft-bagel txt-c'>
                        Skills
                    </h1>
                    <RandomSkillCard />
                </div>
            </section>
            <section class='about' ref='about'>
                <div class='inner'>
                    <h1 class='subtitle ft-bagel txt-c'>
                        About
                    </h1>
                    <ul class='txt-c' data-aos='fade-up'>
                        <li>
                            <h4>Skills & Strengths</h4>
                            <ul class='dot'>
                                <li>
                                    Vue, React, Drupal, pure HTML
                                </li>
                                <li>
                                    모션·애니메이션 기반 인터렉션 구현
                                </li>
                                <li>
                                    반응형 & 웹접근성 고려        
                                </li>
                            </ul>
                        </li>
                        <li>
                            <h4>Values</h4>
                            <ul class='dot'>
                                <li>
                                    확장성과 유지보수성을 고려한 코드
                                </li>
                                <li>
                                    기획, 디자인, 백엔드 기초 지식 보유
                                </li>
                                <li>
                                    1인 개발 경험, 여러 팀과 협력 경험 모두 보유
                                </li>
                            </ul>
                        </li>
                        <li>
                            <h4>Beyond Code</h4>
                            <ul class='dot'>
                                <li>
                                    키아누 리브스를 좋아합니다
                                </li>
                                <li>
                                    테크노 음악을 좋아합니다 (SebastiAn을 꼭 들어주세요)
                                </li>
                                <li>
                                    진과 싱글몰트 위스키를 좋아합니다
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import CursorCustom from '@/components/CursorCustom.vue';
import Lottie from '@/components/Lottie.vue';
import Butterfly from '@/assets/lottie/butterfly.json';
import Arrow from '@/assets/lottie/arrow.json';
import Mainvisual from '@/layouts/Mainvisual.vue';
import TextScroll from '@/components/TextScroll.vue';
import ParallaxImg from '@/components/ParallaxImg.vue';
import SkewCardX from '@/components/SkewCardX.vue';
import TextShifting from '@/components/TextShifting.vue';
import TextMarquee from '@/components/TextMarquee.vue';
import TextStagger from '@/components/TextStagger.vue';
import RandomSkillCard from '@/components/RandomSkillCard.vue';

if (process.client) {
    gsap.registerPlugin(ScrollTrigger);
}

export default {
    name: 'Home',
    components: {
        CursorCustom,
        Lottie,
        Mainvisual,
        TextScroll,
        ParallaxImg,
        SkewCardX,
        TextShifting,
        TextMarquee,
        TextStagger,
        RandomSkillCard,
    },
    data() {
        return {
            cursorClass: 'cursor-main',
            showLottie: true,
            animationData: Butterfly,
            Arrow,
            profile : {
                img: require('@/assets/img/profile.png'),
            },
            activeHoverImgs: [false, false, false, false, false],
            profileHoverImgs: [
                { src: require('@/assets/img/profile_img4.png'), x: '82%', y: '54%' },
                { src: require('@/assets/img/profile_img2.png'), x: '23%', y: '42%' },
                { src: require('@/assets/img/profile_img1.png'), x: '82%', y: '34%' },
                { src: require('@/assets/img/profile_img5.png'), x: '24%', y: '64%' },
                { src: require('@/assets/img/profile_img3.png'), x: '80%', y: '46%' },
            ],
            selected: [
                {
                    name: 'Monimo',
                    path: '/projects/monimo',
                    link: 'https://www.monimo.com/w/main/WPFMHP0101M0',
                    img: require('@/assets/img/projects/monimo_thumb.png'),
                    work: 'development',
                    duration: '2024.07-2024.10',
                },
                {
                    name: '4·16 Online Memorial',
                    path: '/projects/OnlineMemorial',
                    link: 'https://416foundation.org/%EC%98%A8%EB%9D%BC%EC%9D%B8-%EA%B8%B0%EC%96%B5-%EA%B3%B5%EA%B0%84/',
                    img: require('@/assets/img/projects/416_thumb.png'),
                    work: 'publishing',
                    duration: '2022.04',
                },
                {
                    name: 'DCAMP',
                    path: '/projects/DCAMP',
                    link: 'https://dcamp.kr/',
                    img: require('@/assets/img/projects/dcamp_thumb.png'),
                    work: 'frontend',
                    duration: '2022.01-2022.03',
                },
            ],
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
        });
        this.initSectionScroll();
        this.scrollVertical();
        this.initProfileImgHover();
    },
    methods: {
        onMouseEnterMain() {
            this.cursorClass = 'cursor-main';
            this.showLottie = true;
        },
        onMouseLeaveMain() {
            this.cursorClass = '';
            this.showLottie = false;
        },
        initSectionScroll() {
            const sections = [
                this.$refs.main,
                this.$refs.profile,
                this.$refs.selected,
                this.$refs.skills,
                this.$refs.about
            ];

            let isScrolling = false;

            window.addEventListener('wheel', (e) => {
                if (isScrolling) return;
                const deltaY = e.deltaY;
                const scrollY = window.scrollY;

                let currentIndex = sections.findIndex((sec) => {
                    const top = sec.offsetTop;
                    const bottom = top + sec.offsetHeight;
                    return scrollY >= top && scrollY < bottom;
                });

                if (currentIndex === -1) return;

                const currentSection = sections[currentIndex];

                // selected 구간 처리
                if (currentSection === this.$refs.selected) {
                    const st = ScrollTrigger.getById('selected');
                    if (!st) return;

                    if (deltaY > 0 && st.progress >= 0.95) {
                        e.preventDefault();
                        isScrolling = true;
                        const targetY = window.scrollY + this.$refs.skills.getBoundingClientRect().top;
                        this.smoothScrollTo(targetY, 1200, () => {
                            isScrolling = false;
                        });
                    }
                    else if (deltaY < 0 && st.progress <= 0.05) {
                        e.preventDefault();
                        isScrolling = true;
                        const targetY = window.scrollY + this.$refs.profile.getBoundingClientRect().top;
                        this.smoothScrollTo(targetY, 1200, () => {
                            isScrolling = false;
                        });
                    }
                    return;
                }

                // 일반 섹션 vertical scroll
                let targetIndex = currentIndex;
                if (deltaY > 0 && currentIndex < sections.length - 1) targetIndex++;
                else if (deltaY < 0 && currentIndex > 0) targetIndex--;
                else return;

                const targetY = sections[targetIndex].offsetTop;
                e.preventDefault();
                isScrolling = true;
                this.smoothScrollTo(targetY, 1200, () => {
                    isScrolling = false;
                });
            }, { passive: false });
        },
        smoothScrollTo(targetY, duration = 800, callback) {
            const startY = window.scrollY;
            const distance = targetY - startY;
            let startTime = null;

            const animate = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const ease = 0.5 - Math.cos(progress * Math.PI) / 2;

                window.scrollTo(0, startY + distance * ease);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else if (callback) {
                    callback();
                }
            };

            requestAnimationFrame(animate);
        },
        scrollVertical() {
            if (window.innerWidth <= 425) return;

            let horizontalSections = gsap.utils.toArray('.selected .container');

            horizontalSections.forEach((container) => {
                let panels = container.querySelectorAll('.selected .panel');

                gsap.to(panels, {
                    xPercent: -100 * (panels.length - 1),
                    ease: 'none',
                    scrollTrigger: {
                        trigger: container,
                        pin: true,
                        scrub: 1.4,
                        end: () => '+=' + container.offsetWidth * (panels.length - 1) * 1.4,
                        id: 'selected',
                    }
                });
            });
        },
        initProfileImgHover() {
            const spans = this.$el.querySelectorAll('.profile .mouse-hover1');
            spans.forEach((span, index) => {
                span.addEventListener('mouseenter', () => {
                    this.$set(this.activeHoverImgs, index, true);
                });
                span.addEventListener('mouseleave', () => {
                    this.$set(this.activeHoverImgs, index, false);
                });
            });
        }
    }
}
</script>

<style lang='scss' scoped>
    @import '@/assets/scss/layout/home.scss';
</style>