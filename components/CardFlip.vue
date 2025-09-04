<template>
  <div id='card-flip'>
    <div class='front'>
      <div class='res-box-wrap'>
        <div class='res-box'>
          <img :src='item.images.thumb' />
        </div>
      </div>
    </div>
    <div class='back'>
      <span v-if='item'>
        <Nuxt-link
          :to="item.category === 'projects' ? `/projects/${item.slug}` :
              item.category === 'archive_dev' ? `/archive/dev/${item.slug}` :
              item.category === 'archive_music' ? `/archive/music/${item.slug}` :
              '/'"
        >
          {{ item.title }}
        </Nuxt-link>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: null,
    }
  },
}
</script>

<style lang='scss' scoped>
.back {
  a {
    font-family: "Diphylleia";
  }
}
</style>