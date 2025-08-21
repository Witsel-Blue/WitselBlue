<template>
  <div class="skew-section" ref="section">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'SkewCardY',
  data() {
    return {
      currentPos: 0,
    };
  },
  mounted() {
    this.currentPos = window.pageYOffset;
    this.updateSkew();
  },
  methods: {
    updateSkew() {
      const section = this.$refs.section;

      const loop = () => {
        const newPos = window.pageYOffset;
        const diff = newPos - this.currentPos;
        const speed = diff * 0.15;

        section.style.transform = `skewY(${speed}deg)`;

        this.currentPos = newPos;
        requestAnimationFrame(loop);
      };

      loop();
    },
  },
};
</script>

<style scoped>
.skew-section {
  transition: transform 0.2s ease-out;
  width: 300px;
  height: 400px;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}
</style>
