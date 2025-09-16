<template>
    <div id='footer' ref='footer'>
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
                            <ButtonRound :link='link' />
                        </li>
                        <li>
                            <ButtonRound :link='link2' />
                        </li>
                    </ul>
                </div>
                <div>
                    <ul class='sub-lists'>
                        <li>
                            <a href='https://github.com/Witsel-Blue' target='_blank' class='mouse-hover3'>
                                github
                            </a>
                        </li>
                        <li>
                            <a href='www.linkedin.com/in/witselblue' target='_blank' class='mouse-hover3'>
                                linkedin
                            </a>
                        </li>
                        <li>
                            <a href='https://witselblue.slack.com/team/U0830TL3ZDW' target='_blank' class='mouse-hover3'>
                                slack
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class='bottom'>
                <!-- <div class='convenience'>
                    <ChangeLang />
                    <ChangeCursor />
                </div> -->
                <div class='desc'>
                    <p>&copy; 2025 witselblue</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ButtonRound from '@/components/ButtonRound.vue';
import ChangeLang from '@/components/ChangeLang.vue';
import ChangeCursor from '@/components/ChangeCursor.vue';

export default {
    components: {
        ButtonRound,
        ChangeLang,
        ChangeCursor,
    },
    data() {
        return {
            link: {
                href: 'mailto:witselblue@gmail.com',
                text: 'send mail',
            },
            link2: {
                href: '/resume',
                text: 'view resume',
                target: '_blank',
            },
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.bgScroll();
            window.addEventListener('scroll', this.bgScroll);
        });
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.bgScroll);
    },
    methods: {
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
    }
}
</script>

<style lang='scss' scoped>
    @use '@/assets/scss/base/variables.scss' as *;
    
    #footer {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background: radial-gradient(circle, $blue1 0%, $white1 100%);
    }

    .footer-bg {
        width: 120%;
        margin-left: -10%;
        height: 20%;
        background-color: $white2;
        border-radius: 0 0 100% 100%;
        box-shadow: 0 4px 40px rgba(0, 0, 0, 0.1), 0 2px 24px rgba(0, 0, 0, 0.1);
    }

    .footer {
        color: $white1;
        width: 100%;
        height: 80%;
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
            height: 15%;
        }
        .footer {
            h1 {
                font-size: 2rem;
                span {
                    min-width: 8px;
                }
            }
        }
    }
</style>