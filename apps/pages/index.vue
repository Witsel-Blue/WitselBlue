<template>
    <main class='home' :class='{ "intro-only": !exploded }'>
        <Mainvisual :key='mainvisualKey' />
        <About v-if='exploded' />
        <Story v-if='exploded' />
        <FeaturedWork v-if='exploded' />
        <RabbitHole v-if='exploded' />
    </main>
</template>

<script>
    import Mainvisual from '@/components/home/Mainvisual.vue';
    import About from '@/components/home/About.vue';
    import Story from '@/components/home/Story.vue';

    export default {
        components: {
            Mainvisual,
            About,
            Story,
            FeaturedWork: () => import('@/components/home/FeaturedWork.vue'),
            RabbitHole: () => import('@/components/home/RabbitHole.vue'),
        },
        data() {
            return {
                exploded: false,
                mainvisualKey: 0,
            };
        },
        mounted() {
            this.onIntroState = (done) => {
                this.exploded = done;
            };
            this.onIntroReplay = () => {
                this.exploded = false;
                this.mainvisualKey += 1;
            };
            this.$root.$on('mainvisual-intro-state', this.onIntroState);
            this.$root.$on('intro-replay-request', this.onIntroReplay);
        },
        beforeDestroy() {
            this.$root.$off('mainvisual-intro-state', this.onIntroState);
            this.$root.$off('intro-replay-request', this.onIntroReplay);
        },
    };
</script>

<style lang='scss' scoped>
    @use '@/assets/scss/base/variables.scss' as *;

    .home.intro-only {
        height: 100vh;
        overflow: hidden;
    }
</style>
