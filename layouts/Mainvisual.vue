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
    height: 120%;
    margin: -20vh auto 0;
    background: radial-gradient(circle, #f7f7f7 0%, transparent 60%);
    opacity: 0.6;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
}
</style>