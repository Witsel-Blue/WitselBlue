<template>
    <div class='wave-container'>
        <div class='box'>
            <div class='wave -one'></div>
            <div class='wave -two'></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Wave',
}
</script>

<style lang='scss' scoped>
@use '@/assets/scss/base/variables.scss' as *;

.wave-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}

.box {
    width: 100%;
    height: 5vw;
    background: transparent;
    position: relative;
    overflow: hidden;
    transform: translate3d(0, 0, 0);
}

.wave {
    position: absolute;
    top: 0;
    left: 50%;
    background: $gray1;
    width: 800vw;
    height: 800vw;
    margin-left: -400vw;
    margin-top: -800vw;
    transform-origin: 50% 50%;
    border-radius: 49%;
    animation: drift 7s infinite linear;
    
    &.-two {
        opacity: 0.5;
        animation: drift 8s infinite linear;
    }
}

@keyframes drift {
    from { 
        transform: rotate(0deg); 
    }
    to { 
        transform: rotate(360deg); 
    }
}
</style>

