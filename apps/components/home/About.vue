<template>
    <div id='about'>
        <div class='inner'>
            <section>
                <div class='shape-anchor' aria-hidden='true' />
                <div class='text-wrap'>
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
                            :style='lineStyle(i)'
                            v-html='line'
                        />
                    </h2>
                    <p>
                        <span
                            v-for='(line, i) in descLines'
                            :key='"d1-" + i'
                            :style='lineStyle(titleLines.length + i)'
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

    const ENTER_BOTTOM_VH = 0.1;
    const EXIT_TOP_VH = 0.1;

    export default {
        name: 'About',
        components: {
            ButtonRound,
            CursorZone,
        },
        data() {
            return {
                itemEnters: [],
                itemExits: [],
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
            itemCount() {
                return this.titleLines.length + this.descLines.length + 1;
            },
            btnStyle() {
                return this.itemStyle(this.itemCount - 1, {
                    translate: 30,
                    unit: 'px',
                    pointerEvents: true,
                });
            },
        },
        mounted() {
            this.onScroll = () => {
                const lineEls = this.$el.querySelectorAll(
                    'h2 span, p span, .btn-wrap',
                );
                if (!lineEls.length) return;

                const vh = window.innerHeight;
                const enterStart = vh;
                const enterEnd = vh * (1 - ENTER_BOTTOM_VH);
                const exitStart = vh * EXIT_TOP_VH;

                const enters = [];
                const exits = [];
                lineEls.forEach((el) => {
                    const { top, bottom } = this.layoutBox(el);
                    enters.push(
                        Math.max(
                            0,
                            Math.min(1, (enterStart - bottom) / (enterStart - enterEnd)),
                        ),
                    );
                    exits.push(
                        Math.max(0, Math.min(1, (exitStart - top) / exitStart)),
                    );
                });
                this.itemEnters = enters;
                this.itemExits = exits;
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
            layoutBox(el) {
                const rect = el.getBoundingClientRect();
                const transform = window.getComputedStyle(el).transform;
                let ty = 0;
                if (transform && transform !== 'none') {
                    const matrix3d = transform.match(/matrix3d\((.+)\)/);
                    const matrix = transform.match(/matrix\((.+)\)/);
                    if (matrix3d) {
                        ty = Number(matrix3d[1].split(',')[13]) || 0;
                    } else if (matrix) {
                        ty = Number(matrix[1].split(',')[5]) || 0;
                    }
                }
                return {
                    top: rect.top - ty,
                    bottom: rect.bottom - ty,
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
            itemStyle(index, options = {}) {
                const hide = this.easeInOut(this.itemExits[index] || 0);
                const enterReveal = this.easeInOut(this.itemEnters[index] || 0);
                const reveal = hide > 0 ? 1 : enterReveal;

                return this.revealStyle(reveal, hide, {
                    ...options,
                    exiting: hide > 0,
                });
            },
            lineStyle(index) {
                return this.itemStyle(index);
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
        position: relative;

        .inner {
            position: relative;
            z-index: 1;
        }

        section {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-end;

            .shape-anchor {
                position: absolute;
                top: 10vh;
                left: 50%;
                transform: translate(-50%, 0);
                width: 50vh;
                height: 50vh;
                opacity: 0;
                pointer-events: none;
            }
        }

        .text-wrap {
            padding-top: calc(50vh + 10vh);
            padding-bottom: 10vh;
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

    @media (max-width: $tablet) {
        #about {
            section {
                .text-wrap {
                    h2 {
                        span {
                            font-size: 2.5rem;
                        }
                    }
                }
            }
        }
    }

    @media (max-width: $mobile) {
        #about {
            section {
                .shape-anchor {
                    top: 40%;
                }

                .text-wrap {
                    padding-top: 60vh;
                    bottom: 25vw !important;

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

    @media (max-width: $mobile) {
        .lang-ko {
            #about {
                section {
                    .text-wrap {
                        h2 {
                            span {
                                line-height: 1.2;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
