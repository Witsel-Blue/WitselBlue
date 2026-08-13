<template>
    <div class='intro'>
        <LanguageMenu 
            v-if='ready && clickCount >= 0 && !exploded'
        />
        <div
            v-if='ready && clickCount >= 1 && !exploded'
            class='intro__item intro__item--1'
            :class='{ visible: show1, "fade-out": clickCount >= 2 }'
        >
            <TextShifting
                :text="$t('intro.textShift1')"
                :playing='play1'
            />
        </div>

        <div
            v-if='ready && clickCount >= 2 && !exploded'
            class='intro__item intro__item--2'
            :class='{ visible: show2 }'
        >
            <TextShifting
                :text="$t('intro.textShift2')"
                :playing='play2'
            />
        </div>

        <p v-if='!exploded && ready' class='intro__hint'>
            {{ $t('intro.hint') }}
        </p>
    </div>
</template>

<script>
    import LanguageMenu from '@/layouts/LanguageMenu.vue';
    import TextShifting from '@/components/common/TextShifting.vue';

    export default {
        name: 'Intro',
        components: {
            LanguageMenu,
            TextShifting,
        },
        props: {
            ready: {
                type: Boolean,
                default: false,
            },
            exploded: {
                type: Boolean,
                default: false,
            },
            clickCount: {
                type: Number,
                default: 0,
            },
            show1: {
                type: Boolean,
                default: false,
            },
            show2: {
                type: Boolean,
                default: false,
            },
            play1: {
                type: Boolean,
                default: false,
            },
            play2: {
                type: Boolean,
                default: false,
            },
        },
    };
</script>

<style lang='scss' scoped>
    .intro {
        &__item {
            position: absolute;
            z-index: 2;
            user-select: none;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.7s ease;

            ::v-deep span {
                display: inline-block;
                min-width: 8px;
                position: relative;
                letter-spacing: 0.2em;
                text-transform: uppercase;
            }

            &.visible {
                opacity: 0.4;
            }

            &.fade-out {
                opacity: 0;
            }

            &--1 {
                top: 30vh;
                left: 20vw;
                text-align: center;

                ::v-deep span:nth-child(10),
                ::v-deep span:nth-child(24) {
                    display: block;
                }
            }

            &--2 {
                top: 60vh;
                right: 20vw;
                transform: translateX(50%);
                text-align: center;

                ::v-deep span:nth-child(16),
                ::v-deep span:nth-child(32),
                ::v-deep span:nth-child(51) {
                    display: block;
                }
            }
        }

        &__hint {
            position: absolute;
            z-index: 2;
            bottom: 5vw;
            left: 50%;
            transform: translateX(-50%);
            font-size: 0.75rem;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            text-align: center;
            opacity: 0.4;
            animation: intro-blink 2s ease-in-out infinite;
            user-select: none;
        }
    }

    @keyframes intro-blink {
        0%,
        100% {
            opacity: 0.4;
        }
        50% {
            opacity: 0.2;
        }
    }
</style>

<style lang='scss'>
    .lang-ko {
        .intro {
            &__item {
                &--1 {
                    span:nth-child(10),
                    span:nth-child(24) {
                        display: inline-block;
                    }

                    span:nth-child(12) {
                        display: block;
                    }
                }

                &--2 {
                    span:nth-child(16),
                    span:nth-child(32),
                    span:nth-child(51) {
                        display: inline-block;
                    }

                    span:nth-child(10),
                    span:nth-child(23) {
                        display: block;
                    }
                }
            }

            &__hint {
                font-size: 0.9rem;
            }
        }
    }
</style>
