<template>
    <div id="archive">
        <PageTransition :title="title"></PageTransition>
        <div class="main">
            <h1 class="title ft-bagel">{{ title }}</h1>
            <StarBg></StarBg>
            <ButtonScrollDown></ButtonScrollDown>
        </div>
        <ul class="container" ref="comp">
            <li
                class="panel"
                v-for="list in lists"
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
                            class="title"
                            :to=list.path>
                            <TextShifting :text="list.name"></TextShifting>
                        </Nuxt-link>
                    </div>
                </div>
            </li>
        </ul>
        <Footer></Footer>
    </div>
</template>

<script>
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
            Footer,
            PageTransition,
            TextShifting,
            ButtonScrollDown,
            StarBg,
        },
        data() {
            return {
                title: 'Archive',
                lists: [
                    {
                        name: 'Kiki',
                        path: 'archive/kiki',
                        img: require('@/assets/img/archive01_main.png'),
                        work: 'p5.js',
                    },
                    {
                        name: 'Zizi',
                        path: 'archive/zizi',
                        img: require('@/assets/img/archive02_main.png'),
                        work: 'p5.js',
                    },
                    {
                        name: 'Witch Pot',
                        path: 'archive/witchpot',
                        img: require('@/assets/img/archive03_main.png'),
                        work: 'p5.js',
                    },
                    {
                        name: 'My Island',
                        path: 'archive/myisland',
                        img: '',
                        work: 'three.js',
                    },
                ]
            }
        },
        mounted() {
            this.scrollVertical();
            this.titleScroll();
        },
        methods: {
            scrollVertical() {
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
    #archive {
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
            text-align: center;
            position: relative;
            .title {
                font-size: 5rem;
                line-height: 1;
                z-index: 3;
                position: initial;

                &.active {
                    position: fixed;
                    top: 3%;
                }
            }
            #star-bg {
                position: absolute;
                top: 20%;
            }
            #button-scrolldown {
                margin-top: 24px;
            }
        }
        .container {
            padding: 10vh 0;
            overscroll-behavior: none;
            width: 320% !important;
            height: 100vh;
            display: flex;
            gap: 4vw;
            .panel {
                max-width: 100%;
                min-width: 32vw;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                .wrap {
                    width: 80%;
                    position: relative;
                }
                .hover-img {
                    width: 80%;
                    max-width: 800px;
                    display: block;
                    .res-box-wrap {
                        padding-bottom: 72%;
                        // img {
                        //     filter: blur(1px);
                        // }
                    }
                    // &:hover img {
                    //     filter: none;
                    // }
                    .empty {
                        width: 100%;
                        height: 100%;
                        background-color: #E1E1E1;
                        display: block;
                    }
                }
                .desc {
                    position: absolute;
                    bottom: 4%;
                    right: 0;
                    max-width: 48%;
                    .work {
                        font-size: 0.8rem;
                    }
                    .title::v-deep {
                        display: inline-block;
                        font-size: 2.4rem;
                        font-weight: bold;
                        display: block;
                        span {
                            font-family: "Diphylleia";
                        }
                    }
                }
            }
        }
    }
</style>