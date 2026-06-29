<template>
    <header v-show='showLogo' id='header' :class='{ fixed: isLogoFixed }'>
        <NuxtLink to='/'>
            <Logo class='header__logo' :style='logoStyle' />
        </NuxtLink>
    </header>
</template>

<script>
    import Logo from '@/components/svg/logo.vue';

    const INTRO_ROOT_KEY = '$wb2026IntroDone';

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
            };
        },
        computed: {
            isHome() {
                const path = this.$route.path;
                return path === '/' || path === '/ko';
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
                const p = this.isHome ? this.scrollProgress : 1;
                const lp = Math.min(1, p / 0.55);
                const t = lp * lp * (3 - 2 * lp);
                const hStart = 0.2 * H;
                const scaleEnd = 40 / hStart;
                const scale = 1 + (scaleEnd - 1) * t;
                const topEnd = 0.025 * H;
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
                    this.scrollProgress = 1;
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
            if (process.client && this.$root[INTRO_ROOT_KEY]) {
                this.introDone = true;
            }

            this.onIntroState = (done) => {
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
    }
}
</style>
