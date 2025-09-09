<template>
  <div id='text_marquee'>
    <div class='marquee_inner' 
        :style='{ 
            animationDuration: speed + "s",
            animationDirection: direction,
        }'
    >
      <span v-for='n in repeatCount' :key='n'>{{ text }}</span>
      <span v-for='n in repeatCount' :key="'dup-' + n">{{ text }}</span>
    </div>
  </div>
</template>

<script>
export default {
    name: 'TextMarquee',
    props: {
        text: {
            type: String,
            default: 'marquee',
        },
        speed: {
            type: Number,
            default: 40,
        },
        repeatCount: {
            type: Number,
            default: 20,
        },
    },
    data() {
        return {
            currentSpeed: this.speed,
            direction: 'normal',
            lastScrollY: 0,
        };
    },
    mounted() {
        this.lastScrollY = window.scrollY;
        window.addEventListener('scroll', this.handleScroll);
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        handleScroll() {
        const currentY = window.scrollY;

        if (currentY > this.lastScrollY) {
            // 아래로 스크롤 → 빠르게
            this.currentSpeed = Math.max(4, this.speed / 2);
            this.direction = 'normal';
        } else {
            // 위로 스크롤 → 반대로
            this.currentSpeed = Math.max(4, this.speed / 2);
            this.direction = 'reverse';
        }

        this.lastScrollY = currentY;
        },
    },
};
</script>

<style lang='scss' scoped>
#text_marquee {
    position: relative;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;

    .marquee_inner {
        display: inline-block;
        white-space: nowrap;
        animation: marquee linear infinite;

        span {
            display: inline-block;
            padding: 0 1rem;
            font-size: 1.5rem;
            font-weight: bold;
        }
    }
}


@keyframes marquee {
    0% {
        transform: translateX(0%);
    }
    100% {
        transform: translateX(-50%);
    }
}
</style>
