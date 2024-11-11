<template>
    <div id="portfolio">
        <!-- <PageTransition :title="title"></PageTransition> -->
        <div class="main">
            <h1>Portfolio</h1>
            <ButtonScrollDown></ButtonScrollDown>
        </div>
        <ul class="container" ref="comp">
            <li class="panel"></li>
            <li
                class="panel"
                v-for="list in lists"
                :key="list.name">
                <Nuxt-link 
                    class="res-box-wrap hover-img"
                    :to=list.path>
                    <div class="res-box">
                        <img :src="list.img" v-if="list.img">
                        <span class="empty" v-else></span>
                    </div>
                </Nuxt-link>
                <p class="work">{{ list.work }}</p>
                <Nuxt-link 
                    class="title"
                    :to=list.path>
                    <TextShifting :text="list.name"></TextShifting>
                </Nuxt-link>
                <p class="duration">{{ list.duration }}</p>
            </li>
        </ul>
    </div>
</template>

<script>
    import PageTransition from '@/components/PageTransition.vue';
    import gsap from 'gsap';
    import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
    import TextShifting from '@/components/TextShifting.vue';
    import ButtonScrollDown from '@/components/ButtonScrollDown.vue';

    if (process.client) {
        gsap.registerPlugin(ScrollTrigger);
    }

    export default {
        components: {
            PageTransition,
            TextShifting,
            ButtonScrollDown,
        },
        data() {
            return {
                title: 'Portfolio',
                lists: [
                    {
                        name: '삼성카드 모니모 앱',
                        path: 'portfolio/01_Monimo',
                        link: 'https://www.monimo.com/w/main/WPFMHP0101M0',
                        img: require('@/assets/img/portfolio01_main.png'),
                        work: 'development',
                        duration: '2024.07-2024.10',
                    },
                    {
                        name: '4·16 온라인 기억센터',
                        path: 'portfolio/02_416_Online_Memorial',
                        link: 'https://416foundation.org/%EC%98%A8%EB%9D%BC%EC%9D%B8-%EA%B8%B0%EC%96%B5-%EA%B3%B5%EA%B0%84/',
                        img: require('@/assets/img/portfolio02_main.png'),
                        work: 'publishing',
                        duration: '2022.04',
                    },
                    {
                        name: 'D.CAMP',
                        path: 'portfolio/03_DCAMP',
                        link: 'https://dcamp.kr/',
                        img: require('@/assets/img/portfolio03_main.png'),
                        work: 'frontend',
                        duration: '2022.01-2022.03',
                    },
                    {
                        name: '옥스팜 버추얼워커',
                        path: 'portfolio/04_OxfamVirtualWalker',
                        link: 'https://v50.oxfamtrailwalker.or.kr/',
                        img: require('@/assets/img/portfolio04_main.png'),
                        work: 'frontend',
                        duration: '2022.08-2022.09',
                    },
                    {
                        name: '전문무용수지원센터',
                        path: 'portfolio/05_DCDCenter',
                        link: 'https://www.dcdcenter.or.kr/',
                        img: require('@/assets/img/portfolio05_main.png'),
                        work: 'frontend',
                        duration: '2023.01-2023.02',
                    },
                    {
                        name: 'Cabinnet',
                        path: 'portfolio/06_Cabinnet',
                        link: '/',
                        img: '',
                        work: 'frontend',
                        duration: '2022.05-2022.06',
                    },
                    {
                        name: 'KACE',
                        path: 'portfolio/07_KACE',
                        link: 'http://www.kace.or.kr/',
                        img: '',
                        work: 'frontend',
                        duration: '2022.10-2021.12',
                    },
                    {
                        name: 'RNJOB 앱',
                        path: 'portfolio/08_RNJOB',
                        link: 'https://rnjob.or.kr/',
                        img: require('@/assets/img/portfolio08_main.png'),
                        work: 'publishing',
                        duration: '2022.07',
                    },
                ]
            }
        },
        mounted() {
            this.scrollVertical();
        },
        methods: {
            scrollVertical() {
                const gsap = this.$gsap;
                const ScrollTrigger = this.$ScrollTrigger;
                
                let horizontalSections = gsap.utils.toArray(".container");

                // var n = document.querySelectorAll('.panel').length;
                // document.querySelector('.container').style.width = n*100 + '%';

                horizontalSections.forEach((container) => {
                    let sections = container.querySelectorAll(".panel");

                    gsap.to(sections, {
                        xPercent: -100 * (sections.length - 1),
                        ease: "none",
                        scrollTrigger: {
                            trigger: container,
                            pin: true,
                            scrub: 1,
                        }
                    });
                })

            },
        },
    }
</script>

<style lang="scss" scoped>
    #portfolio {
        width: 100%;
        min-height: 100vh;
        overflow: hidden;
        .main {
            width: 100%;
            height: 100vh;
            padding: 10vh 10vw;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .container {
            padding: 10vh 0;
            overscroll-behavior: none;
            height: 100vh;
            display: flex;
            gap: 5vw;
            .panel {
                max-width: 300px;
                min-width: 200px;
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                .res-box-wrap {
                    border-radius: 32px;
                    .empty {
                        width: 100%;
                        height: 100%;
                        background-color: #ccc;
                        display: block;
                    }
                }
                .work {
                    margin-top: 16px;
                    font-size: 14px;
                    text-align: center;
                }
                .title {
                    display: inline-block;
                    font-size: 1.4rem;
                    font-weight: bold;
                    text-align: center;
                    display: block;
                }
                .duration {
                    margin-top: 8px;
                    font-size: 14px;
                    color: #3e3c3c8f;
                    text-align: center;
                }
            }
        }
    }
</style>