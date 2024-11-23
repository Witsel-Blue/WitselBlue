<template>
    <div id="default">

        <Nuxt></Nuxt>
        
    </div>
</template>

<script>
    export default {
        name: 'defaultLayout',
    }
</script>

<style lang="scss" scoped>
    @import '/assets/scss/layout/layout.scss';

    #default {
        width: 100vw;
        min-height: 100vh;
    }
</style>