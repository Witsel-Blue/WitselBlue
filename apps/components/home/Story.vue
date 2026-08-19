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
                    <img
                        v-for='({ bp, index }) in imageBreakpoints'
                        :key='"bp-img-" + index'
                        class='story__bg-img'
                        :src='bp.image'
                        alt=''
                        :style='getBreakpointImageStyle(index)'
                    />
                    <div
                        v-for='({ bp, index }) in titleBreakpoints'
                        :key='"fixed-copy-" + index'
                        class='story__fixed-copy'
                        :style='getFixedCopyStyle(index)'
                    >
                        <h3 v-if='bp.title' class='story__title'>{{ bp.title }}</h3>
                        <p v-if='bp.company' class='story__company'>{{ bp.company }}</p>
                        <p v-if='bp.skills' class='story__skills'>{{ bp.skills }}</p>
                        <p v-if='bp.content' class='story__content'>{{ bp.content }}</p>
                        <p v-if='bp.year' class='story__year'>{{ bp.year }}</p>
                    </div>
                    <svg
                        ref='svg'
                        class='story__svg'
                        :viewBox='svgViewBox'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        aria-hidden='true'
                    >
                        <path
                            v-if='trackPathD'
                            ref='trackPath'
                            class='story__track'
                            :d='trackPathD'
                            :stroke-dasharray='pathLength'
                            :stroke-dashoffset='pathDashOffset'
                        />
                        <circle
                            v-for='(bp, i) in breakpoints'
                            :key='"bp-" + i'
                            class='story__breakpoint'
                            :class='{ "is-passed": pathProgress >= bp.progress }'
                            :cx='bp.x'
                            :cy='bp.y'
                            r='6'
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
            <div
                v-if='pathProgress > 0'
                class='story__copies'
            >
                <div
                    v-for='({ bp, index }) in subtitleBreakpoints'
                    :key='"copy-" + index'
                    class='story__copy'
                    :style='{ opacity: getSubtitleCopyOpacity(index) }'
                >
                    <p v-if='bp.subtitle' class='story__subtitle'>{{ bp.subtitle }}</p>
                    <p v-if='bp.desc' class='story__desc'>{{ bp.desc }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import storySvgUrl from '@/assets/img/home/story.svg';

    const DEFAULT_VIEWBOX = { w: 3571, h: 1265 };
    const VERTICAL_SCROLL_VH = 0.5;
    const HORIZONTAL_SCROLL_VH = 1;
    const BREAKPOINT_DEFS = [
        {
            progress: 0.05,
            subtitle: '줄음질',
            desc: '자개를 원하는 무늬대로 오려내어 나무기물의 표면에 붙이는 방법',
        },
        {
            progress: 0.16,
            // copyOffsetX: 300,
            // copyOffsetY: -250,
            title: 'Design and Development Education',
            company: 'SBS Academy',
            year: '2020',
            skills: 'Photoshop / Illustrator / HTML / CSS',
            content: 'Learned general planning, design, publishing of web development.',
        },
        {
            progress: 0.25,
            subtitle: '끊음질',
            desc: '자개를 자르는 방법',
            image: require('@/assets/img/home/story_img1.png'),
        },
        {
            progress: 0.35,
            title: 'Web Agency',
            company: 'Skunkworks Studio',
            year: 'April 2021 - April 2022',
            skills: 'Drupal / HTML / CSS / jQuery / GSAP',
            content: 'Frontend developer activities in a startup web agency company. I joined the company as a new hire and took sole responsibility for the entire frontend, building about eight new websites from scratch.',
        },
        {
            progress: 0.45,
            subtitle: '모조법',
            desc: '줄음질로 만든 무늬를 음각으로 세부묘사',
            image: require('@/assets/img/home/story_img2.png'),
        },
        {
            progress: 0.55,
            title: 'Major Company Project',
            company: 'Lisn Design',
            year: 'June 2024 - November 2024',
            skills: 'Vue / Nuxt / SCSS / javascript / Storybook / Lottie',
            content: 'Participated as a team member in the renewal of the Samsung Card Monimo app. Collaborated with a team of five developers to revamp over 1,400 pages within the project timeframe. Specifically responsible for redesigning the main card page using technologies such as Lottie and Swiper.',
        },
        {
            progress: 0.65,
            subtitle: '타발법',
            desc: '둥근 자개면을 평평하게 만듦',
            image: require('@/assets/img/home/story_img3.png'),
        },
        {
            progress: 0.78,
            title: '3D Configurator',
            company: 'Cusme Studio',
            year: 'January 2026 - April 2026',
            skills: 'React / Next /SCSS / three.js / GSAP / Lottie',
            content: 'Footwear sales startup. Proposed using a 3D configurator tool instead of traditional sketch-based planning; single-handedly managed the entire process—including planning, design, and development. Established workflows and reporting systems. Trained junior front-end staff.',
        },
    ];
    const LABEL_FADE_RANGE = 0.06;

    export default {
        name: 'HomeStory',
        data() {
            return {
                viewBox: { ...DEFAULT_VIEWBOX },
                trackPathD: '',
                dot: { x: 0, y: 0 },
                canvasX: 0,
                canvasY: 0,
                viewportY: 0,
                pathLength: 0,
                pathProgress: 0,
                scrollOrigin: null,
                breakpoints: [],
            };
        },
        computed: {
            imageBreakpoints() {
                return this.breakpoints
                    .map((bp, index) => ({ bp, index }))
                    .filter(({ bp }) => bp.image);
            },
            titleBreakpoints() {
                return this.breakpoints
                    .map((bp, index) => ({ bp, index }))
                    .filter(({ bp }) => bp.title);
            },
            subtitleBreakpoints() {
                return this.breakpoints
                    .map((bp, index) => ({ bp, index }))
                    .filter(({ bp }) => bp.subtitle);
            },
            svgViewBox() {
                return `0 0 ${this.viewBox.w} ${this.viewBox.h}`;
            },
            canvasStyle() {
                return {
                    transform: `translate3d(${this.canvasX}px, ${this.canvasY}px, 0)`,
                    width: `calc(150vh * ${this.viewBox.w} / ${this.viewBox.h})`,
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

            this.loadStoryTrack();

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
            svgToCanvasPx(x, y) {
                const canvas = this.$refs.canvasWrap;
                if (!canvas) return null;

                const width = canvas.offsetWidth;
                const height = canvas.offsetHeight;
                if (!width || !height) return null;

                return {
                    x: (x / this.viewBox.w) * width,
                    y: (y / this.viewBox.h) * height,
                };
            },
            getBreakpointImageStyle(index) {
                const bp = this.breakpoints[index];
                const px = bp ? this.svgToCanvasPx(bp.x, bp.y) : null;

                if (!px) {
                    return { opacity: 0 };
                }

                return {
                    left: `${px.x}px`,
                    top: `${px.y}px`,
                    opacity: this.getBreakpointCopyOpacity(index),
                };
            },
            getFixedCopyStyle(index) {
                const bp = this.breakpoints[index];
                const px = bp ? this.svgToCanvasPx(bp.x, bp.y) : null;

                if (!px) {
                    return { opacity: 0 };
                }

                return {
                    left: `${px.x}px`,
                    top: `${px.y}px`,
                    opacity: this.getBreakpointCopyOpacity(index),
                };
            },
            getNextSubtitleIndex(index) {
                for (let i = index + 1; i < BREAKPOINT_DEFS.length; i += 1) {
                    if (BREAKPOINT_DEFS[i].subtitle) return i;
                }

                return null;
            },
            getSubtitleCopyOpacity(index) {
                const bp = this.breakpoints[index];
                if (!bp?.subtitle || this.pathProgress <= 0) return 0;

                const fade = LABEL_FADE_RANGE;
                const p = this.pathProgress;
                const nextSubtitleIndex = this.getNextSubtitleIndex(index);
                let fadeOutAt = null;

                if (nextSubtitleIndex !== null) {
                    const nextBp = this.breakpoints[nextSubtitleIndex];
                    if (!nextBp) return 0;
                    fadeOutAt = nextBp.progress;
                }

                if (p < bp.progress) return 0;

                let opacity = 1;

                if (p < bp.progress + fade) {
                    opacity = this.smoothstep((p - bp.progress) / fade);
                }

                if (fadeOutAt !== null) {
                    if (p >= fadeOutAt) return 0;

                    if (p > fadeOutAt - fade) {
                        opacity *= this.smoothstep((fadeOutAt - p) / fade);
                    }
                }

                return opacity;
            },
            getBreakpointCopyOpacity(index) {
                const bp = this.breakpoints[index];
                if (!bp || this.pathProgress <= 0) return 0;

                const fade = LABEL_FADE_RANGE;
                const next = this.breakpoints[index + 1];
                const p = this.pathProgress;

                if (p < bp.progress) return 0;

                let opacity = 1;

                if (p < bp.progress + fade) {
                    opacity = this.smoothstep((p - bp.progress) / fade);
                }

                if (next) {
                    if (p >= next.progress) return 0;

                    if (p > next.progress - fade) {
                        opacity *= this.smoothstep((next.progress - p) / fade);
                    }
                }

                return opacity;
            },
            async loadStoryTrack() {
                try {
                    const response = await fetch(storySvgUrl);
                    const text = await response.text();
                    const doc = new DOMParser().parseFromString(
                        text,
                        'image/svg+xml',
                    );
                    const svg = doc.querySelector('svg');
                    const path = doc.querySelector('path');

                    if (svg) {
                        const viewBox = svg.getAttribute('viewBox');
                        if (viewBox) {
                            const parts = viewBox.trim().split(/[\s,]+/).map(Number);
                            if (parts.length === 4) {
                                this.viewBox = { w: parts[2], h: parts[3] };
                            }
                        } else {
                            const width = Number(svg.getAttribute('width'));
                            const height = Number(svg.getAttribute('height'));
                            if (width && height) {
                                this.viewBox = { w: width, h: height };
                            }
                        }
                    }

                    if (path) {
                        this.trackPathD = path.getAttribute('d') || '';
                    }
                } catch (error) {
                    console.error('[Story] failed to load story.svg', error);
                }

                this.$nextTick(() => {
                    requestAnimationFrame(() => {
                        this.measurePath();
                        this.buildBreakpoints();
                        if (this.onScroll) this.onScroll();
                    });
                });
            },
            buildBreakpoints() {
                const path = this.$refs.trackPath;
                if (!path || !this.pathLength) {
                    this.breakpoints = [];
                    return;
                }

                this.breakpoints = BREAKPOINT_DEFS.map((bp) => {
                    const point = path.getPointAtLength(bp.progress * this.pathLength);

                    return {
                        ...bp,
                        x: point.x,
                        y: point.y,
                    };
                });
            },
            measurePath() {
                const path = this.$refs.trackPath;
                if (!path || typeof path.getTotalLength !== 'function') return;

                const length = path.getTotalLength();
                if (length > 0) {
                    this.pathLength = length;
                    this.buildBreakpoints();
                }
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
                    dotPxX: (this.dot.x / this.viewBox.w) * width,
                    dotPxY: (this.dot.y / this.viewBox.h) * height,
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
    @use '@/assets/scss/base/variables' as *;

    #story {
        position: relative;
        z-index: 2;
        background-color: $black;
        height: 250vh;

        .story {
            &__sticky {
                position: sticky;
                top: 0;
                height: 100vh;
                overflow: visible;
            }

            &__viewport {
                width: 100%;
                height: 100%;
                overflow: visible;
                will-change: transform;
            }

            &__canvas {
                position: relative;
                height: 150vh;
                transform-origin: 0 0;
                will-change: transform;
            }

            &__bg-img {
                z-index: 0;
                width: auto;
                height: 60vh;
                position: absolute;
                transform: translate(-50%, -50%);
                will-change: opacity;
                object-fit: contain;
                pointer-events: none;

                &:nth-child(2) {
                    width: auto;
                    height: 40vh;
                }

                &:nth-child(3) {
                    width: auto;
                    height: 50vh;
                }
            }

            &__fixed-copy {
                position: absolute;
                z-index: 0;
                width: min(36vw, 320px);
                transform: translate(-50%, -50%);
                pointer-events: none;
                will-change: opacity;
            }

            &__svg {
                position: relative;
                z-index: 1;
                display: block;
                width: 100%;
                height: 100%;
                overflow: visible;
            }

            &__track {
                fill: none;
                stroke: $white;
                stroke-width: 1px;
                stroke-linecap: round;
                stroke-linejoin: round;
            }

            &__dot {
                fill: $white;
                filter: drop-shadow(0 0 6px rgba($white, 0.45));
            }

            // &__breakpoint {
            //     fill: rgba($white, 0.25);
            //     stroke: rgba($white, 0.5);
            //     stroke-width: 1px;
            //     transition: fill 0.25s ease, stroke 0.25s ease;

            //     &.is-passed {
            //         fill: rgba($white, 0.85);
            //         stroke: $white;
            //     }
            // }

            &__copies {
                position: absolute;
                left: 50%;
                bottom: 18vh;
                z-index: 2;
                width: 0;
                height: 0;
                pointer-events: none;
            }

            &__copy {
                position: absolute;
                left: 50%;
                bottom: 0;
                transform: translateX(-50%);
                width: min(80vw, 420px);
                text-align: center;
                will-change: opacity;
            }

            &__year {
                margin: 0.75rem 0 0;
                font-family: $ft-basic, sans-serif;
                font-size: 0.875rem;
                letter-spacing: 0.12em;
                color: $gray1;
            }

            &__title {
                margin: 0;
                font-family: $ft-basic, sans-serif;
                font-size: 1.4rem;
                letter-spacing: 0.08em;
                color: $white;
            }

            &__company {
                margin: 0.5rem 0 0;
                font-family: $ft-basic, sans-serif;
                font-size: 1rem;
                color: $white;
            }

            &__skills {
                margin: 0.35rem 0 0;
                font-family: $ft-basic, sans-serif;
                font-size: 0.875rem;
                color: $gray1;
            }

            &__subtitle {
                margin: 0;
                font-family: $ft-basic, sans-serif;
                font-size: 1rem;
                color: $gray1;
            }

            &__desc {
                margin: 1rem 0 0;
                font-family: $ft-basic, sans-serif;
                font-size: 0.95rem;
                line-height: 1.5;
                color: $white;
            }

            &__content {
                margin: 0.75rem 0 0;
                font-family: $ft-basic, sans-serif;
                font-size: 0.875rem;
                line-height: 1.6;
                color: $gray1;
            }
        }
    }
</style>
