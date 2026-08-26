<template>
    <div id='about'>
        <div class='inner-l'>
            <section>
                <div class='shape-anchor' aria-hidden='true' />
                <div class='text-wrap' :style='textWrapStyle(0)'>
                    <div
                        v-if='anchor1Gathered'
                        class='cursor-zone'
                    >
                        <CursorZone label='move cursor' attach-to-parent />
                    </div>
                    <h2>
                        <span
                            v-for='(line, i) in titleLines'
                            :key='"t1-" + i'
                            :style='lineStyle(i, 0)'
                            v-html='line'
                        />
                    </h2>
                </div>
            </section>
            <section>
                <div class='shape-anchor2' aria-hidden='true' />
                <div class='text-wrap' :style='textWrapStyle(1)'>                    
                    <div
                        v-if='anchor2Gathered'
                        class='cursor-zone'
                    >
                        <CursorZone label='move cursor' attach-to-parent />
                    </div>
                    <p>
                        <span
                            v-for='(line, i) in descLines'
                            :key='"d1-" + i'
                            :style='lineStyle(i, 1)'
                            v-html='line'
                        />
                    </p>
                    <div class='btn-wrap' :style='btnStyle'>
                        <ButtonRound :link='{ href: "/aboutme", text: "About Me" }' />
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
    import ButtonRound from '@/components/common/ButtonRound.vue';
    import CursorZone from '@/components/common/CursorZone.vue';
    import { gatherAnchorState } from '@/utils/gatherAnchorState';

    const EXIT_JOURNEY_START = 0.4;
    const EXIT_JOURNEY_END = 0.6;

    export default {
        name: 'About',
        components: {
            ButtonRound,
            CursorZone,
        },
        data() {
            return {
                sectionProgress: [
                    { enter: 0, exit: 0 },
                    { enter: 0, exit: 0 },
                ],
            };
        },
        computed: {
            titleLines() {
                return this.$t('home.aboutTitleLines');
            },
            descLines() {
                return this.$t('home.aboutDescLines');
            },
            anchor1Gathered() {
                return gatherAnchorState.anchor1Gathered;
            },
            anchor2Gathered() {
                return gatherAnchorState.anchor2Gathered;
            },
            section1ItemCount() {
                return this.titleLines.length + this.descLines.length;
            },
            section2ItemCount() {
                return this.descLines.length;
            },
            section2RevealCount() {
                return this.section2ItemCount + 2;
            },
            btnStyle() {
                const { enter = 0, exit = 0 } = this.sectionProgress[1] || {};
                const enterReveal = this.itemReveal(
                    this.section2ItemCount + 1,
                    enter,
                    this.section2RevealCount,
                );
                const activeExit = enter >= 0.98 ? exit : 0;
                const reveal = activeExit > 0 ? 1 : enterReveal;
                const hide = this.itemHide(
                    this.section2ItemCount,
                    activeExit,
                    this.section2ItemCount + 1,
                );
                return this.revealStyle(reveal, hide, {
                    translate: 30,
                    unit: 'px',
                    pointerEvents: true,
                    exiting: activeExit > 0,
                });
            },
        },
        mounted() {
            this.onScroll = () => {
                const sections = this.$el.querySelectorAll('section');
                const vh = window.innerHeight;

                this.sectionProgress = Array.from(sections).map((section) => {
                    const rect = section.getBoundingClientRect();
                    const center = rect.top + rect.height / 2;
                    const enter = Math.max(0, Math.min(1, (vh - center) / (vh * 0.5)));

                    const scrollRange =
                        rect.height > vh ? rect.height - vh : rect.height;
                    const journey = Math.max(0, -rect.top / scrollRange);
                    const exit = this.getExitFromJourney(journey);

                    return { enter, exit };
                });
            };
            window.addEventListener('scroll', this.onScroll, { passive: true });
            window.addEventListener('resize', this.onScroll, { passive: true });
            this.onScroll();
        },
        beforeDestroy() {
            window.removeEventListener('scroll', this.onScroll);
            window.removeEventListener('resize', this.onScroll);
        },
        methods: {
            easeInOut(t) {
                return t < 0.5
                    ? 4 * t * t * t
                    : 1 - Math.pow(-2 * t + 2, 3) / 2;
            },
            getExitFromJourney(journey) {
                if (journey < EXIT_JOURNEY_START) return 0;
                const raw =
                    (journey - EXIT_JOURNEY_START)
                    / (EXIT_JOURNEY_END - EXIT_JOURNEY_START);
                return Math.max(0, Math.min(1, raw));
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
            itemHide(index, exit, itemCount) {
                if (exit <= 0 || itemCount <= 0) return 0;

                const slot = 1 / itemCount;
                const start = index * slot;
                let local = (exit - start) / slot;
                local = Math.max(0, Math.min(1, local));
                return this.easeInOut(local);
            },
            textWrapStyle(sectionIndex) {
                const { exit = 0 } = this.sectionProgress[sectionIndex] || {};
                return {
                    transform: `translateY(${-exit * 30}vh)`,
                };
            },
            revealStyle(reveal, hide = 0, options = {}) {
                const {
                    translate = 0.7,
                    unit = 'em',
                    pointerEvents = false,
                    exiting = false,
                } = options;
                const visible = reveal * (1 - hide);

                const style = exiting
                    ? {
                        opacity: visible,
                        transform: 'translateY(0)',
                        filter: `blur(${hide * 14}px)`,
                    }
                    : {
                        opacity: visible,
                        transform: `translateY(${(1 - reveal) * translate}${unit})`,
                        filter: `blur(${(1 - reveal) * 14}px)`,
                    };

                if (pointerEvents) {
                    style.pointerEvents = visible > 0.9 ? 'auto' : 'none';
                }

                return style;
            },
            lineStyle(index, sectionIndex = 0) {
                const { enter = 0, exit = 0 } = this.sectionProgress[sectionIndex] || {};
                const enterItemCount =
                    sectionIndex === 0
                        ? this.section1ItemCount
                        : this.section2ItemCount;
                const hideItemCount =
                    sectionIndex === 0
                        ? this.titleLines.length
                        : this.descLines.length;

                const enterReveal = this.itemReveal(index, enter, enterItemCount);
                const activeExit = enter >= 0.98 ? exit : 0;
                const reveal = activeExit > 0 ? 1 : enterReveal;
                const hide = this.itemHide(index, activeExit, hideItemCount);

                return this.revealStyle(reveal, hide, {
                    exiting: activeExit > 0,
                });
            },
        },
    };
</script>

<style lang='scss' scoped>
    @use '@/assets/scss/base/variables' as *;

    #about {
        width: 100%;
        display: flex;
        flex-direction: column;

        section {
            position: relative;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-end;
            
            &:nth-of-type(1) {
                .shape-anchor {
                    position: absolute;
                    top: 40%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 50vh;
                    height: 50vh;
                    opacity: 0;
                    pointer-events: none;
                }
            }

            &:nth-of-type(2) {    
                .shape-anchor2 {
                    position: absolute;
                    top: 40%;
                    right: 50%;
                    transform: translate(50%, -50%);
                    width: 70vh;
                    height: 70vh;
                    opacity: 0;
                    pointer-events: none;
                }

                .text-wrap {
                    bottom: 15vh;
                }
            }
        }

        .text-wrap {
            padding-top: 50vh;
            position: sticky;
            bottom: 20vh;
            text-align: center;
            z-index: 1;

            .cursor-zone {
                position: absolute;
                top: 0;
                left: 50%;
                width: 80vw;
                height: 100%;
                transform: translateX(-50%);
            }

            h2 {
                z-index: 1;

                span {
                    font-family: 'tanpearl', 'mapodacapo';
                    font-size: 3rem;
                    line-height: 1.4;
                }
            }

            p {
                margin-top: 2rem;
                text-align: center;
                        
                span {
                    font-size: 1.2rem;
                    line-height: 1.5;
                }
            }

            .btn-wrap {
                margin-top: 2rem;
            }
        }

        h2 span,
        p span {
            display: block;
            will-change: opacity, transform, filter;
        }
    }

    @media (max-width: $mobile) {
        #about {
            section {
                &:nth-of-type(1) {
                    .shape-anchor {
                        top: 15%;
                        transform: translate(-50%, 0);
                    }
                }

                &:nth-of-type(2) {
                    .shape-anchor2 {
                        top: 40%;
                        width: 50vh;
                        height: 50vh;
                    }
                }

                .text-wrap {
                    padding-top: 20vh;

                    h2 {
                        span {
                            font-size: 1.5rem;
                        }
                    }

                    .btn-wrap {
                        margin-top: 5vw;
                    }
                }
            }
        }
    }
</style>

<style lang='scss'>
    @use '@/assets/scss/base/variables' as *;

    .lang-ko {
        #about {
            section {
                .text-wrap {
                    h2 {
                        span {
                            font-size: 2rem;
                            line-height: 1.5;
                        }
                    }
                }
            }
        }
    }
</style>
