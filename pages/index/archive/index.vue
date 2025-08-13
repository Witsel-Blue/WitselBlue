<template>
    <div
        id="archive"
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
            title: 'Archive',
            lists: [
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
    @import '@/assets/scss/layout/page.scss';
</style>