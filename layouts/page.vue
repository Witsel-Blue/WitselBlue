<template>
    <div id="default">
        <Nuxt />
    </div>
</template>

<script>
export default {
    name: 'DefaultLayout',
}
</script>

<style lang="scss" scoped>
    @import '/assets/scss/layout/layout.scss';

    #default {
        width: 100vw;
        min-height: 100vh;
    }
</style>