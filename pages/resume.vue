<template>
    <div
        id='resume'
        oncontextmenu='return false'
        ondragstart='return false'
        onselectstart='return false'
    >
        <CursorCustom />
        <client-only>
            <swiper :options='swiperOptions'>
                <swiper-slide>
                    <img src='@/static/resume.png'>
                </swiper-slide>
                <swiper-slide>
                    <img src='@/static/CareerDescription1.png'>
                </swiper-slide>
                <swiper-slide>
                    <img src='@/static/CareerDescription2.png'>
                </swiper-slide>
            </swiper>
            <div class='navigation prev mouse-hover1'>
                <svg xmlns='http://www.w3.org/2000/svg' width='57' height='56' viewBox='0 0 57 56' fill='none'>
                    <path d='M1.5 28.5C19 32 28.6354 39.2134 34.5 54.5' stroke='#3E3C3C' stroke-width='7'/>
                    <path d='M1.5 27.5C19 24 28.6354 16.7866 34.5 1.5' stroke='#3E3C3C' stroke-width='7'/>
                    <path d='M-1.43051e-06 28L57 28' stroke='#3E3C3C' stroke-width='8'/>
                </svg>
            </div>
            <div class='navigation next mouse-hover1'>
                <svg xmlns='http://www.w3.org/2000/svg' width='57' height='56' viewBox='0 0 57 56' fill='none'>
                    <path d='M55.5 27.5C38 24 28.3646 16.7866 22.5 1.5' stroke='#3E3C3C' stroke-width='7'/>
                    <path d='M55.5 28.5C38 32 28.3646 39.2134 22.5 54.5' stroke='#3E3C3C' stroke-width='7'/>
                    <path d='M57 28L0 28' stroke='#3E3C3C' stroke-width='8'/>
                </svg>
            </div>
        </client-only>
    </div>
</template>

<script>
import CursorCustom from '@/components/CursorCustom.vue';

export default {
    components: {
        CursorCustom,
    },
    data() {
        return {
            swiperOptions: {
                loop: true,
                slidesPerView: 1,
                navigation: {
                    nextEl: '.next',
                    prevEl: '.prev',
                }
            }
        }
    },
    async asyncData({ store }) {
        store.commit('setNoUIPage', true);
    },
    beforeDestroy() {
        this.$store.commit('setNoUIPage', false);
    }
}
</script>

<style lang='scss' scoped>
    @use '@/assets/scss/base/variables.scss' as *;
    
    #resume {
        background-color: $white2;
        -webkit-touch-callout: none;
        user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        -webkit-user-select: none;
    }

    .navigation {
        position: fixed;
        top: 50%;
        transform: translateY(-50%);
        z-index: 100;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px;
        transition: background 0.6s;
    }
    .prev {
        left: 2.5vw;
        transition: stroke 0.4s;
    }
    .next {
        right: 2.5vw;
        transition: stroke 0.4s;
    }
    .prev:hover,
    .next:hover {
        background-color: $black1;
        transition: background 0.6s;
    }
    .prev:hover svg path,
    .next:hover svg path {
        stroke: #fff;
        transition: stroke 0.4s;
    }

    svg {
        width: 100%;
        height: auto;
    }
</style>