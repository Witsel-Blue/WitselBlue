<template>
    <div id='app' :class="{ 'lang-ko': $i18n.locale === 'ko' }">
        <!-- <div class='ripple-target'> -->
            <Nuxt />
            <LanguageMenu />
        <!-- </div>
        <MouseRipple /> -->
    </div>
</template>

<script>
import LanguageMenu from '@/components/LanguageMenu.vue';
import MouseRipple from '@/components/MouseRipple.vue';

export default {
    components: {
        LanguageMenu,
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

#language-menu {
    position: fixed;
    top: 2.5vw;
    right: 2.5vw;
    z-index: 10;
}
</style>
