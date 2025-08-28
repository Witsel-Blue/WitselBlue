<template>
    <div id="button-scrolldown">
        <button 
            class="scroll-down mouse-hover1"
            @click="scrollDown"
        >
            <img src="@/assets/img/arrow.svg">
        </button>
    </div>
</template>

<script>
export default {
    methods: {
        scrollDown() {
            const h = window.innerHeight;
            window.scrollTo({
                top: h * 0.3,
                behavior: 'smooth',
            });
        }
    },
}
</script>

<style lang="scss" scoped>
    @use '@/assets/scss/base/variables.scss' as *;
    
    #button-scrolldown {
        text-align: center;
    }
    button {
        background-color: transparent;
        width: 40px;
        height: 40px;
        margin: 10px 0;
        
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
            -webkit-transform: translateY(-10px);
            -ms-transform: translateY(-10px);
            transform: translateY(-10px);
        }
        60% {
            -webkit-transform: translateY(-5px);
            -ms-transform: translateY(-5px);
            transform: translateY(-5px);
        }
    }

    // mobile
    @media all and (max-width: $mobile) {
        button {
            width: 32px;
            height: 32px;
        }
    }
</style>