<template>
    <div id='lottie' ref='lottieContainer'></div>
</template>

<script>
import lottie from 'lottie-web';

export default {
    props: {
            animationData: {
                type: Object,
                required: true
            },
            loop: {
                type: Boolean,
                default: true
            },
            autoplay: {
                type: Boolean,
                default: true
            }
    },
    data() {
        return {
            animation: null
        }
    },
    mounted() {
        this.animation = lottie.loadAnimation({
            container: this.$refs.lottieContainer,
            renderer: 'svg',
            loop: this.loop,
            autoplay: this.autoplay,
            animationData: this.animationData
        });
    },
    methods: {
        play() {
            if (this.animation) {
                this.animation.play();
            }
        },
        pause() {
            if (this.animation) {
                this.animation.pause();
            }
        },
        stop() {
            if (this.animation) {
                this.animation.stop();
            }
        },
        goToAndStop(value, isFrame) {
            if (this.animation) {
                this.animation.goToAndStop(value, isFrame);
            }
        },
        setSpeed(speed) {
            if (this.animation) {
                this.animation.setSpeed(speed);
            }
        },
        onComplete(callback) {
            if (this.animation) {
                this.animation.addEventListener('complete', callback);
            }
        }
    },
    beforeDestroy() {
        if (this.animation) {
            this.animation.destroy();
        }
    }
}
</script>