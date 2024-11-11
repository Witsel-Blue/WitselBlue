<template>
    <div id="button-round">
        <a 
            class="button"
            data-block="button"
            :href="link.href"
            target="_blank">
            <span class="circle" ref="circle"></span>
            <span class="title">{{ link.text }}</span>
        </a>

    </div>
</template>

<script>
    import gsap from 'gsap';

    export default {
        props: {
            link: Object,
        },
        mounted() {
            this.circleMove();
        },
        methods: {
            circleMove(e) {
                const gsap = this.$gsap;

                class Button {
                constructor(buttonElement) {
                    this.block = buttonElement;
                    this.init();
                    this.initEvents();
                }

                init() {
                    const el = gsap.utils.selector(this.block);

                    this.DOM = {
                    button: this.block,
                    flair: el(".circle")
                    };

                    this.xSet = gsap.quickSetter(this.DOM.flair, "xPercent");
                    this.ySet = gsap.quickSetter(this.DOM.flair, "yPercent");
                }

                getXY(e) {
                    const {
                    left,
                    top,
                    width,
                    height
                    } = this.DOM.button.getBoundingClientRect();

                    const xTransformer = gsap.utils.pipe(
                    gsap.utils.mapRange(0, width, 0, 100),
                    gsap.utils.clamp(0, 100)
                    );

                    const yTransformer = gsap.utils.pipe(
                    gsap.utils.mapRange(0, height, 0, 100),
                    gsap.utils.clamp(0, 100)
                    );

                    return {
                    x: xTransformer(e.clientX - left),
                    y: yTransformer(e.clientY - top)
                    };
                }

                initEvents() {
                    this.DOM.button.addEventListener("mouseenter", (e) => {
                    const { x, y } = this.getXY(e);

                    this.xSet(x);
                    this.ySet(y);

                    gsap.to(this.DOM.flair, {
                        scale: 1,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                    });

                    this.DOM.button.addEventListener("mouseleave", (e) => {
                    const { x, y } = this.getXY(e);

                    gsap.killTweensOf(this.DOM.flair);

                    gsap.to(this.DOM.flair, {
                        xPercent: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
                        yPercent: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
                        scale: 0,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                    });

                    this.DOM.button.addEventListener("mousemove", (e) => {
                    const { x, y } = this.getXY(e);

                    gsap.to(this.DOM.flair, {
                        xPercent: x,
                        yPercent: y,
                        duration: 0.4,
                        ease: "power2"
                    });
                    });
                }
                }

                const buttonElements = document.querySelectorAll('[data-block="button"]');

                buttonElements.forEach((buttonElement) => {
                    new Button(buttonElement);
                });

            }
        }
    }
</script>

<style lang="scss" scoped>
    #button-round .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 8px 16px;
        border-radius: 16px;
        position: relative;
        overflow: hidden;

        &::after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            border-radius: 16px;
            border: 1px solid #3E3C3C;
        }

        .circle {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            pointer-events: none;
            transform: scale(0);
            transform-origin: 0 0;
            will-change: transform;
            &::before {
                content: '';
                display: block;
                background-color: #3E3C3C;
                border-radius: 50%;
                position: absolute;
                top: 0;
                left: 0;
                transform: translate(-50%, -50%);
                width: 170%;
                pointer-events: none;
                aspect-ratio: 1/1;
            }
        }
        .title {
            color: #3E3C3C;
            position: relative;
        }

        &:hover {
            .title {
                color: #fff;
            }
        }
    }
</style>