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
    mounted() {
        lottie.loadAnimation({
            container: this.$refs.lottieContainer,
            renderer: 'svg',
            loop: this.loop,
            autoplay: this.autoplay,
            animationData: this.animationData
        })
    }
}
</script>

<style scoped>

</style>