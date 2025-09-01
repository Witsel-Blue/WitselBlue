<template>
  <div>
    <h1>{{ music?.title || 'Not Found' }}</h1>
  </div>
</template>

<script>
import archiveMusicData from '@/assets/data/archive_music.js'

export default {
  async asyncData({ params }) {
    const music = archiveMusicData.find(p => p.slug === params.slug)
    return { music }
  }
}
</script>