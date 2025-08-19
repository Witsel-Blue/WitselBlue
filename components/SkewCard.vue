<template>
  <div class="skew-container">
    <div class="card" ref="card">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkewCard',
  data() {
    return {
      skewX: 0,
      skewY: 0,
      resetTimeout: null,
    };
  },
  mounted() {
    window.addEventListener('wheel', this.handleWheel);
  },
  beforeDestroy() {
    window.removeEventListener('wheel', this.handleWheel);
    clearTimeout(this.resetTimeout);
  },
  methods: {
    handleWheel(e) {
      // 휠 방향에 따라 skew 조절
      this.skewY = e.deltaY > 0 ? 3 : -3;

      this.$refs.card.style.transform = `skewX(${this.skewX}deg) skewY(${this.skewY}deg)`;

      // 이전 timeout 취소
      if (this.resetTimeout) clearTimeout(this.resetTimeout);

      // 150ms 후 skew 원래대로
      this.resetTimeout = setTimeout(() => {
        this.skewY = 0;
        this.$refs.card.style.transform = `skewX(0deg) skewY(0deg)`;
      }, 150);
    },
  },
};
</script>

<style scoped>
.skew-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  perspective: 1000px;
}

.card {
  width: 300px;
  height: 400px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  transition: transform 0.2s ease; /* 휠 멈출 때 자연스럽게 돌아오게 */
}
</style>