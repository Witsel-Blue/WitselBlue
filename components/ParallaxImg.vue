<template>
    <div id="parallax-img">
        <div class="parallax-wrap">
            <div class="parallax-cont">
                <img
                    :src="src"
                    class="img"
                >
            </div>
        </div>
    </div>
</template>

<script>
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (process.client) {
    gsap.registerPlugin(ScrollTrigger);
}

export default {
    props: {
        src: String,
    },
    mounted() {
        this.parallaxImg();
    },
    methods: {
        parallaxImg() {
            const gsap = this.$gsap;
            const ScrollTrigger = this.$ScrollTrigger;

            const section = document.getElementsByClassName('parallax-wrap')[0];
            const img = document.getElementsByClassName('img')[0];

            gsap.to(img, {
                scrollTrigger: {
                    trigger: section,
                    scrub: 1.5,
                    invalidateOnRefresh: true
                },
                y: section.offsetHeight - img.offsetHeight,
                ease: "none"
            });
        }
    },
}
</script>

<style lang="scss" scoped>
    @use '@/assets/scss/base/variables.scss' as *;
    
    #parallax-img {
        .parallax-wrap {
            background-color: $gray1;
            position: relative;
        }

        .parallax-cont {
            position: relative;
            overflow: hidden;
            padding-top: 72%;
        }

        .img {
            position: absolute;
            object-fit: cover;
            top: 0;
            width: 100%;
            height: 120%;
        }

    }
</style>