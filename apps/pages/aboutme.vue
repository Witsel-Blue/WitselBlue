<template>
    <div id='aboutme'>
        <section>
            <div class='inner'>
                <h2>About Me</h2>
            </div>
        </section>
        <section>
            <TextMarquee :image='knot' />
        </section>
    </div>
</template>

<script>
    import TextMarquee from '@/components/TextMarquee.vue';

    export default {
        name: 'AboutMe',
        components: {
            TextMarquee,
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
        section {
            .inner {
                padding: 20vh 0;
                text-align: center;
            }
        }
    }
</style>