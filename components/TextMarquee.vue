<template>
    <div id='text_marquee'>
        <div class='marquee_inner' ref='inner'>
            <span v-for='n in repeatCount' :key='n'>{{ text }}</span>
            <span v-for='n in repeatCount' :key='"dup-" + n'>{{ text }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TextMarquee',
    props: {
        text: { type: String, default: 'marquee' },
        speed: { type: Number, default: 80 },
        repeatCount: { type: Number, default: 20 },
    },
    data() {
        return {
            pos: 0,
            unitWidth: 0,
            baseSpeedPx: 0,
            velocity: 0,
            targetVelocity: 0,
            dir: 1,
            speedFactor: 2,
            lastScrollY: 0,
            rafId: null,
            lastTs: 0,
            scrollTimeout: null,
        };
    },
    mounted() {
        this.lastScrollY = window.scrollY;
        this.$nextTick(() => {
            this.computeSizes();
            this.velocity = this.baseSpeedPx;
            this.targetVelocity = this.velocity;
            this.tick(performance.now());
        });
        window.addEventListener('scroll', this.handleScroll, { passive: true });
        window.addEventListener('resize', this.handleResize, { passive: true });
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        if (this.rafId) cancelAnimationFrame(this.rafId);
        if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
    },
    methods: {
        computeSizes() {
            const el = this.$refs.inner;
            const total = el ? el.scrollWidth : 0;
            this.unitWidth = total / 2 || 1;
            this.baseSpeedPx = this.unitWidth / this.speed;
        },
        handleResize() {
            const progressRatio = (this.pos % -this.unitWidth) / -this.unitWidth || 0;
            this.computeSizes();
            this.pos = -this.unitWidth * progressRatio;
        },
        handleScroll() {
            const currentY = window.scrollY;
            const delta = currentY - this.lastScrollY;

            if (delta > 0) {
                // 아래로 스크롤 → 왼쪽 빠르게
                this.dir = 1;
                this.targetVelocity = this.baseSpeedPx * this.speedFactor;
            } else if (delta < 0) {
                // 위로 스크롤 → 오른쪽 빠르게
                this.dir = -1;
                this.targetVelocity = this.baseSpeedPx * this.speedFactor * this.dir;
            }

            this.lastScrollY = currentY;

            // 스크롤 멈추면 방향 유지, 속도만 기본으로 복귀
            if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                this.targetVelocity = this.baseSpeedPx * this.dir; // 방향 유지
            }, 200);
        },
        tick(ts) {
            const dt = this.lastTs ? (ts - this.lastTs) / 1000 : 0;
            this.lastTs = ts;

            const smooth = 0.1;
            this.velocity += (this.targetVelocity - this.velocity) * smooth;

            this.pos += -this.velocity * dt;

            if (this.pos <= -this.unitWidth) this.pos += this.unitWidth;
            if (this.pos >= 0) this.pos -= this.unitWidth;

            if (this.$refs.inner) {
                this.$refs.inner.style.transform = `translateX(${this.pos}px)`;
            }

            this.rafId = requestAnimationFrame(this.tick);
        },
    },
};
</script>

<style lang='scss' scoped>
@use '@/assets/scss/base/variables.scss' as *;

#text_marquee {
    position: relative;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;

    .marquee_inner {
        display: inline-block;
        white-space: nowrap;
        will-change: transform;

        span {
            display: inline-block;
            padding: 0 1rem;
            font-size: 4rem;
            font-weight: bold;
            color: $gray1;
            font-family: 'TanPearl';
        }
    }
}
</style>
