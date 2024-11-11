<template>
    <div id="archive">
        <PageTransition :title="title"></PageTransition>
        archive
    </div>
</template>

<script>
    import PageTransition from '@/components/PageTransition.vue';
    export default {
        components: {
            PageTransition,
        },
        data() {
            return {
                title: 'Archive',
            }
        }
    }
</script>

<style lang="scss" scoped>
    #archive {
        width: 100%;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>