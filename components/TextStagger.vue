<template>
    <div id='text-stagger'>
        <ul ref='textStagger'>
            <li v-for='(item, index) in paragraphs' :key='index'>
                <p v-html='item'></p>
            </li>
        </ul>
    </div>
</template>

<script>
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (process.client) {
    gsap.registerPlugin(ScrollTrigger);
}

export default {
    name: 'TextStagger',
    props: {
        paragraphs: {
            type: Array,
            required: true,
        },
        triggerMode: {
            type: String,
            default: 'middle',
        },
        speedMode: {
            type: String,
            default: 'fast',
        },
    },
    data() {
        return {
            staggerTween: null,
            animated: false,
        };
    },
    mounted() {
        if (process.client) {
            this.$nextTick(() => {
                this.initAnimation();
                if (this.triggerMode === 'bottom') {
                    this.runAnimation(this.$refs.textStagger.querySelectorAll('li p'));
                    this.animated = true;
                } else {
                    this.checkPosition();
                }
            });
            window.addEventListener('scroll', this.checkPosition);
            window.addEventListener('resize', this.checkPosition);
        }
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.checkPosition);
        window.removeEventListener('resize', this.checkPosition);
        if (this.staggerTween) this.staggerTween.kill();
    },
    methods: {
        initAnimation() {
            const paragraphs = this.$refs.textStagger.querySelectorAll('li p');
            gsap.set(paragraphs, {
                yPercent: 150,
                rotation: (i) => (i % 2 === 0 ? -4 : 4),
                opacity: 1,
            })
            this.checkPosition();
        },
        runAnimation(paragraphs) {
            if (this.staggerTween) this.staggerTween.kill();

            // speed 모드
            const settings = {
                fast: { stagger: 0.1, duration: 0.2 },
                slow: { stagger: 0.6, duration: 0.6 },
            }
            const { stagger, duration } = settings[this.speedMode] || settings.fast;

            this.staggerTween = gsap.to(paragraphs, {
                yPercent: 0,
                rotation: 0,
                duration,
                stagger,
            })
            this.animated = true;
        },
        resetAnimation(paragraphs) {
            if (this.staggerTween) this.staggerTween.kill();
            gsap.set(paragraphs, {
                yPercent: 150,
                rotation: (i) => (i % 2 === 0 ? -4 : 4),
                opacity: 1,
            })
            this.staggerTween = null;
            this.animated = false;
        },
        checkPosition() {
            // middle 모드 : 화면 중앙에서 트리거
            const paragraphs = this.$refs.textStagger.querySelectorAll('li p');
            const rect = this.$refs.textStagger.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const rectCenter = rect.top + rect.height / 2;
            const rectBottom = rect.bottom;

            if (!this.animated && 
                ((rectCenter >= viewportHeight / 2 - 10 && rectCenter <= viewportHeight / 2 + 10) ||
                (rectBottom <= viewportHeight && rectBottom >= viewportHeight * 0.2))
            ) {
                this.runAnimation(paragraphs);
            }

            if (rect.bottom < 0 || rect.top > viewportHeight) {
                this.resetAnimation(paragraphs);
            }

            // bottom 모드
            if (this.triggerMode === 'bottom') {
                const paragraphs = this.$refs.textStagger.querySelectorAll('li p');
                const scrollPosition = window.scrollY + window.innerHeight;
                const docHeight = document.documentElement.scrollHeight;

                const isBottom = scrollPosition >= docHeight - 1;

                if (isBottom && !this.animated) {
                    this.runAnimation(paragraphs);
                } else if (!isBottom && this.animated) {
                    this.resetAnimation(paragraphs);
                }
                return;
            }
            
        },
    },
    }
</script>

<style lang='scss' scoped>
#text-stagger {
    li {
        overflow: hidden;
    }
}
</style>