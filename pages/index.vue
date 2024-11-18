<template>
  <div id="app">
    
    <GNB></GNB>
    <Page></Page>
    <Footer></Footer>

  </div>
</template>

<script>
  import Page from '@/layouts/page.vue';
  import GNB from '@/layouts/gnb.vue';
  import Footer from '@/layouts/Footer.vue';

  export default {
    name: 'Home',
    components: {
      Page,
      GNB,
      Footer
    }
  }
</script>