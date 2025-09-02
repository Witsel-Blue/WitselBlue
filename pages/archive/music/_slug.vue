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
      const index = archiveMusicData.findIndex(a => a.slug === params.slug);
      const nextArchiveMusic = archiveMusicData[(index + 1) % archiveMusicData.length];

    store.commit('setDetailPage', true);
    store.commit('setNextArchiveMusic', nextArchiveMusic);

    return { 
      music
    }
  },
  beforeDestroy() {
    this.$store.commit('setDetailPage', false);
    this.$store.commit('clearNextArchiveMusic');
  },
}
</script>