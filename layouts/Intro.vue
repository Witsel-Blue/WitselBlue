<template>
    <div class='intro' v-show='visible'>
        <div class='inner'>
            <TextTyping text='Hello World' />
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

    #text-typing::v-deep {
        text-align: center;
        color: $white1;
        h1 {
            font-size: 4rem;
            line-height: 1.2;
            font-family: 'TanPearl', 'YUniverse';
            word-break: keep-all;
            &.ko {
                font-size: 5rem;
            }
            &.cursor::after {
                background-color: rgba(255, 255, 255, 0.5);
            }
        }
    }
}

// mobile
@media all and (max-width: $mobile) {
    .inner-s {
        width: 60%;
    }

    #text-typing::v-deep {
        h1 {
            font-size: 3rem;    
            &.ko {
                font-size: 4rem;
            }
        }
    }
}
</style>
