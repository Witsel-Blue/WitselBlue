<template>
    <div id='cursor-custom'>
        <div ref='circle' class='cursor-circle' :class='cursorClasses'>
            <span ref='cursorText' class='cursor-text'>{{ internalText }}</span>
            <img v-if='showText' src='@/assets/img/visitsite.png' class='visitsite' />
            <Lottie v-if='showLottie' :animationData='animationData' />
        </div>
    </div>
</template>

<script>
import Lottie from '@/components/Lottie.vue';

export default {
    components: {
        Lottie,
    },
    props: {
        extraClass: {
            type: String,
            default: '',
        },
        showLottie: {
            type: Boolean,
            default: false,
        },
        animationData: {
            type: Object,
            required: false,
        },
        text: {
            type: String,
            default: '',
        }
    },
    data() {
        return {
            activeClasses: [],
            internalText: '',
            showText: false,
        }
    },
    computed: {
        cursorClasses() {
            return [this.extraClass, ...this.activeClasses]
        }
    },
    mounted() {
        this.mouseMove();
        this.$nextTick(() => {
            this.mouseHover();
            this.observeDynamicElements();
        });
        window.addEventListener('cursor-set-text', (e) => {
            this.internalText = e.detail.text || '';
        });
        window.addEventListener('cursor-show-image', (e) => {
            this.showText = e.detail.show;
        });
    },
    methods: {
        mouseMove() {
            var winW = window.innerWidth;

            if (winW > 425) {
                const gsap = this.$gsap;
                var circle = this.$refs.circle;

                gsap.set('.cursor-circle', {xPercent: -50, yPercent: -50});

                let xTo = gsap.quickTo('.cursor-circle', 'x', {duration: 0.4, ease: 'power3'}),
                    yTo = gsap.quickTo('.cursor-circle', 'y', {duration: 0.4, ease: 'power3'});

                window.addEventListener('mousemove', e => {
                    xTo(e.clientX);
                    yTo(e.clientY);
                });
            }
        },
        mouseHover() {
            var winW = window.innerWidth;

            if (winW > 425) {
                const gsap = this.$gsap;
                var circle = this.$refs.circle;

                var hoverElems = document.querySelectorAll('.mouse-hover1');
                for (var i = 0; i < hoverElems.length; i++) {
                    var x = hoverElems[i];

                    x.addEventListener('mouseenter', e => {
                        circle.classList.add('hover1');
                    });
                    x.addEventListener('mouseleave', e => {
                        circle.classList.remove('hover1');
                    });
                }

                var hoverElems2 = document.querySelectorAll('.mouse-hover2');
                for (var i = 0; i < hoverElems2.length; i++) {
                    var x2 = hoverElems2[i];

                    x2.addEventListener('mouseenter', e => {
                        circle.classList.add('hover2');
                    });
                    x2.addEventListener('mouseleave', e => {
                        circle.classList.remove('hover2');
                    });
                }

                var hoverElems2 = document.querySelectorAll('.mouse-hover3');
                for (var i = 0; i < hoverElems2.length; i++) {
                    var x2 = hoverElems2[i];

                    x2.addEventListener('mouseenter', e => {
                        circle.classList.add('hover3');
                    });
                    x2.addEventListener('mouseleave', e => {
                        circle.classList.remove('hover3');
                    });
                }

                var noHoverElems = document.querySelectorAll('.mouse-none');
                for (var i = 0; i < noHoverElems.length; i++) {
                    var x2 = noHoverElems[i];

                    x2.addEventListener('mouseenter', e => {
                        circle.classList.add('no-cursor');
                    });
                    x2.addEventListener('mouseleave', e => {
                        circle.classList.remove('no-cursor');
                    });
                }

            }
        },
        observeDynamicElements() {
            const circle = this.$refs.circle;
            if (!circle) return;

            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType !== 1) return;

                            if (node.classList.contains('mouse-none')) {
                                node.addEventListener('mouseenter', () => {
                                    circle.classList.add('no-cursor');
                                });
                                node.addEventListener('mouseleave', () => {
                                    circle.classList.remove('no-cursor');
                                });
                            }

                            const nested = node.querySelectorAll?.('.mouse-none') || [];
                            nested.forEach(el => {
                                el.addEventListener('mouseenter', () => {
                                    circle.classList.add('no-cursor');
                                });
                                el.addEventListener('mouseleave', () => {
                                    circle.classList.remove('no-cursor');
                                });
                            });
                        });
                    }
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        }

    }
}
</script>

<style lang='scss'>
    @use '@/assets/scss/base/variables.scss' as *;

    html, a, button {
        cursor: none !important;
    }

    .mouse-hover1,
    .mouse-hover2,
    .mouse-hover3 {
        z-index: 100;
        position: relative;
    }

    .cursor-circle {
        position: fixed;
        pointer-events: none;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        z-index: 101;
        border: 2px solid $black1;
        transition: width 0.2s, height 0.2s;

        .visitsite {
            width: 120px;
            height: 120px;
            position: absolute;
            top: -20px;
            left: -20px;
        }
        .cursor-text {
            position: absolute;
            top: -4px;
            left: 50%;
            transform: translate(-50%, -100%);
            width: 100%;
            text-align: center;
            color: #c1c3c3;
        }

        &.hover1 {
            width: 80px;
            height: 80px;
            border: none;
            background: rgb(202, 202, 202);
            mix-blend-mode: difference;
            transition: width 0.2s, height 0.2s;
        }

        &.hover2 {
            width: 40px;
            height: 40px;
            border: none;
            background: rgb(202, 202, 202);
            mix-blend-mode: difference;
            transition: width 0.2s, height 0.2s;
        }

        &.hover3 {
            width: 40px;
            height: 40px;
            transition: width 0.2s, height 0.2s;
        }

        &.no-cursor {
            display: none;
        }

        &.cursor-main {
            width: 100px;
            height: 100px;
            border: none;
            transition: width 0.2s, height 0.2s;
        }
    }

    // mobile
    @media all and (max-width: $mobile) {
        html, a, button {
            cursor: initial !important;
        }
        .cursor-circle {
            display: none;
        }
    }
</style>