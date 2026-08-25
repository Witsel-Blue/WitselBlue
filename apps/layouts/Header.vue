<template>
    <header v-show='showLogo' id='header' :class='{ fixed: isLogoFixed }'>
        <NuxtLink :to="localePath('/')">
            <Logo class='header__logo' :style='logoStyle' />
        </NuxtLink>
    </header>
</template>

<script>
    import Logo from '@/components/svg/logo.vue';
    import { isHomeRoute } from '@/utils/introState';

    const LOGO_RATIO_W = 195;
    const LOGO_RATIO_H = 80;
    const MOBILE_MAX_WIDTH = 425;
    const LOGO_START_VH = 0.2;
    const LOGO_START_MOBILE_VW = 0.8;
    const LOGO_END_HEIGHT = 40;

    export default {
        name: 'SiteHeader',
        components: {
            Logo,
        },
        data() {
            return {
                introDone: false,
                homeLogoActive: false,
                scrollProgress: 0,
                logoTop0: 0,
                winH:
                    typeof window !== 'undefined' ? window.innerHeight : 800,
                winW:
                    typeof window !== 'undefined' ? window.innerWidth : 1280,
            };
        },
        computed: {
            isHome() {
                return isHomeRoute(this.$route);
            },
            showLogo() {
                if (!this.isHome) return true;
                return this.introDone && this.homeLogoActive;
            },
            isLogoFixed() {
                if (!this.isHome) return true;
                return this.scrollProgress >= 0.55;
            },
            logoStyle() {
                const H = this.winH || 800;
                const W = this.winW || 1024;
                const isMobile = W <= MOBILE_MAX_WIDTH;
                const p = this.isHome ? this.scrollProgress : 1;
                const lp = Math.min(1, p / 0.55);
                const t = lp * lp * (3 - 2 * lp);
                const hStart = isMobile
                    ? (W * LOGO_START_MOBILE_VW * LOGO_RATIO_H) / LOGO_RATIO_W
                    : H * LOGO_START_VH;
                const scaleEnd = LOGO_END_HEIGHT / hStart;
                const scale = 1 + (scaleEnd - 1) * t;
                const topEnd = 0.025 * W;
                const baseTop = this.isHome ? this.logoTop0 : topEnd;
                const dy = (topEnd - baseTop) * t;

                return {
                    top: `${baseTop}px`,
                    height: `${hStart}px`,
                    transform: `translateX(-50%) translateY(${dy}px) scale(${scale})`,
                };
            },
        },
        watch: {
            '$route.path'() {
                if (!this.isHome) {
                    this.introDone = true;
                    this.scrollProgress = 1;
                    return;
                }
            },
            isLogoFixed: {
                immediate: true,
                handler(fixed) {
                    this.$root.$emit('header-fixed-state', fixed);
                },
            },
        },
        mounted() {
            this.onIntroState = (done) => {
                if (!this.isHome) {
                    this.introDone = true;
                    return;
                }
                this.introDone = done;
            };
            this.onLogoMetrics = ({ scrollProgress, logoTop0, active }) => {
                if (!this.isHome) return;
                this.scrollProgress = scrollProgress;
                this.logoTop0 = logoTop0;
                this.homeLogoActive = active;
            };

            this.$root.$on('mainvisual-intro-state', this.onIntroState);
            this.$root.$on('header-logo-metrics', this.onLogoMetrics);
            window.addEventListener('resize', this.onResize);
        },
        beforeDestroy() {
            this.$root.$off('mainvisual-intro-state', this.onIntroState);
            this.$root.$off('header-logo-metrics', this.onLogoMetrics);
            window.removeEventListener('resize', this.onResize);
        },
        methods: {
            onResize() {
                this.winH = window.innerHeight;
                this.winW = window.innerWidth;
            },
        },
    };
</script>

<style lang='scss' scoped>
@use '@/assets/scss/base/variables.scss' as *;

#header {
    position: fixed;
    inset: 0;
    z-index: 5;
    width: 100%;
    height: calc(40px + 2.5vw);

    a {
        pointer-events: none;
    }

    .header__logo {
        position: fixed;
        left: 50%;
        width: auto;
        color: $white;
        mix-blend-mode: difference;
        transform-origin: top center;
        will-change: transform, top;
    }

    &.fixed {
        z-index: 9;
        mix-blend-mode: difference;

        a {
            pointer-events: initial;
        }
    }
}
</style>
