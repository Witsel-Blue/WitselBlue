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
                        <h3 v-if='bp.title' class='title'>{{ bp.title }}</h3>
                        <p v-if='bp.company' class='company'>{{ bp.company }}</p>
                        <p v-if='bp.skills' class='skills'>{{ bp.skills }}</p>
                        <p v-if='bp.content' class='content'>{{ bp.content }}</p>
                        <p v-if='bp.year' class='year'>{{ bp.year }}</p>
                    </div>
                    <svg
                        ref='svg'
                        class='story__svg'
                        :viewBox='svgViewBox'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        aria-hidden='true'
                    >
                        <defs>
                            <linearGradient
                                id='story-trail-core'
                                gradientUnits='userSpaceOnUse'
                                :x1='trailLinear.x1'
                                :y1='trailLinear.y1'
                                :x2='trailLinear.x2'
                                :y2='trailLinear.y2'
                            >
                                <stop offset='0%' stop-color='#ece8da' stop-opacity='0' />
                                <stop offset='20%' stop-color='#ece8da' :stop-opacity='trailCoreMidOpacity' />
                                <stop offset='55%' stop-color='#ece8da' :stop-opacity='trailCoreHeadOpacity' />
                                <stop offset='100%' stop-color='#ece8da' stop-opacity='1' />
                            </linearGradient>
                            <linearGradient
                                id='story-trail-glow-gradient'
                                gradientUnits='userSpaceOnUse'
                                :x1='trailLinear.x1'
                                :y1='trailLinear.y1'
                                :x2='trailLinear.x2'
                                :y2='trailLinear.y2'
                            >
                                <stop offset='0%' stop-color='#ece8da' stop-opacity='0' />
                                <stop offset='25%' stop-color='#ece8da' stop-opacity='0' />
                                <stop offset='55%' stop-color='#ece8da' :stop-opacity='trailGlowMidOpacity' />
                                <stop offset='100%' stop-color='#ece8da' :stop-opacity='trailGlowHeadOpacity' />
                            </linearGradient>
                            <filter
                                id='story-trail-core-soft'
                                x='-30%'
                                y='-30%'
                                width='160%'
                                height='160%'
                            >
                                <feGaussianBlur :stdDeviation='trailCoreBlur' />
                            </filter>
                            <filter
                                id='story-trail-glow'
                                x='-100%'
                                y='-100%'
                                width='300%'
                                height='300%'
                            >
                                <feGaussianBlur :stdDeviation='trailGlowBlur' />
                            </filter>
                        </defs>
                        <path
                            v-if='trackPathD'
                            class='story__track story__track--glow'
                            :d='trackPathD'
                            :stroke-dasharray='trailDashArray'
                            :stroke-dashoffset='trailDashOffset'
                            :style='{ opacity: trailGlowLayerOpacity }'
                        />
                        <path
                            v-if='trackPathD'
                            ref='trackPath'
                            class='story__track story__track--core'
                            :d='trackPathD'
                            :stroke-dasharray='trailDashArray'
                            :stroke-dashoffset='trailDashOffset'
                            :style='{ opacity: trailCoreLayerOpacity }'
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
                            r='1'
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
                    <p v-if='bp.subtitle' class='subtitle'>{{ bp.subtitle }}</p>
                    <p v-if='bp.desc' class='desc'>{{ bp.desc }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import storySvgUrl from '@/assets/img/home/story.svg';

    const DEFAULT_VIEWBOX = { w: 3571, h: 1265 };
    const CANVAS_HEIGHT_VH = 200;
    const VIEWPORT_OFFSET_VH = (CANVAS_HEIGHT_VH - 100) / 100;
    const VERTICAL_SCROLL_VH = 0.5;
    const HORIZONTAL_SCROLL_VH = 1 * (CANVAS_HEIGHT_VH / 150);
    const BREAKPOINT_DEFS = [
        {
            progress: 0.1,
            subtitleKey: 'home.storySubtitle1',
            descKey: 'home.storyDesc1',
        },
        {
            progress: 0.23,
            subtitleKey: 'home.storySubtitle2',
            descKey: 'home.storyDesc2',
            image: require('@/assets/img/home/story_img1.png'),
        },
        {
            progress: 0.33,
            titleKey: 'home.storyTitle1',
            companyKey: 'home.storyCompany1',
            yearKey: 'home.storyYear1',
            skillsKey: 'home.storySkills1',
            contentKey: 'home.storyContent1',
        },
        {
            progress: 0.43,
            subtitleKey: 'home.storySubtitle3',
            descKey: 'home.storyDesc3',
            image: require('@/assets/img/home/story_img2.png'),
        },
        {
            progress: 0.53,
            titleKey: 'home.storyTitle2',
            companyKey: 'home.storyCompany2',
            yearKey: 'home.storyYear2',
            skillsKey: 'home.storySkills2',
            contentKey: 'home.storyContent2',
        },
        {
            progress: 0.64,
            subtitleKey: 'home.storySubtitle4',
            descKey: 'home.storyDesc4',
            image: require('@/assets/img/home/story_img3.png'),
        },
        {
            progress: 0.78,
            titleKey: 'home.storyTitle3',
            companyKey: 'home.storyCompany3',
            yearKey: 'home.storyYear3',
            skillsKey: 'home.storySkills3',
            contentKey: 'home.storyContent3',
        },
    ];
    const LABEL_FADE_RANGE = 0.03;
    const TRAIL_LENGTH_VMIN = 1;
    const TRAIL_VELOCITY_PX_GAIN = 220;
    const TRAIL_IDLE_DECAY_PX_PER_MS = 0.055;
    const TRAIL_RESUME_EXTEND_PX_PER_MS = 0.055;
    const TRAIL_SCROLL_LERP = 0.16;
    const TRAIL_GROW_LERP = 0.11;
    const TRAIL_REVEAL_LERP = 0.08;
    const TRAIL_VELOCITY_IDLE_MS = 160;
    const SUBTITLE_COMPLETE_FADE_START = 0.88;
    const SUBTITLE_COMPLETE_FADE_END = 1;

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
                trailTailProgress: 0,
                trailTailPoint: { x: 0, y: 0 },
                trailActivePx: 0,
                trailReveal: 1,
                trailWasCollapsed: false,
                trailScrollDir: 1,
                scrollVelocity: 0,
                trailLastProgress: 0,
                trailLastProgressTime: 0,
                trailRafId: null,
                trailLastTick: 0,
                velocityResetTimer: null,
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
                const { w, h } = this.viewBox;

                return {
                    transform: `translate3d(${this.canvasX}px, ${this.canvasY}px, 0)`,
                    width: `calc(${CANVAS_HEIGHT_VH}vh * ${w} / ${h})`,
                    height: `${CANVAS_HEIGHT_VH}vh`,
                };
            },
            viewportStyle() {
                return {
                    transform: `translate3d(0, ${this.viewportY}px, 0)`,
                };
            },
            trailDashArray() {
                if (!this.pathLength) return '0 99999';

                const near = Math.min(this.pathProgress, this.trailTailProgress);
                const far = Math.max(this.pathProgress, this.trailTailProgress);
                const visible = Math.max(0, (far - near) * this.pathLength);

                if (visible <= 0) return `0 ${this.pathLength}`;

                return `${visible} ${this.pathLength}`;
            },
            trailDashOffset() {
                if (!this.pathLength) return 99999;

                const near = Math.min(this.pathProgress, this.trailTailProgress);

                return -(near * this.pathLength);
            },
            trailLinear() {
                return {
                    x1: this.trailTailPoint.x,
                    y1: this.trailTailPoint.y,
                    x2: this.dot.x,
                    y2: this.dot.y,
                };
            },
            trailSpan() {
                return Math.abs(this.pathProgress - this.trailTailProgress);
            },
            trailSpanPx() {
                return this.trailSpan * this.pathLength * this.getCanvasScale();
            },
            targetTrailPx() {
                const vmin = this.getViewportMin();
                const base = vmin * TRAIL_LENGTH_VMIN;
                const speed = Math.min(
                    Math.abs(this.scrollVelocity) * TRAIL_VELOCITY_PX_GAIN,
                    vmin * 0.3,
                );

                return base + speed;
            },
            trailExtensionRatio() {
                if (this.trailActivePx <= 0) return 0;

                return Math.min(1, this.trailSpanPx / this.trailActivePx);
            },
            trailResumeOpacityFactor() {
                if (!this.trailWasCollapsed && this.trailReveal >= 0.99) return 1;

                const t = this.trailExtensionRatio;

                return t * t * (3 - 2 * t);
            },
            trailFadeRatio() {
                const target = this.targetTrailPx;
                if (target <= 0) return 0;

                return Math.min(1, this.trailSpanPx / target);
            },
            trailCoreBlur() {
                return 0.25 + (1 - this.trailFadeRatio) * 0.15;
            },
            trailGlowBlur() {
                const ratio = this.trailFadeRatio;
                return 0.8 + (1 - ratio) * 5.5 + ratio * 1.2;
            },
            trailGlowMidOpacity() {
                return (0.1 + this.trailFadeRatio * 0.28) * this.trailResumeOpacityFactor;
            },
            trailCoreMidOpacity() {
                return 0.08 * this.trailResumeOpacityFactor;
            },
            trailCoreHeadOpacity() {
                const head = 0.5 + this.trailFadeRatio * 0.5;
                const factor = this.trailWasCollapsed
                    ? 0.4 + this.trailResumeOpacityFactor * 0.6
                    : 1;

                return head * factor;
            },
            trailGlowHeadOpacity() {
                const head = 0.2 + this.trailFadeRatio * 0.35;
                const factor = this.trailWasCollapsed
                    ? 0.35 + this.trailResumeOpacityFactor * 0.65
                    : 1;

                return head * factor;
            },
            trailCoreLayerOpacity() {
                if (this.trailSpan <= 0) return 0;

                return Math.min(
                    1,
                    (0.65 + this.trailFadeRatio * 0.35)
                        * this.trailReveal
                        * this.trailResumeOpacityFactor,
                );
            },
            trailGlowLayerOpacity() {
                if (this.trailSpan <= 0) return 0;

                return Math.min(
                    1,
                    this.trailFadeRatio * 0.95 * this.trailReveal * this.trailResumeOpacityFactor,
                );
            },
            subtitleCompletionOpacity() {
                const p = this.pathProgress;

                if (p <= SUBTITLE_COMPLETE_FADE_START) return 1;
                if (p >= SUBTITLE_COMPLETE_FADE_END) return 0;

                const t = (p - SUBTITLE_COMPLETE_FADE_START)
                    / (SUBTITLE_COMPLETE_FADE_END - SUBTITLE_COMPLETE_FADE_START);

                return 1 - this.smoothstep(Math.max(0, Math.min(1, t)));
            },
        },
        watch: {
            '$i18n.locale'() {
                this.buildBreakpoints();
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

                if (this.scrollOrigin === null) {
                    this.viewportY = 0;
                    this.setDotProgress(0);
                    this.centerCanvasOnDot();

                    const dotScreenY = this.getDotScreenY();
                    if (dotScreenY === null) return;
                    if (dotScreenY > vh * 0.5) return;

                    this.scrollOrigin = rawScrolled;
                }

                if (rawScrolled < this.scrollOrigin) {
                    this.scrollOrigin = null;
                    this.resetTrailState();
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
                    this.viewportY = -eased * vh * VIEWPORT_OFFSET_VH;
                    this.centerCanvasOnDot();
                    return;
                }

                const hScrolled = clamped - verticalLength;
                const t = horizontalLength > 0 ? hScrolled / horizontalLength : 0;

                this.viewportY = -vh * VIEWPORT_OFFSET_VH;
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
            this.stopTrailLoop();
            if (this.velocityResetTimer) clearTimeout(this.velocityResetTimer);
        },
        methods: {
            resetTrailState() {
                this.pathProgress = 0;
                this.trailTailProgress = 0;
                this.trailActivePx = 0;
                this.trailReveal = 1;
                this.trailWasCollapsed = false;
                this.trailScrollDir = 1;
                this.scrollVelocity = 0;
                this.trailLastProgress = 0;
                this.trailLastProgressTime = 0;
                this.updateTrailTailPoint();
                this.stopTrailLoop();
            },
            getViewportMin() {
                const viewport = this.$refs.viewport;
                if (!viewport) return 360;

                return Math.min(viewport.clientWidth, viewport.clientHeight);
            },
            getCanvasScale() {
                const canvas = this.$refs.canvasWrap;
                if (!canvas?.offsetWidth) return 1;

                return canvas.offsetWidth / this.viewBox.w;
            },
            markTrailScroll(progress) {
                if (progress <= 0) {
                    this.trailTailProgress = 0;
                    this.trailActivePx = 0;
                    this.trailReveal = 1;
                    this.trailWasCollapsed = false;
                    this.trailScrollDir = 1;
                    this.scrollVelocity = 0;
                    this.updateTrailTailPoint();
                    this.stopTrailLoop();
                    return;
                }

                const now = performance.now();
                const delta = progress - this.trailLastProgress;

                if (this.trailLastProgressTime) {
                    const dt = now - this.trailLastProgressTime;
                    if (dt > 0 && dt < 140) {
                        this.scrollVelocity = delta / dt;
                    }
                }

                if (Math.abs(delta) > 0.000001) {
                    const newDir = delta > 0 ? 1 : -1;
                    const spanPx =
                        Math.abs(progress - this.trailTailProgress)
                        * this.pathLength
                        * this.getCanvasScale();

                    if (
                        this.trailLastProgress > 0
                        && newDir !== this.trailScrollDir
                        && spanPx > 0.5
                    ) {
                        this.trailTailProgress = progress;
                        this.trailActivePx = 0;
                        this.trailReveal = 0;
                        this.trailWasCollapsed = true;
                        this.updateTrailTailPoint();
                    }

                    this.trailScrollDir = newDir;
                }

                this.trailLastProgress = progress;
                this.trailLastProgressTime = now;

                if (this.velocityResetTimer) clearTimeout(this.velocityResetTimer);
                this.velocityResetTimer = setTimeout(() => {
                    this.scrollVelocity = 0;
                }, TRAIL_VELOCITY_IDLE_MS);

                this.startTrailLoop();
            },
            startTrailLoop() {
                if (this.trailRafId) return;
                this.trailLastTick = performance.now();
                this.trailRafId = requestAnimationFrame((time) => this.tickTrail(time));
            },
            stopTrailLoop() {
                if (!this.trailRafId) return;
                cancelAnimationFrame(this.trailRafId);
                this.trailRafId = null;
            },
            shouldGlueTrailTailToHead() {
                if (!this.trailWasCollapsed && this.trailReveal >= 0.02) return false;

                return this.trailSpanPx < 0.5;
            },
            resolveTailProgress(headProgress, trailPx, direction = this.trailScrollDir) {
                const path = this.$refs.trackPath;
                if (!path || !this.pathLength || trailPx <= 0) return headProgress;

                const scale = this.getCanvasScale();
                const targetSvgLen = trailPx / scale;
                const headLen = headProgress * this.pathLength;
                let len = headLen;
                let walked = 0;
                let prev = path.getPointAtLength(len);
                const step = Math.max(1.5, this.pathLength * 0.002);

                if (direction >= 0) {
                    while (walked < targetSvgLen && len > 0) {
                        len = Math.max(0, len - step);
                        const point = path.getPointAtLength(len);
                        walked += Math.hypot(point.x - prev.x, point.y - prev.y);
                        prev = point;
                    }
                } else {
                    while (walked < targetSvgLen && len < this.pathLength) {
                        len = Math.min(this.pathLength, len + step);
                        const point = path.getPointAtLength(len);
                        walked += Math.hypot(point.x - prev.x, point.y - prev.y);
                        prev = point;
                    }
                }

                return len / this.pathLength;
            },
            clampTrailTailToMaxSpan(head) {
                if (!this.pathLength || head <= 0 || this.trailActivePx <= 0.5) return;

                const bound = this.resolveTailProgress(head, this.trailActivePx);

                if (this.trailScrollDir >= 0) {
                    this.trailTailProgress = Math.max(this.trailTailProgress, bound);
                } else {
                    this.trailTailProgress = Math.min(this.trailTailProgress, bound);
                }
            },
            extendTrailSpanByPx(head, maxPx, targetSpanPx) {
                if (!this.pathLength || maxPx <= 0) return;

                const scale = this.getCanvasScale();
                const headLen = head * this.pathLength;
                const extentLen = this.trailTailProgress * this.pathLength;
                const currentSpanPx = Math.abs(headLen - extentLen) * scale;
                const nextSpanPx = Math.min(
                    Math.max(0, targetSpanPx),
                    currentSpanPx + maxPx,
                );

                if (this.trailScrollDir >= 0) {
                    this.trailTailProgress = (headLen - nextSpanPx / scale) / this.pathLength;
                } else {
                    this.trailTailProgress = (headLen + nextSpanPx / scale) / this.pathLength;
                }
            },
            clampTrailExtentToHead(head) {
                if (this.trailScrollDir >= 0) {
                    this.trailTailProgress = Math.max(0, Math.min(this.trailTailProgress, head));
                } else {
                    this.trailTailProgress = Math.min(1, Math.max(this.trailTailProgress, head));
                }
            },
            tickTrail(timestamp) {
                const dt = Math.min(Math.max(timestamp - this.trailLastTick, 0), 32);
                this.trailLastTick = timestamp;

                const head = this.pathProgress;

                if (head <= 0) {
                    this.trailTailProgress = 0;
                    this.updateTrailTailPoint();
                    this.trailRafId = null;
                    return;
                }

                const targetPx = this.targetTrailPx;
                const isScrolling = Math.abs(this.scrollVelocity) > 0.000008;

                if (isScrolling) {
                    const growLerp = 1 - (1 - TRAIL_GROW_LERP) ** (dt / 16.67);
                    this.trailActivePx += (targetPx - this.trailActivePx) * growLerp;

                    const resumeExtendPx = TRAIL_RESUME_EXTEND_PX_PER_MS * dt;
                    const needsResumeExtend =
                        this.trailWasCollapsed
                        || this.trailReveal < 0.99
                        || this.trailExtensionRatio < 0.98;

                    if (needsResumeExtend) {
                        this.extendTrailSpanByPx(
                            head,
                            resumeExtendPx,
                            this.trailActivePx,
                        );

                        const revealLerp = 1 - (1 - TRAIL_REVEAL_LERP) ** (dt / 16.67);
                        this.trailReveal = Math.min(
                            1,
                            this.trailReveal + (1 - this.trailReveal) * revealLerp,
                        );

                        if (
                            this.trailWasCollapsed
                            && this.trailReveal > 0.98
                            && this.trailExtensionRatio > 0.98
                        ) {
                            this.trailWasCollapsed = false;
                            this.trailReveal = 1;
                        }
                    } else {
                        this.trailReveal = 1;

                        const targetTail = this.resolveTailProgress(head, this.trailActivePx);
                        const lerp = 1 - (1 - TRAIL_SCROLL_LERP) ** (dt / 16.67);
                        const prevTail = this.trailTailProgress;
                        let nextTail = prevTail + (targetTail - prevTail) * lerp;

                        const maxTailDeltaPx = resumeExtendPx * 1.35;
                        const scale = this.getCanvasScale();
                        const maxTailDelta =
                            maxTailDeltaPx / (this.pathLength * scale);

                        if (targetTail < prevTail) {
                            nextTail = Math.max(nextTail, prevTail - maxTailDelta);
                        } else if (targetTail > prevTail) {
                            nextTail = Math.min(nextTail, prevTail + maxTailDelta);
                        }

                        if (this.trailScrollDir >= 0) {
                            nextTail = Math.min(nextTail, head);
                            nextTail = Math.min(nextTail, targetTail);
                        } else {
                            nextTail = Math.max(nextTail, head);
                            nextTail = Math.max(nextTail, targetTail);
                        }

                        this.trailTailProgress = nextTail;
                    }
                } else {
                    const scale = this.getCanvasScale();
                    const headLen = head * this.pathLength;
                    const extentLen = this.trailTailProgress * this.pathLength;
                    const spanPx = Math.abs(headLen - extentLen) * scale;

                    if (spanPx <= 0.5) {
                        this.trailTailProgress = head;
                        this.trailActivePx = 0;
                        this.trailReveal = 0;
                        this.trailWasCollapsed = true;
                    } else {
                        const decayBoost = 1 + (spanPx / Math.max(targetPx, 1)) * 0.35;
                        const decayPx = TRAIL_IDLE_DECAY_PX_PER_MS * dt * decayBoost;

                        if (this.trailScrollDir >= 0) {
                            const nextExtentLen = Math.min(headLen, extentLen + decayPx / scale);
                            this.trailTailProgress = nextExtentLen / this.pathLength;
                        } else {
                            const nextExtentLen = Math.max(headLen, extentLen - decayPx / scale);
                            this.trailTailProgress = nextExtentLen / this.pathLength;
                        }
                    }
                }

                this.clampTrailExtentToHead(head);
                this.clampTrailTailToMaxSpan(head);
                this.updateTrailTailPoint();

                if (
                    head > 0
                    && (
                        this.trailSpan > 0.00005
                        || this.trailReveal < 0.99
                        || (isScrolling && this.trailWasCollapsed)
                    )
                ) {
                    this.trailRafId = requestAnimationFrame((time) => this.tickTrail(time));
                } else {
                    this.trailRafId = null;
                }
            },
            updateTrailTailPoint() {
                const path = this.$refs.trackPath;
                if (!path || !this.pathLength) return;

                const point = path.getPointAtLength(
                    this.trailTailProgress * this.pathLength,
                );
                this.trailTailPoint = { x: point.x, y: point.y };
            },
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
                    if (BREAKPOINT_DEFS[i].subtitleKey) return i;
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

                return opacity * this.subtitleCompletionOpacity;
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

                this.breakpoints = BREAKPOINT_DEFS.map((def) => {
                    const point = path.getPointAtLength(def.progress * this.pathLength);
                    const bp = {
                        progress: def.progress,
                        x: point.x,
                        y: point.y,
                    };

                    if (def.image) bp.image = def.image;
                    if (def.subtitleKey) bp.subtitle = this.$t(def.subtitleKey);
                    if (def.descKey) bp.desc = this.$t(def.descKey);
                    if (def.titleKey) bp.title = this.$t(def.titleKey);
                    if (def.companyKey) bp.company = this.$t(def.companyKey);
                    if (def.yearKey) bp.year = this.$t(def.yearKey);
                    if (def.skillsKey) bp.skills = this.$t(def.skillsKey);
                    if (def.contentKey) bp.content = this.$t(def.contentKey);

                    return bp;
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

                if (this.shouldGlueTrailTailToHead()) {
                    this.trailTailProgress = progress;
                    this.trailTailPoint = { x: point.x, y: point.y };
                } else if (
                    progress > 0
                    && this.trailLastProgress <= 0
                    && this.trailTailProgress <= 0
                    && !this.trailWasCollapsed
                ) {
                    this.trailTailProgress = progress;
                    this.trailTailPoint = { x: point.x, y: point.y };
                    this.trailScrollDir = 1;
                }

                this.markTrailScroll(progress);

                if (!this.shouldGlueTrailTailToHead()) {
                    this.updateTrailTailPoint();
                }
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
        height: 300vh;
        margin-top: -80vh;

        .story__sticky {
            position: sticky;
            top: 0;
            height: 100vh;
            overflow: visible;

            .story__viewport {
                width: 100%;
                height: 100%;
                overflow: visible;
                will-change: transform;

                .story__canvas {
                    position: relative;
                    transform-origin: 0 0;
                    will-change: transform;

                    .story__bg-img {
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

                    .story__fixed-copy {
                        position: absolute;
                        z-index: 2;
                        width: 40vw;
                        transform: translate(0, -100%);
                        pointer-events: none;
                        will-change: opacity;
                        // background-color: rgba($black, 0.4);
                        // padding: 1rem;
                        // border-radius: 16px;
                        // backdrop-filter: blur(4px);

                        &:nth-of-type(2) {
                            transform: translate(0, 0);
                        }

                        &:nth-of-type(3) {
                            transform: translate(0, -50%);
                        }

                        .title {
                            font-size: 2.5rem;
                            line-height: 1;
                            font-family: $ft-orangeavenue, $ft-sungkokserif;
                            text-shadow: $text-shadow-black;
                        }

                        .company {
                            margin-top: 0.5rem;
                            font-size: 1.5rem;
                            font-weight: 500;
                            color: $gray2;
                            text-shadow: $text-shadow-black;
                        }

                        .skills {
                            margin-top: 0.5rem;
                            font-size: 1.2rem;
                            font-weight: 500;
                            color: $gray2;
                            text-shadow: $text-shadow-black;
                        }

                        .content {
                            margin-top: 0.5rem;
                            font-size: 1rem;
                            color: $gray2;
                            text-shadow: $text-shadow-black;
                        }

                        .year {
                            margin-top: 1rem;
                            font-size: 1.2rem;
                            font-weight: 500;
                            color: $gray1;
                            text-shadow: $text-shadow-black;
                        }
                    }

                    .story__svg {
                        position: relative;
                        z-index: 1;
                        display: block;
                        width: 100%;
                        height: 100%;
                        overflow: visible;
                        mix-blend-mode: difference;

                        .story__track {
                            fill: none;
                            stroke-linecap: round;
                            stroke-linejoin: round;

                            &--core {
                                stroke: url(#story-trail-core);
                                stroke-width: 1px;
                                filter: url(#story-trail-core-soft);
                            }

                            &--glow {
                                stroke: url(#story-trail-glow-gradient);
                                stroke-width: 2px;
                                filter: url(#story-trail-glow);
                            }
                        }

                        // .story__breakpoint {
                        //     fill: rgba($white, 0.25);
                        //     stroke: rgba($white, 0.5);
                        //     stroke-width: 1px;
                        //     transition: fill 0.25s ease, stroke 0.25s ease;

                        //     &.is-passed {
                        //         fill: rgba($white, 0.85);
                        //         stroke: $white;
                        //     }
                        // }

                        .story__dot {
                            fill: none;
                        }
                    }
                }
            }

            .story__copies {
                position: absolute;
                left: 50%;
                bottom: 5vw;
                z-index: 2;
                width: 0;
                height: 0;
                pointer-events: none;

                .story__copy {
                    position: absolute;
                    left: 50%;
                    bottom: 0;
                    transform: translateX(-50%);
                    width: 80vw;
                    text-align: center;
                    will-change: opacity;

                    .subtitle {
                        font-size: 1.2rem;
                        font-weight: 600;
                        font-family: $ft-orangeavenue, $ft-sungkokserif;
                    }

                    .desc {
                        margin-top: 0.25rem;
                        font-size: 1rem;
                        color: $gray2;
                    }
                }
            }
        }
    }

    @media (max-width: $mobile) {
        #story {
            .story__sticky {
                .story__viewport {
                    .story__canvas {
                        .story__bg-img {
                            width: 90vw !important;
                            height: auto !important;
                            transform: translate(0, -50%) !important;

                            &:nth-child(3) {
                                transform: translate(0, -100%) !important;
                            }
                        }

                        .story__fixed-copy {
                            width: 90vw;

                            &:nth-of-type(2) {
                                transform: translate(0, -50%);
                            }

                            &:nth-of-type(3) {
                                transform: translate(0, -50%);
                            }

                            .company {
                                margin-top: 0;
                                font-size: 1.2rem;
                            }

                            .skills {
                                margin-top: 0;
                                font-size: 1rem;
                            }

                            .year {
                                margin-top: 0.5rem;
                                font-size: 1rem;
                            }
                        }
                    }
                }

                .story__copies {
                    bottom: 15vw;

                    .story__copy {
                        width: 90vw;

                        .desc {
                            margin-top: 0;
                        }
                    }
                }
            }
        }
    }
</style>
