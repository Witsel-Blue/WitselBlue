<template>
    <div id='footer' ref='footer' :class="{ 'use-vh-fix': useVhFix, 'is-home': isHomePage }">
        <div ref='bg' class='footer-bg'></div>
        <div class='footer'>
            <div class='top'>
                <h1 ref='title'>
                    <span class='ft-tanpearl' style='--i:1'>w</span>
                    <span class='ft-tanpearl' style='--i:2'>o</span>
                    <span class='ft-tanpearl' style='--i:3'>r</span>
                    <span class='ft-tanpearl' style='--i:4'>k</span>
                    <span class='ft-tanpearl' style='--i:5'></span>
                    <span class='ft-tanpearl' style='--i:6'>w</span>
                    <span class='ft-tanpearl' style='--i:7'>i</span>
                    <span class='ft-tanpearl' style='--i:8'>t</span>
                    <span class='ft-tanpearl' style='--i:9'>h</span>
                    <span class='ft-tanpearl' style='--i:10'></span>
                    <span class='ft-tanpearl' style='--i:11'>m</span>
                    <span class='ft-tanpearl' style='--i:12'>e</span>
                    <span class='ft-tanpearl' style='--i:13'>!</span>
                </h1>
                <div>
                    <ul class='lists'>
                        <li>
                            <ButtonRound
                                :link="{ href: 'mailto:witselblue@gmail.com', text: 'footer.lists.btn1' }"
                            />
                        </li>
                        <li>
                            <ButtonRound
                                :link="{ href: '/resume', target: '_blank', text: 'footer.lists.btn2' }"
                            />
                        </li>
                    </ul>
                </div>
                <div>
                    <ul class='sub-lists'>
                        <li>
                            <a href='https://github.com/Witsel-Blue' target='_blank' class='mouse-hover3'>
                                {{ $t('footer.subLists.btn1') }}
                            </a>
                        </li>
                        <li>
                            <a href='https://www.linkedin.com/in/witselblue/' target='_blank' class='mouse-hover3'>
                                {{ $t('footer.subLists.btn2') }}
                            </a>
                        </li>
                        <li>
                            <a href='https://www.upwork.com/freelancers/~01d456b520c37be02f' target='_blank' class='mouse-hover3'>
                                {{ $t('footer.subLists.btn3') }}
                            </a>
                        </li>
                        <li>
                            <a href='https://open.kakao.com/o/s1ei023h' target='_blank' class='mouse-hover3'>
                                {{ $t('footer.subLists.btn4') }}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ButtonRound from '@/components/ButtonRound.vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (process.client) {
    gsap.registerPlugin(ScrollTrigger);
}

export default {
    components: {
        ButtonRound,
    },
    computed: {
        isHomePage() {
            const homePaths = ['/', '/ko'];
            return homePaths.includes(this.$route.path);
        }
    },
    data() {
        return {
            useVhFix: false,
            titleST: null,
        }
    },
    mounted() {
        this.setVhFix();
        window.addEventListener('resize', this.setVhFix);
        this.$nextTick(() => {
            this.bgScroll();
            window.addEventListener('scroll', this.bgScroll);
            
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
    beforeDestroy() {
        window.removeEventListener('resize', this.setVhFix);
        window.removeEventListener('scroll', this.bgScroll);
        if (this.titleST) {
            this.titleST.kill();
            this.titleST = null;
        }
    },
    methods: {
        bgScroll() {
            const footerBg = this.$refs.bg;
            if (!footerBg) return;

            const winH = window.innerHeight;
            const scrollY = window.scrollY;
            const rect = footerBg.getBoundingClientRect();
            const footerTop = scrollY + rect.top;
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
                console.warn('[Footer] GSAP or ScrollTrigger not loaded');
                return;
            }
            
            if (!this.$refs.title) {
                console.warn('[Footer] title ref not found');
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
    }
}
</script>

<style lang='scss' scoped>
@use '@/assets/scss/base/variables.scss' as *;
    
#footer {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: $grad-blue;
    position: relative;
    
    &.is-home {
        z-index: 10;
    }
}

.footer-bg {
    width: 120%;
    margin-left: -10%;
    height: calc(5vh + 2rem + 5vh);
    background-color: $white2;
    border-radius: 0 0 100% 100%;
    box-shadow: $shadow-large;
}

.footer {
    color: $white1;
    width: 100%;
    height: calc(100vh - (5vh + 2rem + 5vh));
    padding: 10vh 5vw 2.4vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
        
    .top {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 40px;
            
        h1 {
            font-size: 3rem;
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

        .lists {
            display: flex;
            align-items: center;
            gap: 16px;

            #button-round::v-deep {
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
        }

        .sub-lists {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 24px;

            a {
                color: $white1;
                position: relative;

                &::after {
                    content: '';
                    width: 0;
                    height: 2px;
                    background-color: $white1;
                    position: absolute;
                    left: 0;
                    bottom: -2px;
                }

                &:hover::after{
                    width: 100%;
                    transition: width 0.2s ease-in;
                }
            }
        }
    }

    .bottom {
        position: relative;
        .convenience {
            display: flex;
            gap: 24px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
        }

        .desc {
            left: 5vw;
            font-size: 0.8rem;
            color: $black1;
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
        .top {
            h1 {
                font-size: 2.4rem;
                span {
                    min-width: 8px;
                }
            }
            .lists,
            .sub-lists {
                font-size: 1rem;
            }
        }
    }
}
</style>