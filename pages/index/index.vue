<template>
    <div id="home">
        <section id="mainvisual">
          <p class="subtext">
            this is
          </p>
          <TextScroll :text="'WitselBlue'"></TextScroll>
        </section>
        <section>
            <p data-aos="fade-up">on construction!</p>
        </section>
        <Footer></Footer>
    </div>
</template>

<script>
  import Footer from '@/layouts/Footer.vue';
  import TextScroll from '@/components/TextScroll.vue';

  export default {
    name: 'Index',
    components: {
      Footer,
      TextScroll,
    },
    mounted() {
      window.scrollTo({
        top: 0,
      });
    },
  }
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/layout/home.scss';
</style>