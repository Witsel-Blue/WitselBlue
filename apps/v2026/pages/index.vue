<template>
    <main class='home' :class='{ "intro-only": !exploded }'>
        <HomePagination v-if='exploded' />
        <Mainvisual />
        <About v-if='exploded' />
        <Story v-if='exploded' />
        <FeaturedWork v-if='exploded' />
        <FoldingScreen v-if='exploded' />
    </main>
</template>

<script>
    import HomePagination from '@/components/home/HomePagination.vue';
    import Mainvisual from '@/components/home/Mainvisual.vue';
    import About from '@/components/home/About.vue';
    import Story from '@/components/home/Story.vue';
    import FeaturedWork from '@/components/home/FeaturedWork.vue';
    import FoldingScreen from '@/components/home/FoldingScreen.vue';

    export default {
        components: {
            HomePagination,
            Mainvisual,
            About,
            Story,
            FeaturedWork,
            FoldingScreen,
        },
        data() {
            return {
                exploded: false,
            };
        },
        mounted() {
            if (process.client && this.$root.$wb2026IntroDone) {
                this.exploded = true;
            }
            this.onIntroState = (done) => {
                this.exploded = done;
            };
            this.$root.$on('mainvisual-intro-state', this.onIntroState);
        },
        beforeDestroy() {
            this.$root.$off('mainvisual-intro-state', this.onIntroState);
        },
    };
</script>

<style lang='scss' scoped>
.home.intro-only {
    height: 100vh;
    overflow: hidden;
}
</style>
