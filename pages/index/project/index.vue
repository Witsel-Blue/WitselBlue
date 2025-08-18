<template>
    <div
        id="project"
        class="page"
    >
        <CursorCustom />
        <PageTransition :title="title" />
        <div class="main">
            <h1 class="title ft-bagel">
                {{ title }}
            </h1>
            <StarBg />
            <ButtonScrollDown />
        </div>
        <ul
            ref="comp"
            class="container"
        >
            <li
                v-for="list in lists"
                :key="list.name"
                class="panel"
            >
                <div
                    class="wrap"
                    data-aos="fade-up"
                >
                    <Nuxt-link 
                        class="hover-img"
                        :to="list.path"
                    >
                        <div class="res-box-wrap">
                            <div class="res-box">
                                <img
                                    v-if="list.img"
                                    :src="list.img"
                                >
                                <span
                                    v-else
                                    class="empty"
                                />
                            </div>
                        </div>
                    </Nuxt-link>
                    <div class="desc">
                        <p class="work">
                            {{ list.work }}
                        </p>
                        <Nuxt-link 
                            class="title mouse-hover1"
                            :to="list.path"
                        >
                            <TextShifting :text="list.name" />
                        </Nuxt-link>
                    </div>
                </div>
            </li>
        </ul>
        <Footer />
    </div>
</template>

<script>
import CursorCustom from '@/components/CursorCustom.vue';
import Footer from '@/layouts/Footer.vue';
import PageTransition from '@/layouts/PageTransition.vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import TextShifting from '@/components/TextShifting.vue';
import ButtonScrollDown from '@/components/ButtonScrollDown.vue';
import StarBg from '@/components/StarBg.vue';

if (process.client) {
    gsap.registerPlugin(ScrollTrigger);
}

export default {
    components: {
        CursorCustom,
        Footer,
        PageTransition,
        TextShifting,
        ButtonScrollDown,
        StarBg,
    },
    data() {
        return {
            title: 'project',
            lists: [
                {
                    name: 'Portfolio',
                    path: '/project/portfolio',
                    link: '',
                    img: require('@/assets/img/project09_main.png'),
                    work: 'development',
                    duration: '2024.11',
                },
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
                {
                    name: 'Oxfam VirtualWalker',
                    path: '/project/OxfamVirtualWalker',
                    link: 'https://v50.oxfamtrailwalker.or.kr/',
                    img: require('@/assets/img/project04_main.png'),
                    work: 'frontend',
                    duration: '2021.08-2021.09',
                },
                {
                    name: 'DCDCenter',
                    path: '/project/DCDCenter',
                    link: 'https://www.dcdcenter.or.kr/',
                    img: require('@/assets/img/project05_main.png'),
                    work: 'frontend',
                    duration: '2021.11-2021.12',
                },
                {
                    name: 'Cabinnet',
                    path: '/project/cabinnet',
                    link: '/',
                    img: require('@/assets/img/project06_main.png'),
                    work: 'frontend',
                    duration: '2021.05-2021.07',
                },
                {
                    name: 'KACE',
                    path: '/project/KACE',
                    link: 'http://www.kace.or.kr/',
                    img: require('@/assets/img/project07_main.png'),
                    work: 'frontend',
                    duration: '2021.09-2021.10',
                },
                {
                    name: 'RNJOB App',
                    path: '/project/RNJOB',
                    link: 'https://rnjob.or.kr/',
                    img: require('@/assets/img/project08_main.png'),
                    work: 'publishing',
                    duration: '2021.07',
                },
            ]
        }
    },
    mounted() {
        this.scrollVertical();
        this.titleScroll();
        window.addEventListener('resize', this.scrollVertical);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        scrollVertical() {
            var winW = window.innerWidth;

            if (winW > 425) {
                const gsap = this.$gsap;
                const ScrollTrigger = this.$ScrollTrigger;
                    
                let horizontalSections = gsap.utils.toArray(".container");

                // var n = document.querySelectorAll('.panel').length;
                // document.querySelector('.container').style.width = n*200 + '%';

                horizontalSections.forEach((container) => {
                    let sections = container.querySelectorAll(".panel");

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
        titleScroll() {
            var title = document.querySelector('.title');
            var button = document.querySelector('#button-scrolldown');
            var winH = window.innerWidth;
            var titleTop = title.offsetTop - winH*3/100;

            window.addEventListener('scroll', function() {
                var scrolled = window.scrollY;

                if ( titleTop < scrolled ) {
                    title.classList.add('active');
                } else {
                    var x = 1 - scrolled * 0.0016;
                    var x2 = 1 - scrolled * 0.016;
                    title.style.transform = 'scale(' + x + ')';
                    button.style.opacity = x2;
                    title.classList.remove('active');
                }

            });
        }
    },
}
</script>

<style lang="scss" scoped>
    @use '@/assets/scss/base/variables.scss' as *;
    @import '@/assets/scss/layout/page.scss';

    .page .container .panel:nth-child(2) .desc {
        max-width: 38%;
    }

    // mobile
    @media all and (max-width: $mobile) {
        .page .container .panel:nth-child(2) .desc {
            max-width: 100%;
        }
    }
</style>