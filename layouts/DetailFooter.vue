<template>
    <div id='detail_footer' :class="{ 'use-vh-fix': useVhFix }">
        <div ref='bg' class='footer-bg'></div>
        <div class='footer'>
            <div class='top'>
                <h1 ref='title'>
                    <span class='ft-tanpearl' style='--i:1'>N</span>
                    <span class='ft-tanpearl' style='--i:2'>e</span>
                    <span class='ft-tanpearl' style='--i:3'>x</span>
                    <span class='ft-tanpearl' style='--i:4'>t</span>
                </h1>
            </div>
            <div class='bottom'>
                <client-only>
                    <swiper 
                        ref='swiper'
                        :options='swiperOptions'
                        class='card-swiper'
                        @slideChange='onSlideChange'
                    >
                        <swiper-slide v-if='prevPrevProject' data-slide-index='0'>
                            <CardFlip :item='prevPrevProject' :class="{ active: isActive(0) }" />
                        </swiper-slide>
                        <swiper-slide v-if='prevPrevArchiveDev' data-slide-index='0'>
                            <CardFlip :item='prevPrevArchiveDev' :class="{ active: isActive(0) }" />
                        </swiper-slide>
                        <swiper-slide v-if='prevPrevArchiveMusic' data-slide-index='0'>
                            <CardFlip :item='prevPrevArchiveMusic' :class="{ active: isActive(0) }" />
                        </swiper-slide>
                        <swiper-slide v-if='prevProject' data-slide-index='1'>
                            <CardFlip :item='prevProject' :class="{ active: isActive(1) }" />
                        </swiper-slide>
                        <swiper-slide v-if='prevArchiveDev' data-slide-index='1'>
                            <CardFlip :item='prevArchiveDev' :class="{ active: isActive(1) }" />
                        </swiper-slide>
                        <swiper-slide v-if='prevArchiveMusic' data-slide-index='1'>
                            <CardFlip :item='prevArchiveMusic' :class="{ active: isActive(1) }" />
                        </swiper-slide>
                        <swiper-slide v-if='nextProject' data-slide-index='2'>
                            <CardFlip :item='nextProject' :class="{ active: isActive(2) }" />
                        </swiper-slide>
                        <swiper-slide v-if='nextArchiveDev' data-slide-index='2'>
                            <CardFlip :item='nextArchiveDev' :class="{ active: isActive(2) }" />
                        </swiper-slide>
                        <swiper-slide v-if='nextArchiveMusic' data-slide-index='2'>
                            <CardFlip :item='nextArchiveMusic' :class="{ active: isActive(2) }" />
                        </swiper-slide>
                        <swiper-slide v-if='nextNextProject' data-slide-index='3'>
                            <CardFlip :item='nextNextProject' :class="{ active: isActive(3) }" />
                        </swiper-slide>
                        <swiper-slide v-if='nextNextArchiveDev' data-slide-index='3'>
                            <CardFlip :item='nextNextArchiveDev' :class="{ active: isActive(3) }" />
                        </swiper-slide>
                        <swiper-slide v-if='nextNextArchiveMusic' data-slide-index='3'>
                            <CardFlip :item='nextNextArchiveMusic' :class="{ active: isActive(3) }" />
                        </swiper-slide>
                        <swiper-slide v-if='nextNextNextProject' data-slide-index='4'>
                            <CardFlip :item='nextNextNextProject' :class="{ active: isActive(4) }" />
                        </swiper-slide>
                        <swiper-slide v-if='nextNextNextArchiveDev' data-slide-index='4'>
                            <CardFlip :item='nextNextNextArchiveDev' :class="{ active: isActive(4) }" />
                        </swiper-slide>
                        <swiper-slide v-if='nextNextNextArchiveMusic' data-slide-index='4'>
                            <CardFlip :item='nextNextNextArchiveMusic' :class="{ active: isActive(4) }" />
                        </swiper-slide>
                    </swiper>
                </client-only>
                <div class='view-all'>
                    <ButtonRound
                        :link="{
                            href: isProjectPage
                                ? '/projects'
                                : isArchiveDevPage
                                ? '/archive/dev'
                                : isArchiveMusicPage
                                ? '/archive/music'
                                : null
                        }"
                        :text="isProjectPage
                            ? $t('detailFooter.projects')
                            : isArchiveDevPage
                            ? $t('detailFooter.dev')
                            : isArchiveMusicPage
                            ? $t('detailFooter.music')
                            : ''"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CardFlip from '@/components/CardFlip.vue';
import ButtonRound from '@/components/ButtonRound.vue';

export default {
    components: {
        CardFlip,
        ButtonRound,
    },
    props: {
        nextProject: {
            type: Object,
            default: null,
        },
        prevProject: {
            type: Object,
            default: null,
        },
        prevPrevProject: {
            type: Object,
            default: null,
        },
        nextNextProject: {
            type: Object,
            default: null,
        },
        nextNextNextProject: {
            type: Object,
            default: null,
        },
        nextArchiveDev: {
            type: Object,
            default: null,
        },
        prevArchiveDev: {
            type: Object,
            default: null,
        },
        prevPrevArchiveDev: {
            type: Object,
            default: null,
        },
        nextNextArchiveDev: {
            type: Object,
            default: null,
        },
        nextNextNextArchiveDev: {
            type: Object,
            default: null,
        },
        nextArchiveMusic: {
            type: Object,
            default: null,
        },
        prevArchiveMusic: {
            type: Object,
            default: null,
        },
        prevPrevArchiveMusic: {
            type: Object,
            default: null,
        },
        nextNextArchiveMusic: {
            type: Object,
            default: null,
        },
        nextNextNextArchiveMusic: {
            type: Object,
            default: null,
        },
    },
    data() {
        return {
            useVhFix: false,
            activeIndex: 2,
            swiperOptions: {
                loop: false,
                centeredSlides: true,
                slidesPerView: 'auto',
                grabCursor: true,
                loopedSlides: 1,
                loopAdditionalSlides: 1,
                initialSlide: 2,
                on: {
                    slideChange: () => {
                        if (this.$refs.swiper && this.$refs.swiper.$swiper) {
                            this.activeIndex = this.$refs.swiper.$swiper.realIndex;
                        }
                    }
                }
            }
        }
    },
    computed: {
        isProjectPage() {
            return !!this.nextProject;
        },
        isArchiveDevPage() {
            return !!this.nextArchiveDev;
        },
        isArchiveMusicPage() {
            return !!this.nextArchiveMusic;
        },
        totalSlides() {
            let count = 0;
            if (this.prevProject || this.prevArchiveDev || this.prevArchiveMusic) count++;
            if (this.nextProject || this.nextArchiveDev || this.nextArchiveMusic) count++;
            if (this.nextNextProject || this.nextNextArchiveDev || this.nextNextArchiveMusic) count++;
            return count;
        },
    },
    mounted() {
        this.setVhFix();
        window.addEventListener('resize', this.setVhFix);
        this.$nextTick(() => {
            this.bgScroll();
            window.addEventListener('scroll', this.bgScroll);
            if (this.$refs.swiper && this.$refs.swiper.$swiper) {
                this.activeIndex = this.$refs.swiper.$swiper.realIndex;
            }
        });
    },
    methods: {
        onSlideChange() {
            if (this.$refs.swiper && this.$refs.swiper.$swiper) {
                this.activeIndex = this.$refs.swiper.$swiper.realIndex;
            }
        },
        isActive(slideIndex) {
            if (this.$refs.swiper && this.$refs.swiper.$swiper) {
                const realIndex = this.$refs.swiper.$swiper.realIndex;
                return realIndex === slideIndex;
            }
            return slideIndex === 2;
        },
        bgScroll() {
            const footerBg = this.$refs.bg;
            const title = this.$refs.title;
            if (!footerBg || !title) return;

            const winH = window.innerHeight;
            const scrollY = window.scrollY;
            const footerTop = footerBg.offsetTop;
            const scrollStart = footerTop - (winH * 2 / 3);

            let r = 0;

            if (scrollY >= scrollStart) {
                const h = -(scrollY - footerTop);
                const x = footerTop - scrollStart;
                r = (h / x) * 100;
                title.classList.add('active');
            } else if (scrollY + winH >= footerTop) {
                const h = -(scrollY - footerTop);
                const x = footerTop - scrollStart;
                r = (h / x) * 100;
                title.classList.add('active');
            } else {
                title.classList.remove('active');
            }

            footerBg.style.borderRadius = `0 0 ${r}% ${r}%`;
        },
        setVhFix() {
            const ua = navigator.userAgent.toLowerCase();
            const isMobile = /iphone|ipad|ipod|android/.test(ua);
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

            this.useVhFix = isMobile || isSafari;

            if (this.useVhFix) {
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
            } else {
                document.documentElement.style.removeProperty('--vh');
            }
        },
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.setVhFix);
        window.removeEventListener('scroll', this.bgScroll);
    },
}
</script>

<style lang='scss' scoped>
@use '@/assets/scss/base/variables.scss' as *;
    
#detail_footer {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: $grad-blue;
}

.footer-bg {
    width: 120%;
    margin-left: -10%;
    height: 20%;
    height: calc(5vh + 2rem + 5vh);
    background-color: $white2;
    border-radius: 0 0 100% 100%;
    box-shadow: $shadow-large;
}

.footer {
    color: $white1;
    width: 100%;
    height: calc(100vh - (5vh + 2rem + 5vh));
    padding: 15vh 10vw;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 40px;

    .top {
        h1 {
            font-size: 1.6rem;
            font-weight: normal;
            display: inline-flex;

            span {
                position: relative;
                display: inline-block;
                min-width: 16px;
            }

            &.active span {
                animation: flip 0.8s;
                animation-delay: calc(0.04s * var(--i));
            }
        }

        @keyframes flip {
            0%, 50% {
                transform: rotateY(360deg);
            }
        }
    }

    .bottom {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 32px;
        
        .card-swiper {
            width: 100%;
            padding: 0 10vw;
            cursor: none !important;
            overflow: visible;

            .swiper-wrapper {
                .swiper-slide {
                    width: auto;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transition: transform 0.2s ease;

                    &.swiper-slide-active {
                        #card-flip {
                            transform: scale(1);
                            opacity: 1;
                            transition: all 0.2s ease;
                            margin: 0 16px;
                        }
                    }
                
                    #card-flip {
                        transform: scale(0.8);
                        opacity: 0.8;
                        transition: all 0.2s ease;
                    }
                }
            }
        }
    }
}

.hover-flip {
    display: block;
    width: 80%;
    max-width: 300px;
    -webkit-transform: translateZ(0);
    transition: all 0.8s;
    transform-style: preserve-3d;
    position: relative;

    .back {
        transform: rotateY(180deg);
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        visibility: hidden;
        transition: all 0.1s;
        transition-delay: 0.1s;

        width: 100%;
        height: 100%;
        background-color: $white2;
        padding: 24px;
        display: flex;
        align-items: center;
        justify-content: center;

        a {
            color: $black1;
            text-align: center;
            p {
                font-size: 0.8rem;
            }
            h3 {
                margin-top: 4px;
                font-size: 1.8rem;
            }
        }
    }

    &:hover {
        transform: rotateY(180deg);
        transition: all 0.8s;
        .back {
            opacity: 1;
            visibility: visible;
            transition: all 0.1s;
            transition-delay: 0.1s;
        }
    }
}

#button-round::v-deep {
    margin-top: 16px;

    .button {
        padding: 16px;
        border-radius: 32px;
        &::after {
            border: 1px solid $white1 !important;
            border-radius: 32px;
        }
    }
    .circle::before {
        background-color: $white1 !important;
    }
    .title {
        color: $white1 !important;
    }

    &:hover {
        .title {
            color: $black1 !important;
        }
    }
}

// mobile
@media all and (max-width: $mobile) {
    .footer-bg {
        height: calc(60px + 10vw);
    }
    .footer {
        height: calc(100vh - (60px + 10vw));
        padding: 5vw 5vw 15vw 5vw;
        gap: 2.5vh;
        .top {
            h1 {
                font-size: 1.6rem;
            }
        }
        .bottom {
            gap: 2.5vh;
            #card-flip::v-deep {
                width: 50vw;
                height: 62vw;
                .card-back {
                    span > p {
                        margin-bottom: 8px;
                    }
                }
            }
        }
    }
}
</style>