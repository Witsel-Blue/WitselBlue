<template>
  <div>
    <h1>{{ music?.title || 'Not Found' }}</h1>
  </div>
</template>

<script>
import archiveMusicData from '@/assets/data/archive_music.js'

export default {
  async asyncData({ params, store }) {
    const music = archiveMusicData.find(p => p.slug === params.slug);

    store.commit('setDetailPage', true);

    return { 
      music
    }
  },
  beforeDestroy() {
    this.$store.commit('setDetailPage', false);
  },
}
</script>