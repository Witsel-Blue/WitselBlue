<template>
  <div ref="lottieContainer" class="lottie-wrapper"></div>
</template>

<script>
export default {
  mounted() {
    const animationData = require('@/assets/lottie/butterfly.json')

    this.$lottie.loadAnimation({
      container: this.$refs.lottieContainer,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData
    })
  }
}
</script>

<style scoped>
.lottie-wrapper {
  width: 300px;
  height: 300px;
  margin: auto;
  border: 1px solid red;
}
</style>