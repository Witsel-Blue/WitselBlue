<template>
    <div id='pager'>
        <div class='wrapper mouse-hover1'>
            <p v-show='showGoTop' class='gotop'>
                click to<br>go top
            </p>
            <img
                :src="require('@/assets/img/pager.svg')"
                @click='scrollToTop'
                alt='pager'
                class='pager'
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
    data() {
        return {
            showGoTop: false,
            scrollTween: null,
            scrollTrigger: null,
        }
    },
    mounted() {
        if (process.client) {
            this.initGsap();
            window.addEventListener('scroll', this.checkScrollBottom);

            this.$watch('$route', () => {
                this.$nextTick(() => {
                    this.resetGsap();
                    this.initGsap();
                });
            });

        }
    },
    beforeDestroy() {
        this.resetGsap();
        window.removeEventListener('scroll', this.checkScrollBottom);
    },
    methods: {
        async initGsap() {
            const gsap = (await import('gsap')).default;
            const { ScrollTrigger } = await import('gsap/dist/ScrollTrigger.js');

            gsap.registerPlugin(ScrollTrigger);
            gsap.set('.pager', { rotation: 0 });

            const triggerEl = document.getElementById('app') || document.body;

            this.scrollTween = gsap.to('.pager', {
                rotation: 360*2,
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
        resetGsap() {
            if (this.scrollTween) {
                this.scrollTween.kill();
                this.scrollTween = null;
            }
            if (this.scrollTrigger) {
                this.scrollTrigger.kill();
                this.scrollTrigger = null;
            }
            gsap.set('.pager', { rotation: 0 });
        },
        checkScrollBottom() {
            const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1;
            this.showGoTop = bottom;
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
            .gotop {
                position: absolute;
                top: 0;
                left: 50%;
                transform: translate(-50%, -100%);
                text-align: center;
                width: 100%;
            }
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
</style>