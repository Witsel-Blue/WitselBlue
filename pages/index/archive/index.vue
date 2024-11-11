<template>
    <div id="archive">
        <PageTransition :title="title"></PageTransition>
        <div class="main">
            <h1 class="title ft-bagel">{{ title }}</h1>
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
                title: 'Archive',
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
            .title {
                font-size: 5rem;
            }
            #button-scrolldown {
                position: absolute;
                bottom: 10vh;
            }
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
                    img {
                        filter: blur(1px) grayscale(1);
                    }
                    &:hover img {
                        filter: none;
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