<template>
    <div id="text-mask">
        {{ text }}

    </div>
</template>

<script>
    export default {
        props: {
            text: String,
        },
    }
</script>

<style lang="scss" scoped>
    #text-mask {
        color: transparent;
        -webkit-text-stroke: 2px #fff;
    }
</style>