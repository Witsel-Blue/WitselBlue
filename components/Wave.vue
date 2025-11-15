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
    background: #ededed;
    position: relative;
    overflow: hidden;
    transform: translate3d(0, 0, 0);
}

.wave {
    position: absolute;
    top: 0;
    left: 50%;
    background: #f7f7f7;
    width: 1200vw;
    height: 1200vw;
    margin-left: -600vw;
    margin-top: -1200vw;
    transform-origin: 50% 50%;
    border-radius: 49%;
    animation: drift 5s infinite linear;
    
    &.-two {
        opacity: 0.5;
        animation: drift 6s infinite linear;
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

