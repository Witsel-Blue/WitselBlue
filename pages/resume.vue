<template>
    <div
        id="resume"
        oncontextmenu="return false"
        ondragstart="return false"
        onselectstart="return false"
    >
        <CursorCustom />
        <client-only>
            <swiper :options="swiperOptions">
                <swiper-slide>
                    <img src="@/static/resume.png">
                </swiper-slide>
                <swiper-slide>
                    <img src="@/static/CareerDescription1.png">
                </swiper-slide>
                <swiper-slide>
                    <img src="@/static/CareerDescription2.png">
                </swiper-slide>
            </swiper>
            <div class="navigation prev mouse-hover1">
                <svg xmlns="http://www.w3.org/2000/svg" width="45" height="104" viewBox="0 0 45 104" fill="none">
                    <line x1="34.665" y1="95.615" x2="7.61501" y2="52.335" stroke="#3E3C3C" stroke-width="15" stroke-linecap="round"/>
                    <line x1="7.5" y1="-7.5" x2="58.5379" y2="-7.5" transform="matrix(-0.529999 0.847998 0.847998 0.529999 45 6)" stroke="#3E3C3C" stroke-width="15" stroke-linecap="round"/>
                </svg>
            </div>
            <div class="navigation next mouse-hover1">
                <svg xmlns="http://www.w3.org/2000/svg" width="45" height="104" viewBox="0 0 45 104" fill="none">
                    <line x1="10.335" y1="8.385" x2="37.385" y2="51.665" stroke="#3E3C3C" stroke-width="15" stroke-linecap="round"/>
                    <line x1="7.5" y1="-7.5" x2="58.5379" y2="-7.5" transform="matrix(0.529999 -0.847998 -0.847998 -0.529999 0 98)" stroke="#3E3C3C" stroke-width="15" stroke-linecap="round"/>
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

<style lang="scss" scoped>
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
        width: 20px;
        position: fixed;
        top: 50%;
        transform: translateY(-50%);
        z-index: 100;
    }
    .prev {
        left: 2.5vw;
        transition: stroke 0.4s;
    }
    .prev:hover svg line {
        stroke: #56779F;
        transition: stroke 0.4s;
    }
    .next {
        right: 2.5vw;
        transition: stroke 0.4s;
    }
    .next:hover svg line {
        stroke: #56779F;
        transition: stroke 0.4s;
    }

    svg {
        width: 100%;
        height: auto;
    }
</style>