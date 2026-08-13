<template>
    <div id='footer'>
        <section class='top'>
            <div class='social'>
                <ul>
                    <li>
                        <h3>
                            <transition name='verb' mode='out-in' :style='lineStyle(0)'>
                                <span :key='currentVerb' class='verb'>{{ currentVerb }}</span>
                            </transition>
                            <br />
                            <span :style='lineStyle(1)'>with me!</span>
                        </h3>
                    </li>
                    <li :style='lineStyle(2)'>
                        <CursorZone label='send email?' attach-to-parent />
                        <ClickSound attach-to-parent />
                        <a href='mailto:witselblue@gmail.com'>
                            <TextShifting text='witselblue@gmail.com' />
                        </a>
                    </li>
                </ul>
                <ul>
                    <li :style='lineStyle(3)'>
                        <ClickSound attach-to-parent />
                        <a href='https://www.instagram.com/witsel_blue' target='_blank'>
                            <TextShifting text='Instagram' />
                        </a>
                    </li>
                    <li :style='lineStyle(4)'>
                        <ClickSound attach-to-parent />
                        <a href='https://github.com/Witsel-Blue' target='_blank'>
                            <TextShifting text='GitHub' />
                        </a>
                    </li>
                    <li :style='lineStyle(5)'>
                        <ClickSound attach-to-parent />
                        <a href='https://www.linkedin.com/in/witselblue/' target='_blank'>
                            <TextShifting text='LinkedIn' />
                        </a>
                    </li>
                    <li :style='lineStyle(6)'>
                        <ClickSound attach-to-parent />
                        <a href='https://open.kakao.com/o/s1ei023h' target='_blank'>
                            <TextShifting text='Kakao' />
                        </a>
                    </li>
                </ul>
            </div>
        </section>
        <section class='bottom'>
            <TextStaggerByMiddle
                text='WitselBlue'
            />
            <div class='info'>
                <ul>
                    <li :style='lineStyle(5)'>
                        <dl>
                            <dt>VERSION</dt>
                            <dd>2026 &copy; All rights reserved</dd>
                        </dl>
                    </li>
                    <li :style='lineStyle(6)'>
                        <dl>
                            <dt>LOCAL TIME</dt>
                            <dd>{{ localTimeDisplay }}</dd>
                        </dl>
                    </li>
                </ul>
                <button type='button' :style='lineStyle(7)' @click='scrollToTop'>
                    <ClickSound attach-to-parent />
                    <TextShifting text='BACK TO TOP' one-line />
                </button>
            </div>
        </section>
    </div>
</template>

<script>
    import CursorZone from '@/components/common/CursorZone.vue';
    import TextShifting from '@/components/common/TextShifting.vue';
    import TextStaggerByMiddle from '@/components/common/TextStaggerByMiddle.vue';
    import ClickSound from '@/components/common/ClickSound.vue';

    export default {
        name: 'SiteFooter',
        components: {
            CursorZone,
            TextShifting,
            TextStaggerByMiddle,
            ClickSound,
        },
        data() {
            return {
                now: new Date(),
                clockTimer: null,
                sectionProgress: 0,
                revealCount: 10,
                verbs: ['Work', 'Create', 'Build'],
                verbIndex: 0,
                verbTimer: null,
            };
        },
        computed: {
            currentVerb() {
                return this.verbs[this.verbIndex];
            },
            localTimeDisplay() {
                const opts = {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                };
                const kst = this.now.toLocaleTimeString('en-US', {
                    ...opts,
                    timeZone: 'Asia/Seoul',
                });
                const utc = this.now.toLocaleTimeString('en-US', {
                    ...opts,
                    timeZone: 'UTC',
                });
                return `${kst} KST / ${utc} UTC`;
            },
        },
        mounted() {
            this.clockTimer = setInterval(() => {
                this.now = new Date();
            }, 1000);

            this.verbTimer = setInterval(() => {
                this.verbIndex = (this.verbIndex + 1) % this.verbs.length;
            }, 4000);

            this.onScroll = () => this.updateReveal();
            window.addEventListener('scroll', this.onScroll, { passive: true });
            window.addEventListener('resize', this.onScroll, { passive: true });
            this.updateReveal();
        },
        beforeDestroy() {
            if (this.clockTimer) clearInterval(this.clockTimer);
            if (this.verbTimer) clearInterval(this.verbTimer);
            window.removeEventListener('scroll', this.onScroll);
            window.removeEventListener('resize', this.onScroll);
        },
        methods: {
            easeInOut(t) {
                return t < 0.5
                    ? 4 * t * t * t
                    : 1 - Math.pow(-2 * t + 2, 3) / 2;
            },
            itemReveal(index, progress, itemCount) {
                const win = 0.65;
                const step =
                    itemCount > 1 ? (1 - win) / (itemCount - 1) : 0;
                const start = index * step;
                let local = (progress - start) / win;
                local = Math.max(0, Math.min(1, local));
                return this.easeInOut(local);
            },
            lineStyle(index) {
                const e = this.itemReveal(
                    index,
                    this.sectionProgress,
                    this.revealCount,
                );
                return {
                    opacity: 0.18 + 0.82 * e,
                    transform: `translateY(${(1 - e) * 0.7}em)`,
                    filter: `blur(${(1 - e) * 14}px)`,
                };
            },
            updateReveal() {
                const rect = this.$el.getBoundingClientRect();
                const vh = window.innerHeight;
                const center = rect.top + rect.height / 2;
                const p = (vh - center) / (vh * 0.5);
                this.sectionProgress = Math.max(0, Math.min(1, p));
            },
            scrollToTop() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
        },
    };
</script>

<style lang='scss' scoped>
    @use '@/assets/scss/base/variables' as *;

    #footer {
        width: 100%;
        height: 100vh;
        // margin-top: -100vh;
        backdrop-filter: blur(10px);
        position: relative;
        z-index: 2;
        mix-blend-mode: difference;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .top {          
            padding: 2.5vw;
            height: 100%;
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;

            .social {
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                gap: 2rem;
                width: 100%;

                h3 {
                    span {
                        font-size: 4rem;
                        line-height: 1;
                    }

                    .verb {
                        display: inline-block;
                        font-family: $ft-diphylleia;
                        font-style: italic;
                        font-size: 4.5rem;

                        &-enter-active,
                        &-leave-active {
                            transition: filter 0.8s ease, opacity 0.4s ease;
                        }

                        &-enter,
                        &-leave-to {
                            filter: blur(4px);
                            opacity: 0;
                        }
                    }
                }

                ul {
                    li {
                        a {
                            font-size: 2rem;
                            font-weight: 400;
                            width: fit-content;
                            display: inline-block;

                            .text-shifting::v-deep {
                                width: fit-content;

                                span {
                                    font-size: 1.5rem;
                                }
                            }
                        }
                    }

                    &:nth-of-type(2) {
                        text-align: right;
                    }
                }
            }
        }

        .bottom {
            padding: 2.5vw;
            text-align: center;

            .text-stagger-by-middle::v-deep {
                .char__inner {
                    font-size: 10rem;
                    font-weight: 700;
                    font-family: $ft-tanpearl;
                    user-select: none;
                }
            }
            
            .info {
                display: flex;
                align-items: flex-end;
                justify-content: space-between;

                ul {
                    display: flex;
                    align-items: flex-end;
                    gap: 10rem;

                    dl {
                        align-items: center;
                        gap: 1rem;
                    }
                }
            }
        }
    }
</style>