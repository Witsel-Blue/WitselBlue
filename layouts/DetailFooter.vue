<template>
    <div id="detail_footer">
        <div class="footer-bg" ref="bg"></div>
        <div class="footer">
            <p data-aos="fade-up">next project</p>
            <div class="hover-flip">
                <div class="front">
                    <div class="res-box-wrap">
                        <div class="res-box">
                            <img :src="pagination.nextImg">
                        </div>
                    </div>
                </div>
                <div class="back">
                    <a :href="pagination.nextLink" class="mouse-hover2">
                        <p>{{ pagination.nextWork }}</p>
                        <h3 class="ft-diphylleia">{{ pagination.nextText }}</h3>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            pagination: Object,
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

                window.addEventListener('scroll', function() {
                    var scrollY = window.scrollY;

                    if ( scrollStart < scrollY ) {
                        var h = -(scrollY - footerTop);
                        var x = (footerTop - scrollStart);
                        var r = h/x*100;
                        footerBg.style.borderRadius = '0 0 ' + r + '% ' + r + '%';
                    }

                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/base/variables.scss';
    
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
                    margin-top: 8px;
                    font-size: 2rem;
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

    // mobile
    @media all and (max-width: $mobile) {
        .footer-bg {
            height: 15%;
        }
        .footer {
            padding: 5vh 10vw 20vh;
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