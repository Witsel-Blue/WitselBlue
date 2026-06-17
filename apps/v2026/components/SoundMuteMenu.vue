<template>
    <div id='sound-mute-menu'>
        <button @click='toggleMute'>
            <p>Mute</p>
        </button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                isMuted: false,
            };
        },
    };
</script>

<style lang='scss' scoped>
@use '@/assets/scss/base/variables.scss' as *;

#sound-mute-menu {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: $white-inverted;
    text-indent: -9999px;
    position: absolute;
    left: 2.5vw;
    bottom: 2.5vw;
}
</style>