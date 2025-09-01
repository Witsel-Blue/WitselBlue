<template>
    <div id="page-transition" ref="pageTransition">
        <div class="bg">
            <TextMask 
                :text="title"
            />
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
        defautl: '',
    },
    data() {
        return {
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.pageTransition();
            window.scrollTo({ top: 0 });
        });
    },
    methods: {
        pageTransition() {
            const el = this.$refs.pageTransition;
            if (!el) return;

            setTimeout(() => {
                el.classList.add('active');
            }, 1200);

            setTimeout(() => {
                el.classList.add('active2');
            }, 2000);
        },
    }
}
</script>

<style lang="scss" scoped>
    @use '@/assets/scss/base/variables.scss' as *;

    .bg {
        width: 400vw;
        height: 180vh;
        position: fixed;
        top: -180%;
        left: -150vw;
        z-index: 105;
        background: radial-gradient(circle, $blue1 0%, $white1 50%);
        // background-color: $black2;
        color: $white1;
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
        background-color: $white2;
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

    #page-transition.active2 {
        display: none;
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

    // mobile
    @media all and (max-width: $mobile) {
        #page-transition {
            #text-mask {
                max-width: 80vw;
                font-size: 3rem;
            }
        } 
    }
</style>