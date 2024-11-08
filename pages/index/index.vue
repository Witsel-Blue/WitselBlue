<template>
    <div id="home">
        <section id="mainvisual">
          <p class="subtext">
            this is
          </p>
          <TextScroll :text="'WitselBlue'"></TextScroll>
        </section>
        <section>
            on construction!
        </section>
    </div>
</template>

<script>
  import TextScroll from '@/components/TextScroll.vue';

  export default {
    name: 'Index',
    components: {
      TextScroll,
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
      section:nth-child(1) {
        .subtext {
          margin-top: -8rem;
          text-align: center;
          font-size: 2rem;
          line-height: 1.2;
        }
      }
  }
</style>