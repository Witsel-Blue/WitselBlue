<template>
    <div id="footer" ref="footer">
        <div class="footer-bg" ref="bg"></div>
        <div class="footer">
            <h1 ref="title" data-aos="fade-up">
                <span class="ft-tanpearl" style="--i:1">W</span>
                <span class="ft-tanpearl" style="--i:2">o</span>
                <span class="ft-tanpearl" style="--i:3">r</span>
                <span class="ft-tanpearl" style="--i:4">k</span>
                <span class="ft-tanpearl" style="--i:5"></span>
                <span class="ft-tanpearl" style="--i:6">w</span>
                <span class="ft-tanpearl" style="--i:7">i</span>
                <span class="ft-tanpearl" style="--i:8">t</span>
                <span class="ft-tanpearl" style="--i:9">h</span>
                <span class="ft-tanpearl" style="--i:10"></span>
                <span class="ft-tanpearl" style="--i:11">m</span>
                <span class="ft-tanpearl" style="--i:12">e</span>
                <span class="ft-tanpearl" style="--i:13">!</span>
            </h1>
                <ul class="lists">
                    <li data-aos="fade-up">
                        <ButtonRound
                            :link="link">
                        </ButtonRound>
                    </li>
                    <li data-aos="fade-up">
                        <ButtonRound
                            :link="link2">
                        </ButtonRound>
                    </li>
                </ul>
        </div>
    </div>
</template>

<script>
    import ButtonRound from '@/components/ButtonRound.vue';

    export default {
        components: {
            ButtonRound,
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
                },
            }
        },
        mounted() {
            setTimeout(() => {
                this.bgScroll();
            }, 1000);
        },
        methods: {
            bgScroll() {
                var footerBg = this.$refs.bg;
                var winH = window.innerHeight;
                var scrollStart = footerBg.offsetTop - winH*2/3;
                var footerTop = footerBg.offsetTop;

                var title = this.$refs.title;

                window.addEventListener('scroll', function() {
                    var scrollY = window.scrollY;

                    if ( scrollStart < scrollY ) {
                        var h = -(scrollY - footerTop);
                        var x = (footerTop - scrollStart);
                        var r = h/x*100;
                        footerBg.style.borderRadius = '0 0 ' + r + '% ' + r + '%';
                        
                        title.classList.add('active');
                    } else {
                        title.classList.remove('active');
                    }

                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/base/variables.scss';
    
    #footer {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background-color: $gray2;
    }

    .footer-bg {
        width: 120%;
        margin-left: -10%;
        height: 20%;
        background-color: $white2;
        border-radius: 0 0 100% 100%;
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
        }

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
            .lists {
                flex-direction: column;
            }
        }
    }
</style>