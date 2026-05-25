<template>
    <div id='app'>
        <!-- <div class='ripple-target'> -->
            <Nuxt />
        <!-- </div>
        <MouseRipple /> -->
    </div>
</template>

<script>
// import MouseRipple from '@/components/MouseRipple.vue';

export default {
    components: {
        MouseRipple,
    },
};
</script>

<style lang='scss' scoped>
@use '@/assets/scss/base/variables' as *;

#app {
    min-height: 100vh;
    box-sizing: border-box;
    background-color: $black_bg;
    color: $white;
}
</style>

<style>
.ripple-target {
    min-height: 100vh;
    filter: url(#mouse-ripple-filter);
    -webkit-filter: url(#mouse-ripple-filter);
    will-change: filter;
    isolation: isolate;
}
</style>
