<template>
    <div id="home">
        <section id="mainvisual">
            <Zizi></Zizi>
        </section>
        <section>
            on construction!
        </section>
    </div>
</template>

<script>
  import Zizi from '@/components/p5/zizi.vue';

  export default {
    name: 'Index',
    components: {
      Zizi,
    }
  }
</script>

<style lang="scss" scoped>
  #home {
      section {
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
      }
  }
</style>