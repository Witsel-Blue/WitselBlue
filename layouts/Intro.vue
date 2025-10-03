<template>
    <div class='intro' v-show='visible'>
        <p>Hello World</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            visible: true,
        }
    },
    mounted() {
        setTimeout(() => {
            this.visible = false;
            this.$emit('end');
        }, 2500);
    }
}
</script>

<style lang='scss' scoped>
@use '@/assets/scss/base/variables.scss' as *;

.intro {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    transition: opacity 0.4s;
    background: $grad-blue;
}
p {
    text-align: center;
    color: $white1;
    font-size: 6rem;
    font-weight: bold;
    font-family: 'TanPearl';
}

// mobile
@media all and (max-width: $mobile) {
    p {
        font-size: 4rem;
    }
}
</style>
