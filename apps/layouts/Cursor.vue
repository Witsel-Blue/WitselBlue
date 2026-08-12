<template>
    <div
        v-show='visible'
        class='site-cursor'
        :style='cursorStyle'
        aria-hidden='true'
    />
</template>

<script>
    const CURSOR_OFFSET_X = 24;
    const CURSOR_OFFSET_Y = 32;

    export default {
        name: 'SiteCursor',
        data() {
            return {
                x: 0,
                y: 0,
                targetX: 0,
                targetY: 0,
                visible: false,
                active: false,
                rafId: null,
            };
        },
        computed: {
            cursorStyle() {
                return {
                    transform: `translate3d(${this.x}px, ${this.y}px, 0)`,
                };
            },
        },
        mounted() {
            if (!process.client) return;
            if (!window.matchMedia('(pointer: fine)').matches) return;

            this.active = true;

            this.onMove = (e) => {
                this.targetX = e.clientX + CURSOR_OFFSET_X;
                this.targetY = e.clientY + CURSOR_OFFSET_Y;
                if (!this.visible) {
                    this.x = this.targetX;
                    this.y = this.targetY;
                    this.visible = true;
                }
            };
            this.onLeave = () => {
                this.visible = false;
            };

            window.addEventListener('mousemove', this.onMove, { passive: true });
            document.documentElement.addEventListener('mouseleave', this.onLeave);
            this.tick();
        },
        beforeDestroy() {
            if (!this.active) return;

            window.removeEventListener('mousemove', this.onMove);
            document.documentElement.removeEventListener('mouseleave', this.onLeave);
            if (this.rafId) cancelAnimationFrame(this.rafId);
        },
        methods: {
            tick() {
                this.x += (this.targetX - this.x) * 0.22;
                this.y += (this.targetY - this.y) * 0.22;
                this.rafId = requestAnimationFrame(this.tick);
            },
        },
    };
</script>

<style lang='scss' scoped>
    @use '@/assets/scss/base/variables' as *;

    .site-cursor {
        position: fixed;
        top: 0;
        left: 0;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: $white-inverted;
        mix-blend-mode: difference;
        pointer-events: none;
        z-index: 9999;
        will-change: transform;
    }
</style>
