<template>
    <div id='mainvisual'>
        <!-- <MainThree /> -->
        <client-only>
            <MainP5 />
        </client-only>
        <StarBg />
    </div>
</template>
  
<script>
// import MainThree from '@/components/MainThree.vue';
import MainP5 from '@/components/MainP5.vue';
import StarBg from '@/components/StarBg.vue';

export default {
    name: 'Mainvisual',
    components: {
        // MainThree,
        MainP5,
        StarBg,
    },
}
</script>
  
<style lang='scss' scoped>
    #star-bg {
        position: absolute;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10vh 10vw;
    }
</style>