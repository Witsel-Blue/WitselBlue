<template>
  <div id="app">
    <GNB />
    <Nuxt />
    <Footer v-if="!$store.state.isDetailPage" />
    <DetailFooter v-else />
  </div>
</template>

<script>
import GNB from '@/layouts/gnb.vue';
import Footer from '@/layouts/Footer.vue';
import DetailFooter from '@/layouts/DetailFooter.vue';

export default {
    components: { 
        GNB,
        Footer,
        DetailFooter,
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