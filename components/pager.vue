<template>
    <div id='pager'>
        <div class='wrapper mouse-hover1'>
            <TextStagger
                :paragraphs="[$t('pager.paragraphs.0'), $t('pager.paragraphs.1')]"
                triggerMode='bottom'
                speedMode='fast'
                :rewindAnimation='true'
            />
            <svg
                :src="require('@/assets/img/pager.svg')"
                @click='scrollToTop'
                alt='pager'
                class='pager' 
                xmlns="http://www.w3.org/2000/svg" width="78" height="81" viewBox="0 0 78 81" fill="none">
                <path d="M39 0L43.8394 25.7875L63.0992 7.73481L51.6697 31.4072L77.9933 27.9848L54.6606 40.5L77.9933 53.0152L51.6697 49.5928L63.0992 73.2652L43.8394 55.2125L39 81L34.1606 55.2125L14.9008 73.2652L26.3303 49.5928L0.00668335 53.0152L23.3394 40.5L0.00668335 27.9848L26.3303 31.4072L14.9008 7.73481L34.1606 25.7875L39 0Z" fill="#3E3C3C"/>
            </svg>
        </div>
    </div>
</template>

<script>
import TextStagger from '@/components/TextStagger.vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (process.client) {
    gsap.registerPlugin(ScrollTrigger);
}
    
export default {
    name: 'Pager',
    components: {
        TextStagger,
    },
    data() {
        return {
            scrollTween: null,
            scrollTrigger: null,
        }
    },
    mounted() {
        if (process.client) {
            this.initGsap();
            this.$watch('$route', () => {
                this.$nextTick(() => {
                    this.resetGsap();
                    this.initGsap();
                });
            });
        }
    },
    beforeDestroy() {
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
    right: 4vw;
    z-index: 100;
    .wrapper {
        width: 10vw;
        height: 10vw;
        max-width: 120px;
        max-height: 120px;
        min-width: 80px;
        min-height: 80px;
        #text-stagger::v-deep {
            position: absolute;
            left: 50%;
            transform: translate(-50%, -100%);
            text-align: center;
            width: 100%;
            li {
                p {
                    font-size: 0.8rem;
                    line-height: 0.9;
                    font-family: 'basic_font', 'YUniverse';
                }
                &:last-child p {
                    line-height: 1.4;
                }
            }
        }
        svg {
            width: 100%;
            height: 100%;
        }
    }
}
</style>