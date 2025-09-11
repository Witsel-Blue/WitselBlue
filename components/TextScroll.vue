<template>
    <div id='text-scroll'>
        <div class='text-wrapper'>
            <span
                v-for='(char, idx) in textArray'
                :key='idx'
                class='text'
                :data-speed='speeds[idx]'
            >
                {{ char }}
            </span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        text: { type: String, required: true },
    },
    data() {
        return {
            textArray: [],
            speeds: [],
        };
    },
    mounted() {
        this.splitTexts();
        this.setSpeeds();
        this.$nextTick(() => {
            this.initInitialAnimation();
            this.parallaxScroll();
        });
    },
    methods: {
        splitTexts() {
            this.textArray = this.text.split('');
        },
        setSpeeds() {
            // this.speeds = this.textArray.map(() => 0.3 + Math.random() * 0.4);
            const fixedSpeeds = [0.4, 0.6, 0.5, 0.7];
            this.speeds = this.textArray.map((_, idx) => fixedSpeeds[idx % fixedSpeeds.length]);
        },
        initInitialAnimation() {
            const texts = this.$el.getElementsByClassName('text');
            Array.from(texts).forEach((el, idx) => {
                el.style.transform = 'rotateY(360deg)';
                el.style.opacity = '1';
                el.style.display = 'inline-block';
                el.style.transition = 'transform 0.6s ease, opacity 0.6s ease';

                setTimeout(() => {
                    el.style.transform = 'rotateY(0deg)';
                }, idx * 100);
            });
        },
        parallaxScroll() {
            const texts = this.$el.getElementsByClassName('text');

            window.addEventListener('scroll', () => {
                const scrolled = window.scrollY;
                const winH = window.innerHeight;

                Array.from(texts).forEach((el) => {
                    const speed = parseFloat(el.dataset.speed);
                    const translateY = scrolled * speed;

                    el.style.transition = 'transform 0.1s linear, opacity 0.1s linear';
                    el.style.transform = `translateY(${translateY}px)`;

                    const newOpacity = Math.max(1 - scrolled / (winH * 0.8), 0);
                    el.style.opacity = newOpacity;
                    el.style.display = newOpacity < 0.01 ? 'none' : 'inline-block';
                });
            });
        },

    }
};
</script>

<style lang='scss' scoped>
#text-scroll {
    .text-wrapper {
        display: flex;
        flex-wrap: wrap;
        span.text {
            display: inline-block;
            will-change: transform, opacity;
        }
    }
}
</style>
