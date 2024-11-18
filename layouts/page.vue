<template>
    <div id="default">

        <Nuxt></Nuxt>
        
    </div>
</template>

<script>
    import GNB from '@/layouts/gnb.vue';

    export default {
        name: 'defaultLayout',
        components: {
            GNB,
        }
    }
</script>

<style lang="scss" scoped>
    @import '/assets/scss/layout/layout.scss';

    #default {
        width: 100vw;
        min-height: 100vh;
    }
</style>