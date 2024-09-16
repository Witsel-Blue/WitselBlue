<template>
    <div id="default">

        <div class="inner">
            <Nuxt></Nuxt>
        </div>

        <!-- <p5test></p5test>
        <Threetest></Threetest> -->
        
    </div>
</template>

<script>
    import GNB from '@/layouts/gnb.vue';
    import p5test from '@/components/test/p5test.vue';
    import Threetest from '@/components/test/Threetest.vue';

    export default {
        name: 'defaultLayout',
        components: {
            GNB,
            p5test,
            Threetest,
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