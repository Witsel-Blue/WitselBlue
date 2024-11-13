<template>
    <div id="parallax-img">
        <img :src="src">
    </div>
</template>

<script>
    export default {
        props: {
            src: String,
        },
        data() {
            return {

            }
        }
    }
</script>

<style lang="scss" scoped>

</style>