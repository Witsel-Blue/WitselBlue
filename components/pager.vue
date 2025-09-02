<template>
    <div id='pager'>
        <div class='wrapper mouse-hover1'>
            <img
                :src="require('@/assets/img/pager.svg')"
                @click='scrollToTop'
                alt='pager'
            >
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
    name: 'Pager',
    mounted() {
        if (process.client) {
            this.initGsap();
        }
    },
    beforeDestroy() {
        if (this.scrollTween) {
            this.scrollTween.kill();
            this.scrollTween = null;
        }
        if (this.scrollTrigger) {
            this.scrollTrigger.kill();
            this.scrollTrigger = null;
        }
    },
    methods: {
        async initGsap() {
            const gsap = (await import('gsap')).default;
            const { ScrollTrigger } = await import('gsap/dist/ScrollTrigger.js');

            gsap.registerPlugin(ScrollTrigger);

            const triggerEl = document.getElementById('app') || document.body;

            this.scrollTween = gsap.to('#pager', {
                rotation: 360*3,
                ease: 'none',
                scrollTrigger: {
                trigger: triggerEl,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
                },
            });

            this.scrollTrigger = this.scrollTween.scrollTrigger;
        },
        scrollToTop() {
            if (process.client) {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
            }
        }
    },
}
</script>

<style lang='scss' scoped>
    @use '@/assets/scss/base/variables.scss' as *;
    
    #pager {
        position: fixed;
        bottom: 2%;
        right: 2vw;
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