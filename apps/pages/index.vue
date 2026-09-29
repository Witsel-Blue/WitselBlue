<template>
    <div class='home-root'>
        <Loading v-if='!siteReady' :percent='loadPercent' />
        <main
            class='home'
            :class='{ "intro-only": !exploded }'
        >
            <Mainvisual :key='mainvisualKey' @ready='onSceneReady' />
            <About v-if='exploded' />
            <FeaturedWork v-if='exploded' />
            <RabbitHole v-if='exploded' />
        </main>
    </div>
</template>

<script>
    import Mainvisual from '@/components/home/Mainvisual.vue';
    import About from '@/components/home/About.vue';
    import Loading from '@/components/common/Loading.vue';
    import { preloadHomeAssets } from '@/utils/preloadHomeAssets';

    export default {
        components: {
            Loading,
            Mainvisual,
            About,
            FeaturedWork: () => import('@/components/home/FeaturedWork.vue'),
            RabbitHole: () => import('@/components/home/RabbitHole.vue'),
        },
        data() {
            return {
                assetsReady: false,
                assetsFraction: 0,
                sceneReady: false,
                exploded: false,
                mainvisualKey: 0,
            };
        },
        computed: {
            siteReady() {
                return this.assetsReady && this.sceneReady;
            },
            loadPercent() {
                if (this.siteReady) return 100;
                return Math.min(90, Math.round(this.assetsFraction * 90));
            },
        },
        mounted() {
            this._alive = true;
            this.lockPageScroll();
            this.onIntroState = (done) => {
                this.exploded = done;
            };
            this.onIntroReplay = () => {
                this.exploded = false;
                this.mainvisualKey += 1;
            };
            this.$root.$on('mainvisual-intro-state', this.onIntroState);
            this.$root.$on('intro-replay-request', this.onIntroReplay);

            preloadHomeAssets((percent) => {
                if (this._alive) this.assetsFraction = percent / 100;
            }).finally(() => {
                if (!this._alive) return;
                this.assetsReady = true;
                this.finishLoading();
            });
        },
        beforeDestroy() {
            this._alive = false;
            this.unlockPageScroll();
            this.$root.$off('mainvisual-intro-state', this.onIntroState);
            this.$root.$off('intro-replay-request', this.onIntroReplay);
        },
        methods: {
            lockPageScroll() {
                if (!process.client || this._scrollLocked) return;
                this._scrollLocked = true;
                this._prevOverflow = document.documentElement.style.overflow;
                document.documentElement.style.overflow = 'hidden';
            },
            unlockPageScroll() {
                if (!process.client || !this._scrollLocked) return;
                this._scrollLocked = false;
                document.documentElement.style.overflow = this._prevOverflow || '';
            },
            onSceneReady() {
                this.sceneReady = true;
                this.finishLoading();
            },
            finishLoading() {
                if (!this.siteReady) return;
                this.unlockPageScroll();
            },
        },
    };
</script>

<style lang='scss' scoped>
    @use '@/assets/scss/base/variables.scss' as *;

    .home.intro-only {
        height: 100vh;
        overflow: hidden;
    }
</style>
