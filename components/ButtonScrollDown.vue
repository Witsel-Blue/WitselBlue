<template>
    <div id="button-scrolldown">
        <p>scroll down</p>
        <button 
            @click="scrollDown"
            class="scroll-down">
            <img src="@/assets/img/arrow.svg">
        </button>
    </div>
</template>

<script>
    export default {
        mounted() {
            this.scrollDown();
        },
        methods: {
            scrollDown() {
                var h = window.innerHeight;
                window.scrollTo({
                    top: h,
                    behavior: 'smooth',
                });
            }
        },
    }
</script>

<style lang="scss" scoped>
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
</style>