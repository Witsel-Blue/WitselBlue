<template>
    <div ref='lottieRoot' class='lottie-player' />
</template>

<script>
    import lottie from 'lottie-web';

    export default {
        name: 'Lottie',
        props: {
            animationData: {
                type: Object,
                default: null,
            },
            path: {
                type: String,
                default: '',
            },
            loop: {
                type: Boolean,
                default: true,
            },
            autoplay: {
                type: Boolean,
                default: true,
            },
        },
        mounted() {
            if (!process.client) return;
            this.loadAnimation();
        },
        beforeDestroy() {
            this.clearSegmentListeners();
            this.destroyAnimation();
        },
        methods: {
            loadAnimation() {
                if (!this.$refs.lottieRoot) return;

                this.destroyAnimation();

                const options = {
                    container: this.$refs.lottieRoot,
                    renderer: 'svg',
                    loop: this.loop,
                    autoplay: this.autoplay,
                };

                if (this.animationData) {
                    options.animationData = this.animationData;
                } else if (this.path) {
                    options.path = this.path;
                } else {
                    return;
                }

                this.anim = lottie.loadAnimation(options);
                this.anim.addEventListener('DOMLoaded', this.onDomLoaded);
            },
            onDomLoaded() {
                this.$emit('ready');
            },
            clearSegmentListeners() {
                if (!this.anim) return;

                if (this.onIntroComplete) {
                    this.anim.removeEventListener('complete', this.onIntroComplete);
                    this.onIntroComplete = null;
                }
            },
            destroyAnimation() {
                if (!this.anim) return;

                this.anim.removeEventListener('DOMLoaded', this.onDomLoaded);
                this.clearSegmentListeners();
                this.anim.destroy();
                this.anim = null;
            },
            playSegmentLoop(startFrame, endFrame) {
                if (!this.anim) return;

                this.clearSegmentListeners();
                this.anim.loop = true;
                this.anim.setSegment(startFrame, endFrame);
                this.anim.goToAndPlay(startFrame, true);
            },
            playIntroThenLoop(introEndFrame, loopStartFrame, loopEndFrame) {
                if (!this.anim) return;

                this.clearSegmentListeners();

                const introEnd = introEndFrame - 1;

                this.anim.loop = false;
                this.anim.setSegment(0, introEnd);
                this.anim.goToAndPlay(0, true);

                this.onIntroComplete = () => {
                    this.onIntroComplete = null;
                    this.playSegmentLoop(loopStartFrame, loopEndFrame);
                };

                this.anim.addEventListener('complete', this.onIntroComplete);
            },
            play() {
                this.anim?.play();
            },
            pause() {
                this.anim?.pause();
            },
            pauseAtFrame(frame) {
                if (!this.anim) return;

                this.clearSegmentListeners();
                this.anim.loop = false;

                if (typeof this.anim.resetSegments === 'function') {
                    this.anim.resetSegments(true);
                } else {
                    this.anim.setSegment(0, this.anim.totalFrames - 1);
                }

                this.anim.goToAndStop(frame, true);
                this.anim.pause();
            },
        },
    };
</script>

<style scoped>
    .lottie-player {
        width: 100%;
        height: 100%;
    }
</style>
