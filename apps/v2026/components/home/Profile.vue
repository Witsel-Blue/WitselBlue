<template>
    <div id='profile'>
        <div class='inner'>
            <h2 :style='{ opacity: shardMode ? 0 : 1 }'>Profile</h2>
        </div>
        <TextMarquee text='witselblue' />
    </div>
</template>

<script>
    import TextMarquee from '@/components/TextMarquee.vue';

    export default {
        name: 'Profile',
        components: {
            TextMarquee,
        },
        data() {
            return {
                shardMode: true,
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
        
        h2 {
            text-align: center;
            font-size: 4rem;
            transition: opacity 0.2s ease;
            z-index: 1;
        }

        #text_marquee::v-deep {
            position: absolute;
            bottom: 0;
        }
    }
</style>