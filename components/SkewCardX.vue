<template>
  <div class='skew-section' ref='section'>
    <Nuxt-link 
        v-if='path'
        :to=path
        class='hover-img'>
        <div class='img'>
            <div class='res-box-wrap'>
                <div class='res-box'>
                    <img 
                      :src='img' 
                      oncontextmenu='return false;'
                      ondragstart='return false;'
                    />
                </div>
            </div>
        </div>
    </Nuxt-link>
    <img :src='img' v-else-if='img' />
  </div>
</template>

<script>
export default {
  name: 'SkewCardX',
  props: {
    img: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    }
  },
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
        const speed = diff * 0.08;

        section.style.transform = `skewX(${speed}deg)`;

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
  .hover-img {
    background: #fff;
    overflow: hidden;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    display: block;
    &:hover img {
      transform: scale(1.2);
    }
  }
}
</style>
