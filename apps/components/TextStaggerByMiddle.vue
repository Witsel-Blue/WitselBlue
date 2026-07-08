<template>
    <div ref='root' class='text-stagger-by-middle'>
        <span
            v-for='(ch, i) in chars'
            :key='i'
            class='char'
            :class='{ space: ch === " " }'
        >
            <span class='char__inner'>{{ ch === ' ' ? '\u00A0' : ch }}</span>
        </span>
    </div>
</template>

<script>
    import gsap from 'gsap';

    export default {
        name: 'TextStaggerByMiddle',
        props: {
            text: {
                type: String,
                required: true,
            },
            duration: {
                type: Number,
                default: 0.6,
            },
            stagger: {
                type: Number,
                default: 0.06,
            },
        },
        data() {
            return {
                tween: null,
                animated: false,
            };
        },
        computed: {
            chars() {
                return this.text.split('');
            },
        },
        watch: {
            text() {
                if (!process.client) return;
                this.$nextTick(() => {
                    this.resetAnimation();
                    this.checkPosition();
                });
            },
        },
        mounted() {
            if (!process.client) return;
            this.$nextTick(() => {
                this.resetAnimation();
                window.addEventListener('scroll', this.checkPosition, {
                    passive: true,
                });
                window.addEventListener('resize', this.checkPosition, {
                    passive: true,
                });
                this.checkPosition();
            });
        },
        beforeDestroy() {
            window.removeEventListener('scroll', this.checkPosition);
            window.removeEventListener('resize', this.checkPosition);
            if (this.tween) {
                this.tween.kill();
                this.tween = null;
            }
        },
        methods: {
            inners() {
                const root = this.$refs.root;
                if (!root) return [];
                return root.querySelectorAll('.char__inner');
            },
            resetAnimation() {
                const inners = this.inners();
                if (!inners.length) return;
                if (this.tween) this.tween.kill();
                gsap.set(inners, { yPercent: 120 });
                this.tween = null;
                this.animated = false;
            },
            runAnimation() {
                const inners = this.inners();
                if (!inners.length) return;
                if (this.tween) this.tween.kill();

                this.tween = gsap.to(inners, {
                    yPercent: 0,
                    duration: this.duration,
                    ease: 'power3.out',
                    stagger: {
                        each: this.stagger,
                        from: 'center',
                    },
                });
                this.animated = true;
            },
            checkPosition() {
                const root = this.$refs.root;
                if (!root) return;

                const rect = root.getBoundingClientRect();
                const vh = window.innerHeight;
                const center = rect.top + rect.height / 2;

                const inView = center < vh * 0.85 && rect.bottom > 0;
                if (inView && !this.animated) {
                    this.runAnimation();
                } else if (
                    (rect.bottom < 0 || rect.top > vh) &&
                    this.animated
                ) {
                    this.resetAnimation();
                }
            },
        },
    };
</script>

<style lang='scss' scoped>
    .text-stagger-by-middle {
        display: inline-flex;
        flex-wrap: wrap;

        .char {
            display: inline-block;
            overflow: hidden;

            &__inner {
                display: inline-block;
                will-change: transform;
            }
        }
    }
</style>
