<template>
  <div id="app">
    <GNB />
    <Nuxt />
  </div>
</template>

<script>
import GNB from '@/layouts/gnb.vue';

export default {
    components: { 
        GNB,
     },
};
</script>

<style lang="scss">
@use '@/assets/scss/base/variables.scss' as *;

  #app {
      background-color: $white2;
      color: $black1;
      overflow: hidden;
  }
</style>