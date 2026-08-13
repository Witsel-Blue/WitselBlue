<template>
    <div id='archive'>
        <section class='page-title'>
            <div class='inner-l'>
                <TextStaggerByMiddle text='Archive' />
            </div>
        </section>
    </div>
</template>

<script>
    import TextStaggerByMiddle from '@/components/common/TextStaggerByMiddle.vue';

    export default {
        name: 'Archive',
        components: {
            TextStaggerByMiddle,
        },
    };
</script>

<style lang='scss' scoped>
    #archive {
        min-height: 100vh;
    }
</style>