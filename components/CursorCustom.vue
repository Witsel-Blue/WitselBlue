<template>
    <div id="cursor-custom">
        <div class="circle" ref="circle"></div>
    </div>
</template>

<script>
    export default {
        mounted() {
            this.mouseMove();
        },
        methods: {
            mouseMove() {
                const gsap = this.$gsap;
                var circle = this.$refs.circle;
                var hoverElem = document.querySelector('.mouse-hover');

                gsap.set(".circle", {xPercent: -50, yPercent: -50});

                let xTo = gsap.quickTo(".circle", "x", {duration: 0.4, ease: "power3"}),
                    yTo = gsap.quickTo(".circle", "y", {duration: 0.4, ease: "power3"});

                window.addEventListener("mousemove", e => {
                    xTo(e.clientX);
                    yTo(e.clientY);
                });

                hoverElem.addEventListener("mouseenter", e => {
                    circle.classList.add('hover');
                });
                hoverElem.addEventListener("mouseleave", e => {
                    circle.classList.remove('hover');
                });

            },
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/base/variables.scss';

    .circle {
        position: fixed;
        pointer-events: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        z-index: 10000;
        border: 2px solid $black1;
        transition: width 0.4s, height 0.4s;

        &.hover {
            width: 120px;
            height: 120px;
            background-color: $black1;
            mix-blend-mode: difference;
            transition: width 0.4s, height 0.4s;
        }
    }
</style>