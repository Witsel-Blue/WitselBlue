<template>
    <div id='aboutme'>
        <section class='page-title'>
            <div class='inner-l'>
                <h2>About Me</h2>
            </div>
        </section>
        <!-- <section>
            <TextMarquee :image='knot' />
        </section> -->
    </div>
</template>

<script>
    // import TextMarquee from '@/components/common/TextMarquee.vue';

    export default {
        name: 'AboutMe',
        components: {
            // TextMarquee,
        },
        data() {
            return {
                knot: require('@/assets/img/home/knot.svg'),
            };
        },
    };
</script>

<style lang='scss' scoped>
    #aboutme {
        min-height: 100vh;
    }
</style>