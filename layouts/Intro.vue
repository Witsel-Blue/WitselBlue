<template>
    <div class='intro' v-show='visible'>
        <div class='inner-s'>
            <TextTyping />
        </div>
    </div>
</template>

<script>
import TextTyping from '@/components/TextTyping.vue';

export default {
    components: {
        TextTyping,
    },
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
@import '@/assets/scss/layout/layout.scss';

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

// mobile
@media all and (max-width: $mobile) {
    .inner-s {
        width: 60%;
    }
}
</style>
