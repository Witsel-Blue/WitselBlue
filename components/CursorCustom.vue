<template>
    <div id="cursor-custom">
        <div class="cursor-circle" ref="circle"></div>
    </div>
</template>

<script>
    export default {
        mounted() {
            this.mouseMove();
        },
        // beforeDestroy() {
        //     window.removeEventListener(this.handleResize);
        // },
        methods: {
            mouseMove() {
                const gsap = this.$gsap;
                var circle = this.$refs.circle;

                gsap.set(".cursor-circle", {xPercent: -50, yPercent: -50});

                let xTo = gsap.quickTo(".cursor-circle", "x", {duration: 0.4, ease: "power3"}),
                    yTo = gsap.quickTo(".cursor-circle", "y", {duration: 0.4, ease: "power3"});

                window.addEventListener("mousemove", e => {
                    xTo(e.clientX);
                    yTo(e.clientY);
                });


                var hoverElems = document.querySelectorAll('.mouse-hover');

                for (var i = 0; i < hoverElems.length; i++) {
                    var x = hoverElems[i];

                    x.addEventListener("mouseenter", e => {
                        circle.classList.add('hover');
                    });
                    x.addEventListener("mouseleave", e => {
                        circle.classList.remove('hover');
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

            },
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/base/variables.scss';

    .cursor-circle {
        position: fixed;
        pointer-events: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        z-index: 1;
        border: 2px solid $black1;
        transition: width 0.4s, height 0.4s;

        &.hover {
            width: 120px;
            height: 120px;
            border: none;
            background: #fff;
            transition: width 0.4s, height 0.4s;
        }

        &.no-cursor {
            display: none;
        }
    }
</style>

<style>
    .mouse-hover {
        z-index: 10;
        position: relative;
    }
</style>