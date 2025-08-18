<template>
    <div id="cursor-custom">
        <div ref="circle" class="cursor-circle" :class="cursorClasses">
            <span ref="cursorText" class="cursor-text"></span>
            <Lottie v-if="showLottie" :animationData="animationData" />
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
        }
    },
    data() {
        return {
            activeClasses: [],
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
        });
    },
    methods: {
        mouseMove() {
            var winW = window.innerWidth;

            if (winW > 425) {
                const gsap = this.$gsap;
                var circle = this.$refs.circle;

                gsap.set(".cursor-circle", {xPercent: -50, yPercent: -50});

                let xTo = gsap.quickTo(".cursor-circle", "x", {duration: 0.4, ease: "power3"}),
                    yTo = gsap.quickTo(".cursor-circle", "y", {duration: 0.4, ease: "power3"});

                window.addEventListener("mousemove", e => {
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

                    x.addEventListener("mouseenter", e => {
                        circle.classList.add('hover1');
                    });
                    x.addEventListener("mouseleave", e => {
                        circle.classList.remove('hover1');
                    });
                }

                var hoverElems2 = document.querySelectorAll('.mouse-hover2');
                for (var i = 0; i < hoverElems2.length; i++) {
                    var x2 = hoverElems2[i];

                    x2.addEventListener("mouseenter", e => {
                        circle.classList.add('hover2');
                    });
                    x2.addEventListener("mouseleave", e => {
                        circle.classList.remove('hover2');
                    });
                }

                var noHoverElems = document.querySelectorAll('.mouse-none');
                for (var i = 0; i < noHoverElems.length; i++) {
                    var x2 = noHoverElems[i];

                    x2.addEventListener("mouseenter", e => {
                        circle.classList.add('no-cursor');
                    });
                    x2.addEventListener("mouseleave", e => {
                        circle.classList.remove('no-cursor');
                    });
                }

                // index > skills
                var skillElems = document.querySelectorAll('#home .skills li');
                var cursorText = this.$refs.cursorText;
                for (let i = 0; i < skillElems.length; i++) {
                    const li = skillElems[i];
                    const skillName = li.querySelector('img')?.getAttribute('alt') || li.getAttribute('data-name') || '';

                    li.addEventListener("mouseenter", () => {
                        cursorText.textContent = skillName;
                        circle.classList.add('hover-skill');
                    });

                    li.addEventListener("mouseleave", () => {
                        cursorText.textContent = '';
                        circle.classList.remove('hover-skill');
                    });
                }

            }
        }
    }
}
</script>

<style lang="scss">
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
        width: 32px;
        height: 32px;
        border-radius: 50%;
        z-index: 101;
        border: 2px solid $black1;
        transition: width 0.2s, height 0.2s;

        &.hover1 {
            width: 100px;
            height: 100px;
            border: none;
            background: rgb(202, 202, 202);
            mix-blend-mode: difference;
            transition: width 0.2s, height 0.2s;
        }

        &.hover2 {
            width: 80px;
            height: 80px;
            transition: width 0.2s, height 0.2s;
        }

        &.no-cursor {
            display: none;
        }

        &.hover-skill {
            width: 80px;
            height: 80px;
            border: none;
            background: rgba(62, 60, 60, 0.8);
            transition: width 0.2s, height 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            padding: 8px;
            word-break: break-all;
            text-align: center;
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