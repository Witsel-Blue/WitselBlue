<template>
    <div id='detail_footer'>
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
                <CardFlip v-if='nextProject' :item='nextProject'/>
                <CardFlip v-if='nextArchiveDev' :item='nextArchiveDev' />
                <CardFlip v-if='nextArchiveMusic' :item='nextArchiveMusic' />
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
        nextArchiveDev: {
            type: Object,
            default: null,
        },
        nextArchiveMusic: {
            type: Object,
            default: null,
        },
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
    
    #detail_footer {
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
            height: 15%;
        }
        .footer {
            padding: 5vh 10vw 10vh;
            gap: 24px;
        }
        .hover-flip {
            .back {
                a h3 {
                    margin-top: 4px;
                    font-size: 1.6rem;
                }
            }
        }
    }
</style>