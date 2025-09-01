<template>
  <div id="app">
    <GNB v-if="!$store.state.isNoUIPage" />
    <Nuxt />
    <Footer v-if="!$store.state.isDetailPage && !$store.state.isNoUIPage" />
    <DetailFooter v-else-if="$store.state.isDetailPage" />
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