<template>
    <div class='intro'>
        <LanguageMenu 
            v-if='ready && clickCount >= 0 && !exploded'
        />
        <SoundMuteMenu 
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
                one-line
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
                one-line
            />
        </div>

        <p v-if='!exploded && ready' class='intro__hint'>
            {{ $t('intro.hint') }}
        </p>
    </div>
</template>

<script>
    import LanguageMenu from '@/layouts/LanguageMenu.vue';
    import SoundMuteMenu from '@/layouts/SoundMuteMenu.vue';
    import TextShifting from '@/components/common/TextShifting.vue';

    export default {
        name: 'Intro',
        components: {
            LanguageMenu,
            SoundMuteMenu,
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
    @use '@/assets/scss/base/variables.scss' as *;

    .intro {
        &__item {
            position: absolute;
            z-index: 2;
            user-select: none;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.4s ease;

            ::v-deep span {
                display: inline-block;
                min-width: 8px;
                position: relative;
                letter-spacing: 0.2em;
                text-transform: uppercase;
            }

            &.visible {
                opacity: 1;
            }

            &.fade-out {
                opacity: 0;
            }

            &--1 {
                top: 30vh;
                left: 20vw;
                text-align: center;

                ::v-deep span:nth-child(10) {
                    display: block !important;
                }
            }

            &--2 {
                top: 60vh;
                right: 20vw;
                transform: translateX(50%);
                text-align: center;

                ::v-deep span:nth-child(16),
                ::v-deep span:nth-child(32) {
                    display: block !important;
                }
            }
        }

        &__hint {
            position: absolute;
            z-index: 2;
            bottom: 5vw;
            left: 50%;
            transform: translateX(-50%);
            font-size: 0.8rem;
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

    @media (max-width: $mobile) {
        .intro {
            &__item {
                &--1 {
                    top: 15vh;
                    left: 10vw;
                }

                &--2 {
                    top: 70vh;
                    right: 40vw;
                }
            }

            &__hint {
                font-size: 0.9rem;
                bottom: 20vw;
            }
        }
    }
</style>

<style lang='scss'>
    .lang-ko {
        .intro {
            &__item {
                &--1 {
                    span:nth-child(10) {
                        display: inline-block !important;
                    }

                    span:nth-child(7) {
                        display: block !important;
                    }
                }

                &--2 {
                    span:nth-child(16),
                    span:nth-child(32) {
                        display: inline-block !important;
                    }

                    span:nth-child(10) {
                        display: block !important;
                    }
                }
            }

            &__hint {
                font-size: 0.9rem;
            }
        }
    }
</style>
