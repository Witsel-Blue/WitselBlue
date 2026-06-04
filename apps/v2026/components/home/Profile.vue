<template>
    <div id='profile'>
        <div class='inner'>
            <div class='shape-anchor' :style='{ opacity: shardMode ? 0 : 1 }' />
            <h2>
                Mother of pearl radiates different colors <br />
                depending on the angles of light.
            </h2>
            <p>
                My development philosophy is also similar to mother-of-pearl, <br />
                which provides new experiences to users every time <br />
                depending on the point where technology and senses meet.
            </p>
            <ButtonRound :link='{ href: "/", text: "View Profile" }' />
        </div>
        <TextMarquee text='witselblue' />
    </div>
</template>

<script>
    import ButtonRound from '@/components/ButtonRound.vue';
    import TextMarquee from '@/components/TextMarquee.vue';

    export default {
        name: 'Profile',
        components: {
            ButtonRound,
            TextMarquee,
        },
        data() {
            return {
                shardMode: true,
                profile: {
                    img: require('@/assets/img/home/profile.png'),
                },
            };
        },
    };
</script>

<style lang='scss' scoped>
    @use '@/assets/scss/base/variables' as *;

    #profile {
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 1;

        .shape-anchor {
            position: absolute;
            top: 8vh;
            left: 8vw;
            width: 32vh;
            height: 32vh;
        }

        h2 {
            text-align: center;
            font-family: 'tanpearl';
            font-size: 3rem;
            line-height: 1.4;
            z-index: 1;
        }

        p {
            margin-top: 2rem;
            text-align: center;
            font-size: 1.2rem;
            line-height: 1.5;
            font-family: 'basic_font';
        }

        #button-round::v-deep {
            margin-top: 2rem;
            text-align: center;
        }

        #text_marquee::v-deep {
            position: absolute;
            bottom: 0;
        }
    }
</style>