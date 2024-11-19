<template>
    <div id="footer" ref="footer">
        <div class="footer-bg" ref="bg"></div>
        <div class="footer">
            <h1 ref="title">
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
                    <li>
                        <ButtonRound
                            :link="link">
                        </ButtonRound>
                    </li>
                    <li>
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
                    text: 'witselblue@gmail.com',
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
                var winH = window.innerWidth;
                var footerBgTop = footerBg.offsetTop - winH*2/3;

                window.addEventListener('scroll', function() {
                    var footerScrolled = window.scrollY;

                    if ( footerBgTop < footerScrolled ) {
                        var x = footerScrolled - footerBgTop;
                        var x2 = 630 - x;
                        footerBg.style.borderRadius = '0 0 ' + x2 + '% ' + x2 + '%';
                    }

                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    #footer {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background-color: #2C2A2A;
    }

    .footer-bg {
        width: 120%;
        margin-left: -10%;
        height: 20%;
        background-color: #f7f7f7;
    }

    .footer {
        color: #fff;
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
                    border: 1px solid #fff !important;
                    border-radius: 32px;
                }
            }
            .circle::before {
                background-color: #fff !important;
            }
            .title {
                color: #fff !important;
            }

            &:hover {
                .title {
                    color: #3E3C3C !important;
                }
            }
        }
    }
</style>