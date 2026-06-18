<template>
    <div ref='root' class='parallax-component'>
        <div ref='layer' class='parallax-component__layer'>
            <img
                v-if='src'
                :src='src'
                alt=''
                class='parallax-component__img'
                loading='lazy'
                decoding='async'
                draggable='false'
                @load='onMediaReady'
            />
            <p v-if='text' class='parallax-component__text'>{{ text }}</p>
        </div>
    </div>
</template>

<script>
    import gsap from 'gsap';
    import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

    if (process.client) {
        gsap.registerPlugin(ScrollTrigger);
    }

    const TRAVEL = {
        default: 200,
        fast: 360,
    };

    export default {
        name: 'ParallaxComponent',
        props: {
            text: {
                type: String,
                default: '',
            },
            img: {
                type: String,
                default: '',
            },
            image: {
                type: String,
                default: '',
            },
            slow: {
                type: Boolean,
                default: false,
            },
            fast: {
                type: Boolean,
                default: false,
            },
        },
        computed: {
            src() {
                return this.img || this.image;
            },
            travel() {
                if (this.slow) return -TRAVEL.fast;
                if (this.fast) return TRAVEL.fast;
                return TRAVEL.default;
            },
        },
        watch: {
            src() {
                this.$nextTick(() => this.initParallax());
            },
            text() {
                this.$nextTick(() => this.initParallax());
            },
            slow() {
                this.$nextTick(() => this.initParallax());
            },
            fast() {
                this.$nextTick(() => this.initParallax());
            },
        },
        mounted() {
            if (!process.client) return;
            this.$nextTick(() => this.initParallax());
            window.addEventListener('resize', this.onResize, { passive: true });
        },
        activated() {
            if (!process.client) return;
            this.$nextTick(() => this.initParallax());
        },
        beforeDestroy() {
            if (!process.client) return;
            window.removeEventListener('resize', this.onResize);
            this.killParallax();
        },
        methods: {
            onMediaReady() {
                this.initParallax();
            },
            onResize() {
                if (this._resizeTimer) clearTimeout(this._resizeTimer);
                this._resizeTimer = setTimeout(() => {
                    this.initParallax();
                }, 150);
            },
            killParallax() {
                if (this.scrollTrigger) {
                    this.scrollTrigger.kill();
                    this.scrollTrigger = null;
                }
                if (this.tween) {
                    this.tween.kill();
                    this.tween = null;
                }
                const layer = this.$refs.layer;
                if (layer) gsap.set(layer, { clearProps: 'transform' });
            },
            initParallax() {
                if (!process.client) return;

                const root = this.$refs.root;
                const layer = this.$refs.layer;
                if (!root || !layer) return;
                if (!this.src && !this.text) return;

                this.killParallax();

                const travel = this.travel;

                gsap.set(layer, { y: 0 });

                this.tween = gsap.fromTo(
                    layer,
                    { y: travel * 0.5 },
                    {
                        y: -travel * 0.5,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: root,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 0.5,
                            invalidateOnRefresh: true,
                        },
                    },
                );

                this.scrollTrigger = this.tween.scrollTrigger;
                this.scrollTrigger?.refresh();
            },
        },
    };
</script>

<style lang='scss' scoped>
    .parallax-component {
        position: relative;
        overflow: visible;

        &__layer {
            will-change: transform;
        }

        &__img {
            display: block;
            width: 100%;
            height: auto;
            user-select: none;
            pointer-events: none;
        }

        &__text {
            margin: 0;
            font-size: 1rem;
            line-height: 1.5;
        }
    }
</style>
