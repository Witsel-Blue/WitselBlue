<template>
    <div id='mainvisual'>
        <client-only>
            <MainP5 />
            <!-- <MainThree /> -->
        </client-only>
        <StarBg />
    </div>
</template>
  
<script>
import MainThree from '@/components/MainThree.vue';
import MainP5 from '@/components/MainP5.vue';
import StarBg from '@/components/StarBg.vue';

export default {
    name: 'Mainvisual',
    components: {
        MainThree,
        MainP5,
        StarBg,
    },
}
</script>
  
<style lang='scss' scoped>
#mainvisual {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
}

#MainThree {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.p5-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
  background: transparent !important;
}

#star-bg {
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10vh 10vw;
}
</style>