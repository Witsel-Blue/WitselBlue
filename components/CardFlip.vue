<!-- <template>
  <div id="card-flip" v-if="item">
    <div class="front">
      <img :src="item.images.thumb" :alt="item.title" />
    </div>
    <div class="back">
      <nuxt-link :to="`${
        item.category === 'projects' ? '/projects' :
        item.category === 'archive_dev' ? '/archive/dev' :
        '/archive/music'
        }/${item.slug}`">
        {{ item.title }}
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: null
    }
  }
}
</script> -->