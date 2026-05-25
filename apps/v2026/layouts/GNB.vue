<template>
    <div id='gnb' :class='{ open: isOpen }'>
        <button class='menu-btn' @click='toggleOpen'>
            <span class='line' />
            <span class='line' />
        </button>

        <div class='menu-cont'>
            <LanguageMenu />
        </div>
        <ul class='menu-list'>
            <li class='menu-item'>
                <NuxtLink to='/'>{{ $t('gnb.nav1') }}</NuxtLink>
            </li>
            <li class='menu-item'>
                <NuxtLink to='/archive'>{{ $t('gnb.nav2') }}</NuxtLink>
            </li>
        </ul>
    </div>
</template>

<script>
    import LanguageMenu from '@/components/LanguageMenu.vue';
    import TextStagger from '@/components/TextStagger.vue';

    export default {
        components: {
            LanguageMenu,
            TextStagger,
        },
        data() {
            return {
                isOpen: false,
            };
        },
        methods: {
            toggleOpen() {
                this.isOpen = !this.isOpen;
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
            width: 24px;
            height: 1rem;
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

        .menu-cont {
            display: block;
            background-color: $white_inverted;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 9;
            mix-blend-mode: difference;
            backdrop-filter: blur(16px);
            height: 0;
            overflow: hidden;
            transition: height 0.4s ease;
        }

        .menu-list {
            display: none;
            position: absolute;
            bottom: 25vh;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
        }

        &.open {
            .menu-btn {
                justify-content: center;

                .line {
                    background-color: $black;
                    transition: transform 0.4s ease;

                    &:first-child {
                        transform: rotate(45deg);
                    }
                    &:last-child {
                        transform: rotate(-45deg);
                    }
                }
            }

            .menu-cont {
                height: 100%;
                transition: height 0.4s ease;
            }

            .menu-list {
                display: block;
                z-index: 11;

                li {
                    a {
                        color: $black;
                        font-size: 5rem;
                        font-weight: bold;
                        transition: all 0.4s ease;
                    }
                }
            }
        }
    }
</style>
