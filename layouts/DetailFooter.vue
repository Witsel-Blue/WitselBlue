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
                        <swiper-slide 
                            v-for='(item, index) in allItems' 
                            :key='`${item.category}-${item.slug}-${index}`'
                            :data-slide-index='index'
                            :class="getSlideClass(index)"
                            :style="getSlideStyle(index)"
                        >
                            <CardFlip 
                                :item='item' 
                                :class="{ active: isActive(index) }"
                                v-scroll-animate='{ start: "top 80%"}'
                            />
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
                        :text="getButtonText()"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CardFlip from '@/components/CardFlip.vue';
import ButtonRound from '@/components/ButtonRound.vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (process.client) {
    gsap.registerPlugin(ScrollTrigger);
}

export default {
    components: {
        CardFlip,
        ButtonRound,
    },
    data() {
        return {
            useVhFix: false,
            activeIndex: 0,
            titleST: null,
        }
    },
    computed: {
        swiperOptions() {
            return {
                loop: false,
                centeredSlides: true,
                slidesPerView: 'auto',
                grabCursor: true,
                initialSlide: this.nextItemIndex,
                mousewheel: {
                    enabled: true,
                    sensitivity: 1,
                    releaseOnEdges: true,
                },
                on: {
                    slideChange: () => {
                        if (this.$refs.swiper && this.$refs.swiper.$swiper) {
                            this.activeIndex = this.$refs.swiper.$swiper.realIndex;
                        }
                    }
                }
            };
        },
        allItems() {
            let items = [];
            if (this.isProjectPage) {
                items = this.$store.state.allProjects || [];
            } else if (this.isArchiveDevPage) {
                items = this.$store.state.allArchiveDev || [];
            } else if (this.isArchiveMusicPage) {
                items = this.$store.state.allArchiveMusic || [];
            }
            
            // 현재 페이지의 slug와 일치하는 아이템 제외
            const currentSlug = this.$route.params.slug;
            if (currentSlug) {
                items = items.filter(item => item.slug !== currentSlug);
            }
            
            return items;
        },
        nextItemIndex() {
            const currentSlug = this.$route.params.slug;
            if (!currentSlug || this.allItems.length === 0) return 0;
            
            // 원본 리스트 가져오기
            let allItemsWithCurrent = [];
            let currentIndex = -1;
            
            if (this.isProjectPage) {
                allItemsWithCurrent = this.$store.state.allProjects || [];
                currentIndex = allItemsWithCurrent.findIndex(item => item.slug === currentSlug);
            } else if (this.isArchiveDevPage) {
                allItemsWithCurrent = this.$store.state.allArchiveDev || [];
                currentIndex = allItemsWithCurrent.findIndex(item => item.slug === currentSlug);
            } else if (this.isArchiveMusicPage) {
                allItemsWithCurrent = this.$store.state.allArchiveMusic || [];
                currentIndex = allItemsWithCurrent.findIndex(item => item.slug === currentSlug);
            }
            
            if (currentIndex === -1 || allItemsWithCurrent.length === 0) return 0;
            
            // 원본 리스트에서 다음 아이템 찾기
            const nextIndex = (currentIndex + 1) % allItemsWithCurrent.length;
            const nextItem = allItemsWithCurrent[nextIndex];
            
            // 다음 아이템이 자기 자신이면 그 다음으로
            if (nextItem && nextItem.slug === currentSlug) {
                const nextNextIndex = (currentIndex + 2) % allItemsWithCurrent.length;
                const nextNextItem = allItemsWithCurrent[nextNextIndex];
                if (nextNextItem) {
                    const filteredIndex = this.allItems.findIndex(item => item.slug === nextNextItem.slug);
                    return filteredIndex >= 0 ? filteredIndex : 0;
                }
                return 0;
            }
            
            // 필터링된 리스트에서 다음 아이템의 인덱스 찾기
            if (nextItem) {
                const filteredIndex = this.allItems.findIndex(item => item.slug === nextItem.slug);
                return filteredIndex >= 0 ? filteredIndex : 0;
            }
            
            return 0;
        },
        isProjectPage() {
            if ((this.$store.state.allArchiveDev && this.$store.state.allArchiveDev.length > 0) ||
                (this.$store.state.allArchiveMusic && this.$store.state.allArchiveMusic.length > 0)) {
                return false;
            }
            return this.$store.state.allProjects && this.$store.state.allProjects.length > 0;
        },
        isArchiveDevPage() {
            if (this.$store.state.allArchiveMusic && this.$store.state.allArchiveMusic.length > 0) {
                return false;
            }
            return this.$store.state.allArchiveDev && this.$store.state.allArchiveDev.length > 0;
        },
        isArchiveMusicPage() {
            return this.$store.state.allArchiveMusic && this.$store.state.allArchiveMusic.length > 0;
        },
    },
    mounted() {
        this.setVhFix();
        window.addEventListener('resize', this.setVhFix);
        this.$nextTick(() => {
            this.bgScroll();
            window.addEventListener('scroll', this.bgScroll);
            this.activeIndex = this.nextItemIndex;
            this.updateSwiperInitialSlide();
            
            if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                setTimeout(() => {
                    this.initTitleAnimation();
                }, 100);
            } else {
                setTimeout(() => {
                    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                        this.initTitleAnimation();
                    }
                }, 300);
            }
        });
    },
    watch: {
        nextItemIndex() {
            this.$nextTick(() => {
                this.updateSwiperInitialSlide();
            });
        },
        allItems() {
            this.$nextTick(() => {
                this.updateSwiperInitialSlide();
            });
        },
    },
    methods: {
        getButtonText() {
            if (this.isProjectPage) {
                return this.$t('detailFooter.projects');
            } else if (this.isArchiveDevPage) {
                return this.$t('detailFooter.dev');
            } else if (this.isArchiveMusicPage) {
                return this.$t('detailFooter.music');
            }
            return '';
        },
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
            return slideIndex === this.nextItemIndex;
        },
        getSlideClass(slideIndex) {
            const diff = slideIndex - this.activeIndex;
            if (diff === 0) return 'slide-center';
            if (diff === 1) return 'slide-right-1';
            if (diff === -1) return 'slide-left-1';
            if (diff === 2) return 'slide-right-2';
            if (diff === -2) return 'slide-left-2';
            if (diff > 2) return 'slide-right-far';
            if (diff < -2) return 'slide-left-far';
            return '';
        },
        getSlideStyle(slideIndex) {
            const diff = slideIndex - this.activeIndex;
            
            if (diff === 0) {
                // 정중앙
                return {
                    transform: 'scale(1) rotate(0deg)',
                    opacity: '1',
                    zIndex: '1',
                    filter: 'brightness(1)',
                };
            } else {
                const absDiff = Math.abs(diff);
                
                // 중앙 기준 4번째부터 끝까지는 opacity 0
                if (absDiff >= 4) {
                    return {
                        opacity: '0',
                        zIndex: '-1',
                    };
                }
                
                const scale = Math.max(0.6, 0.8 - (absDiff - 3) * 0.05);
                const rotate = diff > 0 ? `${absDiff * 2}deg` : `-${absDiff * 2}deg`;
                const translateYPercent = 10 + (absDiff - 1) * 5;
                const translateYOffset = absDiff <= 2 ? 16 : 8;
                
                if (diff > 0) {
                    // 오른쪽
                    const translateX = absDiff === 3 
                        ? 'calc(100% - 218px - 5%)'
                        : `calc(${absDiff * 100}% - ${218 * absDiff}px)`;
                    return {
                        transform: `translate3d(${translateX}, calc(${translateYPercent}% - ${translateYOffset}px), -100px) rotateZ(${rotate}) scale(${scale})`,
                        opacity: `${Math.max(0.5, 0.6 - (absDiff - 3) * 0.1)}`,
                        zIndex: '-1',
                        filter: 'brightness(0.9)',
                    };
                } else {
                    // 왼쪽
                    const translateX = absDiff === 3 
                        ? 'calc(-100% + 218px + 5%)'
                        : `calc(-${absDiff * 100}% + ${218 * absDiff}px)`;
                    return {
                        transform: `translate3d(${translateX}, calc(${translateYPercent}% - ${translateYOffset}px), -100px) rotateZ(${rotate}) scale(${scale})`,
                        opacity: `${Math.max(0.5, 0.6 - (absDiff - 3) * 0.1)}`,
                        zIndex: '-1',
                        filter: 'brightness(0.9)',
                    };
                }
            }
        },
        updateSwiperInitialSlide() {
            if (this.$refs.swiper && this.$refs.swiper.$swiper && this.allItems.length > 0) {
                this.$refs.swiper.$swiper.slideTo(this.nextItemIndex, 0);
                this.activeIndex = this.nextItemIndex;
            }
        },
        bgScroll() {
            const footerBg = this.$refs.bg;
            if (!footerBg) return;

            const winH = window.innerHeight;
            const scrollY = window.scrollY;
            const footerTop = footerBg.offsetTop;
            const scrollStart = footerTop - (winH * 2 / 3);

            let r = 0;

            if (scrollY >= scrollStart) {
                const h = -(scrollY - footerTop);
                const x = footerTop - scrollStart;
                r = (h / x) * 100;
            } else if (scrollY + winH >= footerTop) {
                const h = -(scrollY - footerTop);
                const x = footerTop - scrollStart;
                r = (h / x) * 100;
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
        initTitleAnimation() {
            if (!process.client) return;
            
            if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
                console.warn('[DetailFooter] GSAP or ScrollTrigger not loaded');
                return;
            }
            
            if (!this.$refs.title) {
                console.warn('[DetailFooter] title ref not found');
                return;
            }
            
            if (this.titleST) {
                this.titleST.kill();
                this.titleST = null;
            }

            this.titleST = ScrollTrigger.create({
                trigger: this.$refs.title,
                start: 'center 80%',
                onEnter: () => {
                    this.triggerFlipAnimation();
                },
                onEnterBack: () => {
                    this.triggerFlipAnimation();
                },
                once: false,
                markers: false
            });
            
            ScrollTrigger.refresh();
        },
        triggerFlipAnimation() {
            if (!this.$refs.title) return;
            
            const title = this.$refs.title;
            const spans = title.querySelectorAll('span');
            
            title.classList.remove('active');
            
            spans.forEach(span => {
                span.style.animation = 'none';
            });
            
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    spans.forEach(span => {
                        span.style.animation = '';
                    });
                    title.classList.add('active');
                });
            });
        },
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.setVhFix);
        window.removeEventListener('scroll', this.bgScroll);
        if (this.titleST) {
            this.titleST.kill();
            this.titleST = null;
        }
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

            ::v-deep .swiper-wrapper {
                .swiper-slide {
                    width: 218px;
                    height: 272px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transition: transform 0.2s ease, z-index 0.2s ease;
                    position: relative;

                    &.swiper-slide-active {
                        margin: 0 16px;
                    }

                    #card-flip {
                        width: 100%;
                        height: 100%;
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
        transition: all 0.2s;
        transition-delay: 0.2s;

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
            transition: all 0.2s;
            transition-delay: 0.2s;
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