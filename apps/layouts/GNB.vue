<template>
    <div id='gnb' :class='{ open: isOpen }'>
        <button class='menu-btn' @click='toggleOpen'>
            <ClickSound attach-to-parent />
            <div class='line-wrap'>
                <span class='line' />
                <span class='line' />
            </div>
            <p class='menu-btn-text'>{{ isOpen ? 'close' : 'menu' }}</p>
        </button>

        <div class='menu-cont'>
            <Logo />
            <LanguageMenu />
            <SoundMuteMenu />
            <ul class='menu-list'>
                <li
                    v-for='(item, index) in menuItems'
                    :key='item.key'
                    class='menu-item'
                    :class="{
                        stagger: staggeredIndexes.includes(index),
                        dimmed: hoveredIndex !== null && hoveredIndex !== index,
                        'menu-item--action': item.type === 'action',
                    }"
                    @mouseenter='hoveredIndex = index'
                    @mouseleave='hoveredIndex = null'
                >
                    <ClickSound attach-to-parent />
                    <NuxtLink
                        v-if="item.type === 'link'"
                        :to='item.to'
                        class='menu-item__trigger'
                        @click.native.prevent='onMenuClick(item)'
                    >
                        <p v-html='item.label' />
                    </NuxtLink>
                    <button
                        v-else
                        type='button'
                        class='menu-item__trigger'
                        @click='onItemAction(item)'
                    >
                        <TextShifting :text='item.label' one-line />
                    </button>
                </li>
            </ul>
            <p class='copyright'>©{{ new Date().getFullYear() }} witselblue</p>
        </div>
    </div>
</template>

<script>
    import Logo from '@/components/svg/logo.vue';
    import LanguageMenu from '@/layouts/LanguageMenu.vue';
    import SoundMuteMenu from '@/layouts/SoundMuteMenu.vue';
    import TextShifting from '@/components/common/TextShifting.vue';
    import ClickSound from '@/components/common/ClickSound.vue';
    import { clearIntroDone, isHomeRoute } from '@/utils/introState';

    export default {
        components: {
            Logo,
            LanguageMenu,
            SoundMuteMenu,
            TextShifting,
            ClickSound,
        },
        data() {
            return {
                isOpen: false,
                hoveredIndex: null,
                staggeredIndexes: [],
                staggerTimers: [],
                menuItems: [
                    { key: 'home', type: 'link', to: '/', label: 'H<span>o</span>me' },
                    { key: 'archive', type: 'link', to: '/archive', label: 'Arc<span>h</span>ive' },
                    { key: 'aboutme', type: 'link', to: '/aboutme', label: 'Ab<span>o</span>ut <span>M</span>e' },
                    { key: 'contact', type: 'link', to: '/contact', label: 'Co<span>n</span>tact' },
                    {
                        key: 'intro-again',
                        type: 'action',
                        action: 'introAgain',
                        label: 'view intro again?',
                    },
                ],
            };
        },
        watch: {
            isOpen(open) {
                this.clearStaggerTimers();
                this.staggeredIndexes = [];

                if (!open) return;

                const menuHeightDelay = 200;
                const staggerStep = 200;

                this.menuItems.forEach((_, index) => {
                    const timer = setTimeout(() => {
                        this.staggeredIndexes = [...this.staggeredIndexes, index];
                    }, menuHeightDelay + index * staggerStep);
                    this.staggerTimers.push(timer);
                });
            },
        },
        beforeDestroy() {
            this.clearStaggerTimers();
        },
        methods: {
            toggleOpen() {
                this.isOpen = !this.isOpen;
            },
            onMenuClick(item) {
                this.isOpen = false;

                if (this.$route.path === item.to) {
                    if (item.to === '/');
                    return;
                }

                this.$router.push(item.to);
            },
            onItemAction(item) {
                if (item.action === 'introAgain') {
                    this.onIntroAgain();
                }
            },
            onIntroAgain() {
                if (!process.client) return;

                this.isOpen = false;
                clearIntroDone(this.$root);
                this.$root.$emit('mainvisual-intro-state', false);

                const homePath = this.localePath('/');

                if (isHomeRoute(this.$route)) {
                    this.$root.$emit('intro-replay-request');
                    window.scrollTo(0, 0);
                    return;
                }

                this.$router.push(homePath);
            },
            clearStaggerTimers() {
                this.staggerTimers.forEach((timer) => clearTimeout(timer));
                this.staggerTimers = [];
            },
        },
    };
</script>

<style lang='scss' scoped>
    @use '@/assets/scss/base/variables.scss' as *;

    #gnb {
        .menu-btn {
            position: fixed;
            top: 2.5vw;
            left: 2.5vw;
            z-index: 11;
            display: flex;
            align-items: center;
            gap: 1rem;

            .line-wrap {
                width: 24px;
                height: 1rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;

                .line {
                    display: block;
                    width: 100%;
                    height: 1px;
                    background-color: $white;
                    transition: transform 0.4s ease;
                }
            }

            .menu-btn-text {
                font-size: 0.75rem;
                letter-spacing: 0.2em;
                text-transform: uppercase;
                opacity: 0;
                visibility: hidden;
                transition: all 0.4s ease;
            }

            &:hover {
                .line {
                    &:first-child {
                        animation: anim 0.4s ease-in;
                    }
                    &:last-child {
                        animation: anim 0.4s ease-in;
                        animation-delay: 0.2s;
                    }
                }

                .menu-btn-text {
                    opacity: 1;
                    visibility: visible;
                    transition: all 0.4s ease;
                }
            }
        }

        .menu-cont {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10;
            transform: translateY(-100%);
            mix-blend-mode: difference;
            backdrop-filter: blur(32px);
            overflow: hidden;
            will-change: transform;
            transition: transform 0.4s ease;

            svg::v-deep {
                position: absolute;
                top: 10vw;
                left: 50%;
                transform: translateX(-50%);

                path {
                    fill: $white-inverted;
                }

                line {
                    stroke: $white-inverted;
                }
            }

            .menu-list {
                margin-top: 56vh;
                transform: translateY(-50%);
                display: flex;
                align-items: center;
                flex-direction: column;
                justify-content: center;

                .menu-item {
                    width: fit-content;
                    overflow: hidden;

                    &:nth-child(2n) .menu-item__trigger {
                        transform: translateY(150%) rotate(8deg);
                    }

                    &:nth-child(2n+1) .menu-item__trigger {
                        transform: translateY(150%) rotate(-8deg);
                    }

                    &.stagger .menu-item__trigger {
                        transform: translateY(0) rotate(0) !important;
                        transition: transform 0.4s ease;
                    }

                    &.dimmed .menu-item__trigger {
                        opacity: 0.2;
                        filter: blur(4px);
                        transition: all 0.4s ease;
                    }

                    &--action {
                        margin-top: 1rem;
                    }

                    .menu-item__trigger {
                        display: inline-block;
                        width: fit-content;
                        color: $white-inverted;
                        font-size: 5rem;
                        font-weight: 700;
                        letter-spacing: 0.2em;
                        text-transform: uppercase;
                        opacity: 1;
                        filter: blur(0);
                        transition: all 0.4s ease;
                        background: none;
                        border: none;
                        padding: 0;
                        cursor: pointer;

                        p {
                            font-family: $ft-google-variable;
                            font-stretch: 110%;
                            transition: all 0.4s ease;

                            ::v-deep span {
                                font-family: $ft-google-variable;
                                display: inline-block;
                            }
                        }

                        &:hover p::v-deep span {
                            font-stretch: 200%;
                            transition: font-stretch 0.4s ease;
                        }
                    }

                    &--action .menu-item__trigger {
                        font-size: 0.75rem;
                        letter-spacing: 0.06em;
                    }
                }
            }

            .copyright {
                position: absolute;
                bottom: 2.5vw;
                left: 50%;
                transform: translateX(-50%);
                font-size: 0.9rem;
                color: $white;
                user-select: none;
            }
        }

        &.open {
            .menu-cont {
                transform: translateY(0);
            }

            .menu-btn {
                .line-wrap {
                    justify-content: center;

                    .line {
                        transition: transform 0.4s ease;

                        &:first-child {
                            transform: rotate(45deg);
                        }
                        &:last-child {
                            transform: rotate(-45deg);
                        }
                    }
                }

                &:hover {
                    .line {
                        &:first-child {
                            animation: anim2 0.4s ease-in;
                        }
                        &:last-child {
                            animation: anim3 0.4s ease-in;
                            animation-delay: 0.2s;
                        }
                    }
                }
            }

        }
    }

    @keyframes anim {
        0%,
        100% {
            transform: scale(1);
        }
        50% {
            transform: scale(0);
        }
    }

    @keyframes anim2 {
        0%,
        100% {
            transform: rotate(45deg) scale(1);
        }
        50% {
            transform: rotate(45deg) scale(0);
        }
    }

    @keyframes anim3 {
        0%,
        100% {
            transform: rotate(-45deg) scale(1);
        }
        50% {
            transform: rotate(-45deg) scale(0);
        }
    }
</style>
