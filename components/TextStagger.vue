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
        }
    },
    data() {
        return {
            staggerTween: null,
            animated: false,
        };
    },
    mounted() {
        this.initAnimation();
        window.addEventListener("scroll", this.checkPosition);
        window.addEventListener("resize", this.checkPosition);
    },
    beforeDestroy() {
        window.removeEventListener("scroll", this.checkPosition);
        window.removeEventListener("resize", this.checkPosition);
        if (this.staggerTween) this.staggerTween.kill();
    },
    methods: {
        initAnimation() {
            const paragraphs = this.$refs.textStagger.querySelectorAll("li p");
            gsap.set(paragraphs, {
                yPercent: 100,
                rotation: (i) => (i % 2 === 0 ? -4 : 4),
                autoAlpha: 0,
            });
            this.checkPosition();
        },
        checkPosition() {
            const paragraphs = this.$refs.textStagger.querySelectorAll("li p");
            const rect = this.$refs.textStagger.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const profileCenter = rect.top + rect.height / 2;
            const profileBottom = rect.bottom;

            if (
                !this.animated &&
                ((profileCenter >= viewportHeight / 2 - 10 &&
                profileCenter <= viewportHeight / 2 + 10) ||
                (profileBottom <= viewportHeight && profileBottom >= viewportHeight * 0.2))
            ) {
                if (this.staggerTween) this.staggerTween.kill();
                this.staggerTween = gsap.to(paragraphs, {
                yPercent: 0,
                rotation: 0,
                autoAlpha: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out",
                });
                this.animated = true;
            }

            if (rect.bottom < 0 || rect.top > viewportHeight) {
                if (this.staggerTween) this.staggerTween.kill();
                gsap.set(paragraphs, {
                yPercent: 100,
                rotation: (i) => (i % 2 === 0 ? -4 : 4),
                autoAlpha: 0,
                });
                this.staggerTween = null;
                this.animated = false;
            }
        },
    },
}
</script>

<style lang="scss" scoped>
#text-stagger {
    li {
        overflow: hidden;
    }
}
</style>