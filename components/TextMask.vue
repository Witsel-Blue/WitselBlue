<template>
    <div id="text-mask">
        <div class="top ft-bagel">
            {{ text }}
        </div>
        <div class="bottom ft-bagel">
            {{ text }}
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            text: String,
        },
    }
</script>

<style lang="scss" scoped>
    #text-mask {
        color: transparent;
        -webkit-text-stroke: 2px #f7f7f7;
        position: relative;
        overflow: hidden;
    }
    .ft-bagel {
        word-break: keep-all;
        position: relative;
        top: 0;
        left: 0;
        &.bottom {
            content: "";
            width: 100%;
            height: 100%;
            display: block;
            background-color: #f7f7f7;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            position: absolute;
            top: 0;
            left: 0;
            animation: animation 1s ease-in-out;
        }
    }

    @keyframes animation {
        0% {
            width: 0%;
        }
        100% {
            width: 100%;
        }
    }
</style>