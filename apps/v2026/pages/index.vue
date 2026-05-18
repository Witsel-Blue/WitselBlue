<template>
    <main class='home'>
        <Intro />
    </main>
</template>

<script>
import Intro from '@/components/Intro.vue';

export default {
    components: {
        Intro,
    },
    methods: {
        openV2025() {
            window.location.assign(`${window.location.origin}/v2025/`)
        },
    },
}
</script>

<style lang='scss' scoped>

</style>
