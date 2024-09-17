<template>
    <div id="default">

        <div class="inner">
            <Nuxt></Nuxt>
        </div>
        
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