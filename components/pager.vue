<template>
    <div id="pager">
        <div class="wrapper">
            <img src="@/assets/img/pager.svg">
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

            }
        },
    }
</script>

<style lang="scss" scoped>
    #pager {
        position: fixed;
        bottom: 5vw;
        right: 5vw;
        .wrapper {
            width: 10vw;
            height: 10vw;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
</style>