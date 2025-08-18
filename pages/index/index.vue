<template>
    <div id="home">
        <CursorCustom 
            :extra-class="cursorClass" 
            :showLottie="showLottie" 
            :animationData="animationData"
        />
        <div @mouseenter="onMouseEnterMain" @mouseleave="onMouseLeaveMain">
            <section id="main">
                <Mainvisual />
                <div class="inner" @mouseleave="onMouseLeaveMain">
                    <p class="subtext">
                        frontend developer
                    </p>
                    <TextScroll :text="'WitselBlue'" />
                </div>
            </section>
        </div>
        <div @mouseleave="onMouseLeaveMain">
            <section class="profile">
                <div class="inner">
                    <div data-aos="fade-up">
                        <ParallaxImg :src="profile.img" />
                    </div>
                    <p
                        class="txt-c"
                        data-aos="fade-up"
                    >
                        안녕하세요,<br class="mb"> 프론트엔드 개발자 <span class="mouse-hover1">비첼블루</span>입니다. <br>
                        <span class="mouse-hover1">인터렉티브</span> 웹 디자인과<br class="mb"> 개발에 관심을 두고<br>
                        다양한 방법으로 경험할 수 있는<br class="mb"> 웹사이트를 만들고자 합니다.
                    </p>
                </div>
            </section>
            <section class="skills">
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
            <!-- <section class="archive" ref="archive">
            <div class="inner">
                <div class="subtitle-wrap">
                <Nuxt-link
                    class="subtitle ft-bagel txt-c mouse-hover1"
                    to="/archive">
                    Archive
                </Nuxt-link>
                </div>
                <ul class="container" ref="comp">
                <li
                    class="panel"
                    v-for="list in archive"
                    :key="list.name">
                    <div class="wrap">
                    <Nuxt-link 
                        class="hover-img"
                        :to=list.path>
                        <div class="res-box-wrap">
                        <div class="res-box">
                            <img :src="list.img" v-if="list.img">
                            <span class="empty" v-else></span>
                        </div>
                        </div>
                        </Nuxt-link>
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
            </div>
            </section>
            <section class="project" ref="project">
            <div class="inner">
                <div class="subtitle-wrap">
                <Nuxt-link
                    class="subtitle ft-bagel txt-c mouse-hover1"
                    to="/project">
                    Project
                </Nuxt-link>
                </div>
            </div>
            <ul class="container" ref="comp">
                <li class="panel"></li>
                <li
                class="panel"
                v-for="list in project"
                :key="list.name">
                <div class="wrap">
                    <Nuxt-link 
                    class="hover-img"
                    :to=list.path>
                    <div class="res-box-wrap">
                        <div class="res-box">
                        <img :src="list.img" v-if="list.img">
                        <span class="empty" v-else></span>
                        </div>
                    </div>
                    </Nuxt-link>
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
            </section> -->
            <Footer />
        </div>
    </div>
</template>

<script>
import CursorCustom from '@/components/CursorCustom.vue';
import Mainvisual from '@/layouts/Mainvisual.vue';
import ButtonScrollDown from '@/components/ButtonScrollDown.vue';
import Footer from '@/layouts/Footer.vue';
import TextScroll from '@/components/TextScroll.vue';
import ParallaxImg from '@/components/ParallaxImg.vue';
import Butterfly from '@/assets/lottie/butterfly.json';

export default {
    name: 'Index',
    components: {
        CursorCustom,
        Mainvisual,
        ButtonScrollDown,
        Footer,
        TextScroll,
        ParallaxImg,
    },
    data() {
        return {
            cursorClass: 'cursor-main',
            showLottie: true,
            animationData: Butterfly,
            profile : {
                img: require('@/assets/img/profile.jpg'),
            },
            archive: [
                {
                    name: 'Kiki',
                    path: '/archive/kiki',
                    img: require('@/assets/img/archive01_main.png'),
                    work: 'p5.js',
                },
                {
                    name: 'Zizi',
                    path: '/archive/zizi',
                    img: require('@/assets/img/archive02_main.png'),
                    work: 'p5.js',
                },
                {
                    name: 'Witch Pot',
                    path: '/archive/witchpot',
                    img: require('@/assets/img/archive03_main.png'),
                    work: 'p5.js',
                },
                {
                    name: 'My Island',
                    path: '/archive/myisland',
                    img: '',
                    work: 'three.js',
                },
            ],
            project: [
                {
                    name: 'Monimo',
                    path: '/project/monimo',
                    link: 'https://www.monimo.com/w/main/WPFMHP0101M0',
                    img: require('@/assets/img/project01_main.png'),
                    work: 'development',
                    duration: '2024.07-2024.10',
                },
                {
                    name: '4·16 Online Memorial',
                    path: '/project/OnlineMemorial',
                    link: 'https://416foundation.org/%EC%98%A8%EB%9D%BC%EC%9D%B8-%EA%B8%B0%EC%96%B5-%EA%B3%B5%EA%B0%84/',
                    img: require('@/assets/img/project02_main.png'),
                    work: 'publishing',
                    duration: '2022.04',
                },
                {
                    name: 'DCAMP',
                    path: '/project/DCAMP',
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
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
        });
        this.scrollVertical();
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
                    
                let horizontalSections = gsap.utils.toArray(".project .container");

                horizontalSections.forEach((container) => {
                    let sections = container.querySelectorAll(".project .panel");

                    gsap.to(sections, {
                        xPercent: -100 * (sections.length),
                        ease: "none",
                        scrollTrigger: {
                            trigger: container,
                            pin: true,
                            scrub: 1,
                        }
                    });
                })
            }

        },
    },
}
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/layout/home.scss';
</style>