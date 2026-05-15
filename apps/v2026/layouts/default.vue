<template>
    <div id='app'>
        <Nuxt />
    </div>
</template>

<style lang='scss' scoped>
@use '@/assets/scss/base/variables' as *;

#app {
    min-height: 100vh;
    box-sizing: border-box;
    background-color: $black_bg;
    color: $white;
}
</style>
