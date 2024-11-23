<template>
  <div id="app">
    
    <CursorCustom></CursorCustom>
    <GNB></GNB>
    <Page></Page>

  </div>
</template>

<script>
  import Page from '@/layouts/page.vue';
  import GNB from '@/layouts/gnb.vue';
  import CursorCustom from '@/components/CursorCustom.vue';

  export default {
    name: 'Home',
    components: {
      Page,
      GNB,
      CursorCustom,
    }
  }
</script>