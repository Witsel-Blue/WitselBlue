<template>
    <div id="home">
        <CursorCustom 
            :extra-class="cursorClass" 
            :showLottie="showLottie" 
            :animationData="animationData"
        />
        <section id="main" ref="main" @mouseenter="onMouseEnterMain" @mouseleave="onMouseLeaveMain">
            <Mainvisual />
            <div class="inner">
                <p class="subtext">
                    frontend developer
                </p>
                <TextScroll :text="'WitselBlue'" />
            </div>
        </section>
        <div @mouseleave="onMouseLeaveMain">
            <section class="profile" ref="profile">
                <div class="inner">
                    <div data-aos="fade-up">
                        <ParallaxImg :src="profile.img" />
                    </div>
                    <TextStagger :paragraphs="[
                        '안녕하세요,<br class=&quot;mb&quot;> <span class=&quot;mouse-hover1&quot;>서울</span>에서 활동 중인 개발자<br class=&quot;mb&quot;> <span class=&quot;mouse-hover1&quot;>비첼블루</span>입니다.<br><br class=&quot;mb&quot;>',
                        'WebGl, GSAP, Lottie, SVG 등을 활용해',
                        '직관적이고 <span class=&quot;mouse-hover1&quot;>인터렉티브</span>한<br class=&quot;mb&quot;> 사이트를 구현하고자 하고,',
                        '효율적이고 확장성을 고려한<br class=&quot;mb&quot;> <span class=&quot;mouse-hover1&quot;>클린코딩</span>을 지향합니다.<br class=&quot;mb&quot;>',
                        '웹사이트를 방문하는 사용자가<br class=&quot;mb&quot;> 단순히 정보를 얻는 것을 넘어',
                        '새로운 경험을 할 수 있도록 돕는<br class=&quot;mb&quot;> <span class=&quot;mouse-hover1&quot;>프론트엔드 개발자</span>가 되고 싶습니다.'
                    ]"/>
                </div>
            </section>
            <section class="selected" ref="selected">
                <div class="inner">
                    <h1 class="subtitle ft-bagel txt-c" ref="fixedTitle">
                        Selected Works
                    </h1>
                </div>
                <ul class="container" ref="comp">
                    <li class="panel"></li>
                    <li
                        class="panel"
                        v-for="list in selected"
                        :key="list.name">
                        <div class="wrap">
                            <SkewCardX :img="list.img" :path="list.path" />
                            <div class="desc">
                                <p class="work">{{ list.work }}</p>
                                <Nuxt-link 
                                    class="title mouse-hover1"
                                    :to=list.path>
                                    <TextShifting :text="list.name"></TextShifting>
                                </Nuxt-link>
                            </div>
                        </div>
                    </li>
                </ul>
            </section>
            <section class="about" ref="about">
                <div class="inner">
                    <h1 class="subtitle ft-bagel txt-c">
                        About
                    </h1>
                    <ul class="txt-c" data-aos="fade-up">
                        <li>
                            <h4>Skills & Strengths</h4>
                            <ul class="dot">
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
                            <ul class="dot">
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
                            <ul class="dot">
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
            <section class="skills" ref="skills">
                <div class="inner">
                    <h1 class="subtitle ft-bagel txt-c">
                        Skills
                    </h1>
                    <div class="wrap">
                        <div>
                            <ul class="mt-32">
                                <li v-for="list in language" :key="list.name" :data-name="list.name">
                                    <img :src="list.img">
                                </li>
                            </ul>
                        </div>
                        <div>
                            <ul class="mt-32">
                                <li v-for="list in framework" :key="list.name" :data-name="list.name">
                                    <img :src="list.img">
                                </li>
                            </ul>
                        </div>
                        <div>
                            <ul class="mt-32">
                                <li v-for="list in etc" :key="list.name" :data-name="list.name">
                                    <img :src="list.img">
                                </li>
                            </ul>
                        </div>
                        <div>
                            <ul class="mt-32">
                                <li v-for="list in design" :key="list.name" :data-name="list.name">
                                    <img :src="list.img">
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import CursorCustom from '@/components/CursorCustom.vue';
import Mainvisual from '@/layouts/Mainvisual.vue';
import ButtonScrollDown from '@/components/ButtonScrollDown.vue';
import TextScroll from '@/components/TextScroll.vue';
import ParallaxImg from '@/components/ParallaxImg.vue';
import Butterfly from '@/assets/lottie/butterfly.json';
import SkewCardX from '@/components/SkewCardX.vue';
import TextShifting from '@/components/TextShifting.vue';
import TextStagger from '@/components/TextStagger.vue';

if (process.client) {
    gsap.registerPlugin(ScrollTrigger);
}

export default {
    name: 'Home',
    components: {
        CursorCustom,
        Mainvisual,
        ButtonScrollDown,
        TextScroll,
        ParallaxImg,
        SkewCardX,
        TextShifting,
        TextStagger,
    },
    data() {
        return {
            cursorClass: 'cursor-main',
            showLottie: true,
            animationData: Butterfly,
            profile : {
                img: require('@/assets/img/profile.jpg'),
            },
            selected: [
                {
                    name: 'Monimo',
                    path: '/projects/monimo',
                    link: 'https://www.monimo.com/w/main/WPFMHP0101M0',
                    img: require('@/assets/img/project01_main.png'),
                    work: 'development',
                    duration: '2024.07-2024.10',
                },
                {
                    name: '4·16 Online Memorial',
                    path: '/projects/OnlineMemorial',
                    link: 'https://416foundation.org/%EC%98%A8%EB%9D%BC%EC%9D%B8-%EA%B8%B0%EC%96%B5-%EA%B3%B5%EA%B0%84/',
                    img: require('@/assets/img/project02_main.png'),
                    work: 'publishing',
                    duration: '2022.04',
                },
                {
                    name: 'DCAMP',
                    path: '/projects/DCAMP',
                    link: 'https://dcamp.kr/',
                    img: require('@/assets/img/project03_main.png'),
                    work: 'frontend',
                    duration: '2022.01-2022.03',
                },
            ],
            language: [
                {
                    name: 'html',
                    img: require('@/assets/img/skills-language1.png'),
                },
                {
                    name: 'css',
                    img: require('@/assets/img/skills-language2.png'),
                },
                {
                    name: 'javascript',
                    img: require('@/assets/img/skills-language4.png'),
                },
                {
                    name: 'scss',
                    img: require('@/assets/img/skills-language3.png'),
                },
                {
                    name: 'jquery',
                    img: require('@/assets/img/skills-language5.png'),
                },
            ],
            framework: [
                {
                    name: 'vue.js',
                    img: require('@/assets/img/skills-framework1.png'),
                },
                {
                    name: 'nuxt.js',
                    img: require('@/assets/img/skills-framework2.png'),
                },
                {
                    name: 'react',
                    img: require('@/assets/img/skills-framework9.png'),
                },
                {
                    name: 'next.js',
                    img: require('@/assets/img/skills-framework10.png'),
                },
                {
                    name: 'GSAP',
                    img: require('@/assets/img/skills-framework3.png'),
                },
                {
                    name: 'p5.js',
                    img: require('@/assets/img/skills-framework4.png'),
                },
                {
                    name: 'three.js',
                    img: require('@/assets/img/skills-framework5.png'),
                },
                {
                    name: 'pixi.js',
                    img: require('@/assets/img/skills-framework12.png'),
                },
                {
                    name: 'drupal',
                    img: require('@/assets/img/skills-framework6.png'),
                },
                {
                    name: 'wordpress',
                    img: require('@/assets/img/skills-framework7.png'),
                },
                {
                    name: 'tailwind',
                    img: require('@/assets/img/skills-framework8.png'),
                },
                {
                    name: 'python',
                    img: require('@/assets/img/skills-framework11.png'),
                },
            ],
            etc: [
                {
                    name: 'GitHub',
                    img: require('@/assets/img/skills-etc1.png'),
                },
                {
                    name: 'docker',
                    img: require('@/assets/img/skills-etc2.png'),
                },
                {
                    name: 'storybook',
                    img: require('@/assets/img/skills-etc3.png'),
                },
                {
                    name: 'gabia',
                    img: require('@/assets/img/skills-etc4.png'),
                },
                {
                    name: 'cyberduck',
                    img: require('@/assets/img/skills-etc5.png'),
                },
            ],
            design: [
                {
                    name: 'figma',
                    img: require('@/assets/img/skills-design1.png'),
                },
                {
                    name: 'photoshop',
                    img: require('@/assets/img/skills-design2.png'),
                },
                {
                    name: 'illlustrator',
                    img: require('@/assets/img/skills-design3.png'),
                },
            ],
            link: {
                href: '/project',
                text: 'project',
            },
            link2: {
                href: '/archive',
                text: 'archive',
            },
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
        });
        this.scrollVertical();
        this.titleScroll();
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
        scrollVertical() {
            var winW = window.innerWidth;

            if (winW > 425) {
                const gsap = this.$gsap;
                const ScrollTrigger = this.$ScrollTrigger;
                    
                let horizontalSections = gsap.utils.toArray(".selected .container");

                horizontalSections.forEach((container) => {
                    let sections = container.querySelectorAll(".selected .panel");

                    gsap.to(sections, {
                        xPercent: -100 * (sections.length - 1),
                        ease: "none",
                        scrollTrigger: {
                            trigger: container,
                            pin: true,
                            scrub: 1.4,
                            end: () => "+=" + container.offsetWidth * (sections.length - 1) * 1.4,
                        }
                    });
                })
            }
        },
        titleScroll() {
            const title = this.$refs.fixedTitle;
            const winH = window.innerHeight;
            const titleTop = title.offsetTop - winH*10/100;
            const content = document.querySelector('.selected');
            const contTop = content.offsetTop;
            const contEnd = contTop + content.offsetHeight;

            window.addEventListener('scroll', function() {
                const scrolled = window.scrollY;
                if ( titleTop < scrolled && scrolled < contEnd - winH ) {
                    title.classList.add('active');
                } else {
                    title.classList.remove('active');
                }
            });
        },
    }
}
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/layout/home.scss';
</style>