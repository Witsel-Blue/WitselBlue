<template>
    <main class='home'>
        <Mainvisual />
    </main>
</template>

<script>
import Mainvisual from '@/components/home/Mainvisual.vue';

export default {
    components: {
        Mainvisual,
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
