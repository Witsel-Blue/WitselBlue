<template>
    <div id="footer" ref="footer">
        <div class="bg"></div>
        <div class="footer">
            <h1 class="ft-tanpearl">Work with me!</h1>
            <ul class="lists">
                <li>
                    <ButtonRound
                        :link="link">
                    </ButtonRound>
                </li>
                <li>
                    <ButtonRound
                        :link="link2">
                    </ButtonRound>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import ButtonRound from '@/components/ButtonRound.vue';

    export default {
        components: {
            ButtonRound,
        },
        data() {
            return {
                link: {
                    href: 'mailto:witselblue@gmail.com',
                    text: 'witselblue@gmail.com',
                },
                link2: {
                    href: '/resume',
                    text: 'view resume',
                },
            }
        },
        mounted() {

        },
        methods: {

        }
    }
</script>

<style lang="scss" scoped>
    #footer {
        // border: 1px solid red;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background-color: #2C2A2A;
    }

    .bg {
        // border: 1px solid blue;
        width: 100%;
        height: 20%;
        background-color: #f7f7f7;
        border-radius: 0 0 80% 80% / 0 0 40% 40%;
    }

    .footer {
        background-color: #2C2A2A;
        color: #fff;
        width: 100%;
        height: 80%;
        padding: 10vh 10vw;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 40px;

        h1 {
            font-size: 3rem;
            font-weight: normal;
        }

        .lists {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        #button-round::v-deep {
            .button {
                padding: 16px;
                border-radius: 32px;
                &::after {
                    border: 1px solid #fff !important;
                    border-radius: 32px;
                }
            }
            .circle::before {
                background-color: #fff !important;
            }
            .title {
                color: #fff !important;
            }

            &:hover {
                .title {
                    color: #3E3C3C !important;
                }
            }
        }
    }
</style>