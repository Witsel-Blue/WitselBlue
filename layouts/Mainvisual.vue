<template>
    <div id='mainvisual'>
        <client-only>
            <MainP5 />
            <MainThree />
        </client-only>
        <StarBg />
        <div class='grad' />
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


#star-bg {
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10vh 10vw;
}

.grad {
    width: 100%;
    height: 110%;
    margin: -15vh auto 0;
    background: radial-gradient(circle, #f7f7f7 0%, transparent 60%);
    opacity: 0.4;
}
</style>