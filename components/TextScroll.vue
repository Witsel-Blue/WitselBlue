<template>
    <div id="text-scroll">
        <div class="text-wrapper">
            <span
                v-for="(char, idx) in textArray"
                :key="idx"
                class="text"
                :data-speed="speeds[idx]"
            >
                {{ char }}
            </span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            required: true,
        },
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
        this.parallaxScroll();
    },
    methods: {
        splitTexts() {
            this.textArray = this.text.split('');
        },
        setSpeeds() {
            this.speeds = this.textArray.map(() => 0.3 + Math.random() * 0.4);
        },
        parallaxScroll() {
            window.addEventListener('scroll', () => {
                const scrolled = window.scrollY;
                const winH = window.innerHeight;
                const texts = this.$el.getElementsByClassName('text');

                Array.from(texts).forEach((el, idx) => {
                    const speed = parseFloat(el.dataset.speed);
                    el.style.transform = `translateY(${scrolled * speed}px)`;
                    el.style.opacity = Math.max(1 - scrolled / (winH * 0.8), 0);
                });
            });
        },
    },
};
</script>

<style scoped lang="scss">
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
