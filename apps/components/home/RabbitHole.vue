<template>
    <div
        id='rabbit-hole'
        :class='{ "is-revealed": throughReveal > 0.99 }'
        :style='rootStyle'
    >
        <div
            class='rabbit-hole__sticky'
            :style='stickyStyle'
        >
            <FoldingScreen
                :scroll-progress='colorProgress'
                :layer-reveal='foldingLayerReveal'
                :active='throughReveal > 0.55'
            />
            <RabbitHoleLists
                :scroll-progress='listProgress'
                :fog-color='stickyStyle.backgroundColor'
                :active='throughReveal > 0.55'
            />
        </div>
    </div>
</template>

<script>
    import RabbitHoleLists from '@/components/home/RabbitHoleLists.vue';
    import FoldingScreen from '@/components/home/FoldingScreen.vue';

    const COLOR_FROM = '#1D1D1D';
    const COLOR_TO = '#ece8da';
    const LIST_VISIBLE_AT = 0.85;
    const LIST_COUNT = 6;
    const LIST_SCROLL_VH = 40 + LIST_COUNT * 120;
    const ZOOM_HOLD_VH = 220;
    const RABBIT_HOLE_VH = 100 + LIST_SCROLL_VH + ZOOM_HOLD_VH;
    const LIST_END_AT = LIST_SCROLL_VH / (LIST_SCROLL_VH + ZOOM_HOLD_VH);
    const LIST_CAMERA_Z = 50;
    const LIST_START_DIST = 270;
    const LIST_PASS_DIST = 80;
    const LIST_DEPTH_STEP = 100;
    const LIST_FOG_FAR = 300;
    const FOLDING_FROM_BACK = 0;

    function parseHex(hex) {
        const value = hex.replace('#', '');
        return [
            parseInt(value.slice(0, 2), 16),
            parseInt(value.slice(2, 4), 16),
            parseInt(value.slice(4, 6), 16),
        ];
    }

    function lerpHex(from, to, t) {
        const a = parseHex(from);
        const b = parseHex(to);
        return `#${[0, 1, 2]
            .map((i) => Math.round(a[i] + (b[i] - a[i]) * t)
                .toString(16)
                .padStart(2, '0'))
            .join('')}`;
    }

    export default {
        name: 'RabbitHole',
        components: {
            RabbitHoleLists,
            FoldingScreen,
        },
        data() {
            return {
                throughReveal: 0,
                colorProgress: 0,
            };
        },
        computed: {
            rootStyle() {
                return {
                    opacity: this.throughReveal,
                    height: `${RABBIT_HOLE_VH}vh`,
                };
            },
            stickyStyle() {
                const t = this.colorProgress;
                return {
                    backgroundColor: lerpHex(COLOR_FROM, COLOR_TO, t),
                    color: lerpHex(COLOR_TO, COLOR_FROM, t),
                };
            },
            // 섹션이 충분히 보인 뒤에만 리스트 Z 이동.
            // 리스트는 줌 홀드 구간 전에 끝난다.
            listProgress() {
                if (this.throughReveal < LIST_VISIBLE_AT) return 0;
                return this.clamp(this.colorProgress / LIST_END_AT, 0, 1);
            },
            foldingLayerReveal() {
                const p = this.listProgress;
                const index = Math.max(0, LIST_COUNT - FOLDING_FROM_BACK);
                const startZ = LIST_CAMERA_Z - LIST_START_DIST;
                const localZ = startZ - index * LIST_DEPTH_STEP;
                const totalDepth = LIST_START_DIST
                    + LIST_PASS_DIST
                    + (LIST_COUNT - 1) * LIST_DEPTH_STEP;
                const moveZ = this.clamp(p, 0, 1) * totalDepth;
                const dist = LIST_CAMERA_Z - (localZ + moveZ);
                const t = (LIST_FOG_FAR - dist) / LIST_DEPTH_STEP;

                return this.clamp(t, 0, 1);
            },
        },
        mounted() {
            this.onThroughProgress = (value) => {
                this.throughReveal = value;
            };
            this.$root.$on('nacre-through-progress', this.onThroughProgress);

            window.addEventListener('scroll', this.onScroll, { passive: true });
            window.addEventListener('resize', this.onScroll, { passive: true });
            this.onScroll();
        },
        beforeDestroy() {
            this.$root.$off('nacre-through-progress', this.onThroughProgress);
            window.removeEventListener('scroll', this.onScroll);
            window.removeEventListener('resize', this.onScroll);
        },
        methods: {
            clamp(value, min, max) {
                return Math.max(min, Math.min(max, value));
            },
            onScroll() {
                const el = this.$el;
                if (!el) return;

                const scrollRange = Math.max(el.offsetHeight - window.innerHeight, 1);
                const top = el.getBoundingClientRect().top;
                this.colorProgress = this.clamp(-top / scrollRange, 0, 1);
            },
        },
    };
</script>

<style lang='scss' scoped>
    @use '@/assets/scss/base/variables' as *;

    #rabbit-hole {
        position: relative;
        z-index: 0;
        width: 100%;
        margin-top: -100vh;
        pointer-events: none;

        &.is-revealed {
            z-index: 2;
            pointer-events: auto;
        }

        .rabbit-hole__sticky {
            position: sticky;
            top: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100vh;
            overflow: hidden;

            #rabbit-hole-lists {
                z-index: 1;
            }
        }
    }
</style>
