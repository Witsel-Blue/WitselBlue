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
        this.initCursor();
    },
    beforeDestroy() {
        document.removeEventListener('mouseover', this.handleHover);
        document.removeEventListener('mouseout', this.handleHoverOut);
        window.removeEventListener('mousemove', this.handleMove);
        window.removeEventListener('cursor-set-text', this.handleSetText);
        window.removeEventListener('cursor-show-image', this.handleShowImage);
    },
    methods: {
        initCursor() {
            if (window.innerWidth <= 425) return;

            const gsap = this.$gsap;
            const circle = this.$refs.circle;

            gsap.set(circle, { xPercent: -50, yPercent: -50 });

            this.handleMove = (e) => {
                gsap.to(circle, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.4,
                ease: 'power3',
                });
            };

            window.addEventListener('mousemove', this.handleMove);

            // hover
            this.handleHover = (e) => {
                const el = e.target.closest('.mouse-hover1, .mouse-hover2, .mouse-hover3, .mouse-none');
                if (!el) return;

                if (el.classList.contains('mouse-hover1')) circle.classList.add('hover1');
                if (el.classList.contains('mouse-hover2')) circle.classList.add('hover2');
                if (el.classList.contains('mouse-hover3')) circle.classList.add('hover3');
                if (el.classList.contains('mouse-none')) circle.classList.add('no-cursor');
            };

            this.handleHoverOut = (e) => {
                const el = e.target.closest('.mouse-hover1, .mouse-hover2, .mouse-hover3, .mouse-none');
                if (!el) return;

                if (el.classList.contains('mouse-hover1')) circle.classList.remove('hover1');
                if (el.classList.contains('mouse-hover2')) circle.classList.remove('hover2');
                if (el.classList.contains('mouse-hover3')) circle.classList.remove('hover3');
                if (el.classList.contains('mouse-none')) circle.classList.remove('no-cursor');
            };

            document.addEventListener('mouseover', this.handleHover);
            document.addEventListener('mouseout', this.handleHoverOut);

            // 텍스트/이미지 제어
            this.handleSetText = (e) => {
                this.internalText = e.detail.text || '';
            };
            this.handleShowImage = (e) => {
                this.showText = e.detail.show;
            };

            window.addEventListener('cursor-set-text', this.handleSetText);
            window.addEventListener('cursor-show-image', this.handleShowImage);
        },
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