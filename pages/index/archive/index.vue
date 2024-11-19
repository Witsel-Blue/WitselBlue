<template>
    <div id="archive">
        <PageTransition :title="title"></PageTransition>
        <div class="main">
            <h1 class="title ft-bagel">{{ title }}</h1>
            <StarBg></StarBg>
            <ButtonScrollDown></ButtonScrollDown>
        </div>
        <!-- <ul class="container" ref="comp">
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
        </ul> -->
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
            width: 800%;
            height: 100vh;
            display: flex;
            gap: 5vw;
            .panel {
                max-width: 160%;
                min-width: 32vw;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                .wrap {
                    width: 100%;
                    position: relative;
                }
                .hover-img {
                    width: 80%;
                    display: block;
                    .res-box-wrap {
                        padding-bottom: 80%;
                    }
                    .empty {
                        width: 100%;
                        height: 100%;
                        background-color: #ccc;
                        display: block;
                    }
                }
                .desc {
                    position: absolute;
                    bottom: 4%;
                    right: 0;
                    .work {
                        font-size: 0.8rem;
                    }
                    .title {
                        display: inline-block;
                        font-size: 2.4rem;
                        font-weight: bold;
                        display: block;
                    }
                }
            }
        }
    }
</style>