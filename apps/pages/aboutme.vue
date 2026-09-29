<template>
    <div id='aboutme'>
        <section class='page-title'>
            <div class='inner'>
                <TextStaggerByMiddle text='About Me' />
            </div>
        </section>
        <section class='page-content'>
            <Story/>
        </section>
        <!-- <section>
            <TextMarquee :image='knot' />
        </section> -->
    </div>
</template>

<script>
    import TextStaggerByMiddle from '@/components/common/TextStaggerByMiddle.vue';
    import Story from '@/components/home/Story.vue';
    // import TextMarquee from '@/components/common/TextMarquee.vue';

    export default {
        name: 'AboutMe',
        components: {
            TextStaggerByMiddle,
            Story,
            // TextMarquee,
        },
        data() {
            return {
                knot: require('@/assets/img/home/knot.svg'),
            };
        },
    };
</script>