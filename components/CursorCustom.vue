<template>
    <div id="cursor-custom">
        <div class="cursor-circle" ref="circle"></div>
    </div>
</template>

<script>
    export default {
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

                    console.log(hoverElems);

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
                }
            }
        }
    }
</script>

<style lang="scss">
    @import '@/assets/scss/base/variables.scss';

    html, a {
        cursor: none !important;
    }

    .mouse-hover1,
    .mouse-hover2 {
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
            width: 100px;
            height: 100px;
            transition: width 0.2s, height 0.2s;
        }

        &.no-cursor {
            display: none;
        }
    }

    // mobile
    @media all and (max-width: $mobile) {
        html, a {
            cursor: initial !important;
        }
        .cursor-circle {
            display: none;
        }
    }
</style>