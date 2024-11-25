<template>
    <div id="pager">
        <div class="wrapper mouse-hover1">
            <img src="@/assets/img/pager.svg" @click="scrollToTop">
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
        mounted() {
            this.rotationAnim();
        },
        methods: {
            rotationAnim() {
                const gsap = this.$gsap;
                const ScrollTrigger = this.$ScrollTrigger;

                gsap.to("#pager", {
                    scrollTrigger: {
                        trigger: "#app",
                        duration: '100%',
                        // markers: true,
                        scrub: 1,
                    },
                    rotation: 360,
                    repeat: 1,
                });
            },
            scrollToTop() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/base/variables.scss';
    
    #pager {
        position: fixed;
        bottom: 5%;
        right: 5vw;
        z-index: 100;
        .wrapper {
            width: 10vw;
            height: 10vw;
            max-width: 120px;
            max-height: 120px;
            min-width: 80px;
            min-height: 80px;
            img {
                width: 100%;
                height: 100%;
                // cursor: pointer;
            }
        }
    }
</style>