<template>
    <div id='button-scrolldown'>
        <button 
            class='scroll-down mouse-hover1'
            @click='scrollDown'
            :style="{ opacity: buttonOpacity }"
        >
            <Lottie :animationData='ScrollDown' />
            <!-- <img src='@/assets/img/ScrollDown.svg'> -->
        </button>
    </div>
</template>

<script>
import Lottie from '@/components/Lottie.vue';
import ScrollDown from '@/assets/lottie/ScrollDown.json';

export default {
    components: {
        Lottie,
    },
    data() {
        return {
            ScrollDown,
            buttonOpacity: 1,
        }
    },
    mounted() {
        window.addEventListener('scroll', this.fadeinout);
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.fadeinout);
    },
    methods: {
        scrollDown() {
            const h = window.innerHeight;
            window.scrollTo({
                top: h * 1.25,
                behavior: 'smooth',
            });
        },
        fadeinout() {
            const maxScroll = 100;
            const scrollY = window.scrollY;
            let opacity = 1 - scrollY / maxScroll;
            if (opacity < 0) opacity = 0;
            if (opacity > 1) opacity = 1;
            this.buttonOpacity = opacity;
        },
    },
}
</script>

<style lang='scss' scoped>
@use '@/assets/scss/base/variables.scss' as *;
    
#button-scrolldown {
    text-align: center;
}
button {
    background-color: transparent;
    width: 40px;
    height: 40px;
    margin: 10px 0;
    position: relative;
        
    img {
        width: 100%;
        height: 100%;
        -webkit-animation: bounce 1s infinite 1s;
        animation: bounce 1s infinite 1s;
        -webkit-transition: all 0.2s ease-in;
        transition: all 0.2s ease-in;
    }
}

@keyframes bounce {
    0%,
    100%,
    20%,
    50%,
    80% {
        -webkit-transform: translateY(0);
        -ms-transform: translateY(0);
        transform: translateY(0);
    }
    40% {
        -webkit-transform: translateY(-8px);
        -ms-transform: translateY(-8px);
        transform: translateY(-8px);
    }
    60% {
        -webkit-transform: translateY(-3px);
        -ms-transform: translateY(-3px);
        transform: translateY(-3px);
    }
}

// mobile
@media all and (max-width: $mobile) {
    button {
        width: 16px;
        height: auto;
    }
}
</style>