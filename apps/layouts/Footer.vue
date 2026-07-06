<template>
    <div id='footer'>
        <section class='social'>
            <div class='inner'>
                <h2>EMAIL</h2>
                <ul>
                    <li>
                        <a href='mailto:witselblue@gmail.com'>
                            <TextShifting text='witselblue@gmail.com' />
                        </a>
                    </li>
                </ul>
                <h2>SOCIAL</h2>
                <ul>
                    <li>
                        <a href='https://www.instagram.com/witsel_blue' target='_blank'>
                            <TextShifting text='Instagram' />
                        </a>
                    </li>
                    <li>
                        <a href='https://github.com/Witsel-Blue' target='_blank'>
                            <TextShifting text='GitHub' />
                        </a>
                    </li>
                    <li>
                        <a href='https://www.linkedin.com/in/witselblue/' target='_blank'>
                            <TextShifting text='LinkedIn' />
                        </a>
                    </li>
                    <li>
                        <a href='https://open.kakao.com/o/s1ei023h' target='_blank'>
                            <TextShifting text='Kakao' />
                        </a>
                    </li>
                </ul>
            </div>
        </section>
        <section class='info'>
            <ul>
                <li>
                    <dl>
                        <dt>VERSION</dt>
                        <dd>2026 &copy; All rights reserved</dd>
                    </dl>
                </li>
                <li>
                    <dl>
                        <dt>LOCAL TIME</dt>
                        <dd>{{ localTimeDisplay }}</dd>
                    </dl>
                </li>
            </ul>
            <button type='button' @click='scrollToTop'>
                <TextShifting text='BACK TO TOP' />
            </button>
        </section>
    </div>
</template>

<script>
    import TextShifting from '@/components/TextShifting.vue';

    export default {
        name: 'SiteFooter',
        components: {
            TextShifting,
        },
        data() {
            return {
                now: new Date(),
                clockTimer: null,
            };
        },
        computed: {
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
        },
        beforeDestroy() {
            if (this.clockTimer) clearInterval(this.clockTimer);
        },
        methods: {
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
        height: 24vh;
        margin-top: -24vh;
        position: relative;
        z-index: 1;
        mix-blend-mode: difference;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 2.5vw;

        .social {            
            .inner {
                display: grid;
                grid-template-columns: auto auto;
            }

            h2 {
                font-size: 2rem;
                font-weight: 600;
                text-align: right;
                margin-right: 2rem;
                user-select: none;
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
                                font-family: $ft-diphylleia;
                            }
                        }
                    }
                }

                &:nth-of-type(2) {
                    display: flex;
                    gap: 1rem;
                }
            }
        }

        .info {
            margin-top: 4rem;
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

            button {
                .text-shifting::v-deep {
                    .space {
                        display: inline-block;
                    }
                }
            }
        }
    }
</style>