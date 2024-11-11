<template>
    <div id="page-transition">
        <div class="bg">
            <TextMask 
                :text="title">
            </TextMask>
        </div>
        <div class="bg2"></div>
    </div>
</template>

<script>
    import TextMask from '@/components/TextMask.vue';

    export default {
        components: {
            TextMask,
        },
        props: {
            title: String,
        },
        data() {
            return {
            }
        },
        mounted() {
            this.pageTransition();
            window.scrollTo({
                top: 0,
            });
        },
        methods: {
            pageTransition() {
                setTimeout(function(){
                    document.getElementById('page-transition').classList.add('active');
                }, 1000);
            },
        }
    }
</script>

<style lang="scss" scoped>
    .bg {
        width: 400vw;
        height: 180vh;
        position: fixed;
        top: -180%;
        left: -150vw;
        z-index: 100;
        background-color: #2c2a2a;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10vh;
        font-size: 5rem;
        opacity: 1;
        visibility: visible;
        transition: all 0.4s;
        border-radius: 50%;
        animation: animation 2s;
    }
    .bg2 {
        width: 100%;
        height: 100%;
        background-color: #f7f7f7;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;
    }

    #page-transition.active {
        .bg2 {
            opacity: 0;
            visibility: hidden;
            z-index: -999;
            transition: all 0.4s;
        }
    }

    @keyframes animation {
        0% {
            top: 140%;
        }
        20% {
            top: -40vh;
        }
        80% {
            top: -40vh;
        }
        100% {
            top: -180%;
        }
    }
</style>