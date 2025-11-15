<template>
    <div id='parallax-img' data-aos-disable>
        <div class='parallax-wrap'>
            <div class='parallax-cont' data-aos='fade-up'>
                <img
                    :src='currentSrc'
                    class='img'
                    oncontextmenu='return false;'
                    ondragstart='return false;'
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
        srcMobile: String,
    },
    data() {
        return {
            scrollTriggerInstance: null,
            isMobile: false
        }
    },
    computed: {
        currentSrc() {
            return (this.isMobile && this.srcMobile) ? this.srcMobile : this.src;
        }
    },
    mounted() {
        if (!process.client) return;
        
        this.checkMobile();
        window.addEventListener('resize', this.handleResize);
        
        this.$nextTick(() => {
            const img = this.$el.querySelector('.img');
            
            if (img && img.complete) {
                setTimeout(() => {
                    this.parallaxImg();
                }, 100);
            } else if (img) {
                img.addEventListener('load', () => {
                    this.parallaxImg();
                });
            }
        });
    },
    beforeDestroy() {
        if (!process.client) return;
        
        window.removeEventListener('resize', this.handleResize);
        if (this.scrollTriggerInstance) {
            this.scrollTriggerInstance.kill();
            this.scrollTriggerInstance = null;
        }
    },
    methods: {
        checkMobile() {
            if (!process.client) return;
            this.isMobile = window.innerWidth <= 768;
        },
        handleResize() {
            if (!process.client) return;
            
            const wasMobile = this.isMobile;
            this.checkMobile();
            
            if (wasMobile !== this.isMobile) {
                this.$nextTick(() => {
                    this.parallaxImg();
                });
            }
        },
        parallaxImg() {
            if (!process.client) return;
            
            const section = this.$el.querySelector('.parallax-wrap');
            const img = this.$el.querySelector('.img');

            if (!section || !img) return;

            if (this.scrollTriggerInstance) {
                this.scrollTriggerInstance.kill();
            }

            const yDistance = section.offsetHeight - img.offsetHeight;

            const animation = gsap.to(img, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.5,
                    invalidateOnRefresh: true
                },
                y: yDistance,
                ease: 'none'
            });

            this.scrollTriggerInstance = animation.scrollTrigger;
            
            ScrollTrigger.refresh();
        }
    },
}
</script>

<style lang='scss' scoped>
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