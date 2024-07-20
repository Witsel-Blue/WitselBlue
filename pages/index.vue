<template>
  <div id="app">
    
    <GNB></GNB>
    <Page></Page>

  </div>
</template>

<script>
  import Page from '@/layouts/page.vue';
  import GNB from '@/layouts/gnb.vue';

  export default {
    name: 'Home',
    components: {
      Page,
      GNB,
    }
  }
</script>
