<template>
    <div
        id='rabbit-hole'
        :class='{ "is-revealed": throughReveal > 0.99 }'
        :style='{ opacity: throughReveal }'
    >
        <div
            class='rabbit-hole__sticky'
            :style='stickyStyle'
        />
    </div>
</template>

<script>
    const COLOR_FROM = '#454545';
    const COLOR_TO = '#ece8da';

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
        data() {
            return {
                throughReveal: 0,
                colorProgress: 0,
            };
        },
        computed: {
            stickyStyle() {
                const t = this.colorProgress;
                return {
                    backgroundColor: lerpHex(COLOR_FROM, COLOR_TO, t),
                    color: lerpHex(COLOR_TO, COLOR_FROM, t),
                };
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
        height: 250vh;
        margin-top: -100vh;
        pointer-events: none;

        &.is-revealed {
            z-index: 2;
        }

        .rabbit-hole__sticky {
            position: sticky;
            top: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100vh;
            font-size: clamp(2rem, 8vw, 6rem);
            text-align: center;
        }
    }
</style>
