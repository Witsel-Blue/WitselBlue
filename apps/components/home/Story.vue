<template>
    <section id='story' ref='story'>
        <div class='story__sticky'>
            <div
                ref='viewport'
                class='story__viewport'
                :style='viewportStyle'
            >
                <div
                    ref='canvasWrap'
                    class='story__canvas'
                    :style='canvasStyle'
                >
                    <svg
                        ref='svg'
                        class='story__svg'
                        viewBox='0 0 2875 901'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        aria-hidden='true'
                    >
                        <path
                            ref='trackPath'
                            class='story__track'
                            :stroke-dasharray='pathLength'
                            :stroke-dashoffset='pathDashOffset'
                            d='M0.491669 0.0908203C36.9917 197.591 133.492 193.591 213.992 278.591C294.492 363.591 25.9917 576.591 125.992 677.091C225.992 777.591 420.492 511.091 668.992 510.591C917.492 510.091 879.992 683.591 1079.49 730.091C1278.99 776.591 1396.49 321.091 1548.99 380.091C1701.49 439.091 1648.49 648.591 1837.49 677.091C2026.49 705.591 2321.49 559.091 2487.99 579.591C2654.49 600.091 2874.49 900.591 2874.49 900.591'
                        />
                        <circle
                            class='story__dot'
                            :cx='dot.x'
                            :cy='dot.y'
                            r='5'
                        />
                    </svg>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    const VIEWBOX = { w: 2875, h: 901 };
    const VERTICAL_SCROLL_VH = 0.5;
    const HORIZONTAL_SCROLL_VH = 1;

    export default {
        name: 'HomeStory',
        data() {
            return {
                dot: { x: 0, y: 0 },
                canvasX: 0,
                canvasY: 0,
                viewportY: 0,
                pathLength: 0,
                pathProgress: 0,
                scrollOrigin: null,
            };
        },
        computed: {
            canvasStyle() {
                return {
                    transform: `translate3d(${this.canvasX}px, ${this.canvasY}px, 0)`,
                };
            },
            viewportStyle() {
                return {
                    transform: `translate3d(0, ${this.viewportY}px, 0)`,
                };
            },
            pathDashOffset() {
                if (!this.pathLength) return 99999;
                return this.pathLength * (1 - this.pathProgress);
            },
        },
        mounted() {
            if (!process.client) return;

            this.onScroll = () => {
                if (!this.pathLength) this.measurePath();

                const section = this.$refs.story;
                if (!section) return;

                const vh = window.innerHeight;
                const verticalLength = vh * VERTICAL_SCROLL_VH;
                const horizontalLength = vh * HORIZONTAL_SCROLL_VH;
                const totalScroll = verticalLength + horizontalLength;
                const rawScrolled = Math.max(0, -section.getBoundingClientRect().top);

                if (this.scrollOrigin === null) this.viewportY = 0;
                this.setDotProgress(0);
                this.centerCanvasOnDot();

                const dotScreenY = this.getDotScreenY();
                if (dotScreenY === null) return;

                if (this.scrollOrigin === null) {
                    if (dotScreenY > vh * 0.5) return;
                    this.scrollOrigin = rawScrolled;
                }

                if (rawScrolled < this.scrollOrigin) {
                    this.scrollOrigin = null;
                    this.pathProgress = 0;
                    this.viewportY = 0;
                    this.centerCanvasOnDot();
                    return;
                }

                const scrolled = rawScrolled - this.scrollOrigin;
                const clamped = Math.min(scrolled, totalScroll);

                if (clamped <= verticalLength) {
                    const t = verticalLength > 0 ? clamped / verticalLength : 0;
                    const eased = this.smoothstep(t);

                    this.setDotProgress(0);
                    this.viewportY = -eased * vh * 0.5;
                    this.centerCanvasOnDot();
                    return;
                }

                const hScrolled = clamped - verticalLength;
                const t = horizontalLength > 0 ? hScrolled / horizontalLength : 0;

                this.viewportY = -vh * 0.5;
                this.setDotProgress(this.smoothstep(Math.max(0, Math.min(1, t))));
                this.centerCanvasOnDot();
            };

            window.addEventListener('scroll', this.onScroll, { passive: true });
            window.addEventListener('resize', this.onScroll, { passive: true });
            this.$nextTick(() => {
                requestAnimationFrame(() => {
                    this.measurePath();
                    this.onScroll();
                });
            });
        },
        beforeDestroy() {
            if (!this.onScroll) return;
            window.removeEventListener('scroll', this.onScroll);
            window.removeEventListener('resize', this.onScroll);
        },
        methods: {
            smoothstep(t) {
                return t * t * (3 - 2 * t);
            },
            measurePath() {
                const path = this.$refs.trackPath;
                if (!path || typeof path.getTotalLength !== 'function') return;

                const length = path.getTotalLength();
                if (length > 0) this.pathLength = length;
            },
            setDotProgress(progress) {
                const path = this.$refs.trackPath;
                if (!path) return;

                if (!this.pathLength && typeof path.getTotalLength === 'function') {
                    const length = path.getTotalLength();
                    if (length > 0) this.pathLength = length;
                }

                this.pathProgress = progress;

                if (!this.pathLength) return;

                const point = path.getPointAtLength(progress * this.pathLength);
                this.dot.x = point.x;
                this.dot.y = point.y;
            },
            getLayout() {
                const canvas = this.$refs.canvasWrap;
                const viewport = this.$refs.viewport;
                if (!canvas || !viewport) return null;

                const width = canvas.offsetWidth;
                const height = canvas.offsetHeight;
                if (!width || !height) return null;

                return {
                    dotPxX: (this.dot.x / VIEWBOX.w) * width,
                    dotPxY: (this.dot.y / VIEWBOX.h) * height,
                    centerX: viewport.clientWidth * 0.5,
                    centerY: viewport.clientHeight * 0.5,
                };
            },
            centerCanvasOnDot() {
                const layout = this.getLayout();
                if (!layout) return;

                this.canvasX = layout.centerX - layout.dotPxX;
                // viewportY 보정 — SVG 세로 이동해도 dot은 viewport 중앙 고정
                this.canvasY = layout.centerY - layout.dotPxY - this.viewportY;
            },
            getDotScreenY() {
                const sticky = this.$refs.story?.querySelector('.story__sticky');
                const layout = this.getLayout();
                if (!sticky || !layout) return null;

                const stickyRect = sticky.getBoundingClientRect();
                return stickyRect.top + this.viewportY + this.canvasY + layout.dotPxY;
            },
        },
    };
</script>

<style lang='scss' scoped>
    @use '@/assets/scss/base/variables.scss' as *;

    #story {
        position: relative;
        z-index: 2;
        background-color: $black;
        height: 250vh;

        .story__sticky {
            position: sticky;
            top: 0;
            height: 100vh;
            overflow: visible;
        }

        .story__viewport {
            width: 100%;
            height: 100%;
            overflow: visible;
            will-change: transform;
        }

        .story__canvas {
            width: calc(150vh * 2875 / 901);
            height: 150vh;
            transform-origin: 0 0;
            will-change: transform;
        }

        .story__svg {
            display: block;
            width: 100%;
            height: 100%;
            overflow: visible;
        }

        .story__track {
            fill: none;
            stroke: $white;
            stroke-width: 1px;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        .story__dot {
            fill: $white;
            filter: drop-shadow(0 0 6px rgba($white, 0.45));
        }
    }
</style>
