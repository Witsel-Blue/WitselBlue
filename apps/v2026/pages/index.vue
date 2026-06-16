<template>
    <main class='home' :class='{ "intro-only": !exploded }'>
        <HomePagination v-if='exploded' />
        <Mainvisual />
        <Profile v-if='exploded' />
        <Story v-if='exploded' />
        <Archive v-if='exploded' />
    </main>
</template>

<script>
    import HomePagination from '@/components/home/HomePagination.vue';
    import Mainvisual from '@/components/home/Mainvisual.vue';
    import Profile from '@/components/home/Profile.vue';
    import Story from '@/components/home/Story.vue';
    import Archive from '@/components/home/Archive.vue';

    export default {
        components: {
            HomePagination,
            Mainvisual,
            Profile,
            Story,
            Archive,
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
