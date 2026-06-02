<template>
    <div id='gnb' :class='{ open: isOpen }'>
        <button class='menu-btn' @click='toggleOpen'>
            <div class='line-wrap'>
                <span class='line' />
                <span class='line' />
            </div>
            <p class='menu-btn-text'>{{ isOpen ? 'close' : 'menu' }}</p>
        </button>

        <div class='menu-cont'>
            <LanguageMenu />
            <ul class='menu-list'>
                <li
                    v-for='(item, index) in menuItems'
                    :key='item.to'
                    class='menu-item'
                    :class='{
                        stagger: staggeredIndexes.includes(index),
                        dimmed: hoveredIndex !== null && hoveredIndex !== index,
                    }'
                    @mouseenter='hoveredIndex = index'
                    @mouseleave='hoveredIndex = null'
                >
                    <NuxtLink :to='item.to' @click.native.prevent='onMenuClick(item)'>
                        <p v-html='item.label' />
                    </NuxtLink>
                </li>
            </ul>
            <p class='copyright'>©{{ new Date().getFullYear() }} witselblue</p>
        </div>
    </div>
</template>

<script>
    import LanguageMenu from '@/components/LanguageMenu.vue';

    export default {
        components: {
            LanguageMenu,
        },
        data() {
            return {
                isOpen: false,
                hoveredIndex: null,
                staggeredIndexes: [],
                staggerTimers: [],
                menuItems: [
                    { to: '/', label: 'H<span>o</span>me' },
                    { to: '/archive', label: 'Arc<span>h</span>ive' },
                    { to: '/contact', label: 'Co<span>n</span>tact' },
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
            z-index: 10;
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
            background-color: $white_inverted;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50vw;
            z-index: 9;
            transform: translateY(-100%);
            mix-blend-mode: difference;
            backdrop-filter: blur(16px);
            overflow: hidden;
            will-change: transform;
            transition: transform 0.4s ease;

            .menu-list {
                margin-top: 50vh;
                transform: translateY(-50%);
                display: flex;
                align-items: center;
                flex-direction: column;
                justify-content: center;

                li {
                    width: fit-content;
                    overflow: hidden;

                    &:nth-child(2n) a {
                        transform: translateY(150%) rotate(8deg);
                    }

                    &:nth-child(2n+1) a {
                        transform: translateY(150%) rotate(-8deg);
                    }

                    &.stagger a {
                        transform: translateY(0) rotate(0) !important;
                        transition: transform 0.4s ease;
                    }

                    &.dimmed a {
                        opacity: 0.2;
                        filter: blur(4px);
                        transition: all 0.4s ease;
                    }

                    a {
                        display: inline-block;
                        width: fit-content;
                        color: $black;
                        font-size: 5rem;
                        font-weight: 700;
                        letter-spacing: 0.2em;
                        text-transform: uppercase;
                        opacity: 1;
                        filter: blur(0);
                        transition: all 0.4s ease;

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
                }
            }

            .copyright {
                position: absolute;
                bottom: 2.5vw;
                left: 50%;
                transform: translateX(-50%);
                font-size: 0.9rem;
                color: $black;
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
