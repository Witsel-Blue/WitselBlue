<template>
    <div id='loading'>
        <Logo class='loading__logo' />
        <div class='loading__progress'>
            <div class='loading__percent'>
                {{ percent }}%
            </div>
            <div class='loading__progress-bar'>
                <div
                    class='loading__progress-filled'
                    :style='{ width: `${percent}%` }'
                />
            </div>
        </div>
    </div>
</template>

<script>
    import Logo from '@/components/svg/logo.vue';

    export default {
        name: 'Loading',
        components: {
            Logo,
        },
        props: {
            percent: {
                type: Number,
                default: 0,
            },
        },
    };
</script>

<style lang='scss' scoped>
    @use '@/assets/scss/base/variables' as *;

    #loading {
        position: fixed;
        inset: 0;
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 2.5vw;
        background: $black;
        color: $white;

        .loading__progress {
            display: flex;
            flex-direction: column;
            gap: 1.25vw;

            .loading__percent {
                font-size: 0.8rem;
                line-height: 1;
                display: flex;
                justify-content: center;
            }

            .loading__progress-bar {
                width: 16rem;
                height: 2px;
                background: rgba($white, 0.25);

                .loading__progress-filled {
                    width: 0;
                    height: 100%;
                    background: $white;
                }
            }
        }
    }
</style>