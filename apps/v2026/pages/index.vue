<template>
    <main class='home' :class='{ "intro-only": !exploded }'>
        <HomePagination v-if='exploded' />
        <Mainvisual />
        <Profile v-if='exploded' />
    </main>
</template>

<script>
    import HomePagination from '@/components/home/HomePagination.vue';
    import Mainvisual from '@/components/home/Mainvisual.vue';
    import Profile from '@/components/home/Profile.vue';

    export default {
        components: {
            HomePagination,
            Mainvisual,
            Profile,
        },
        data() {
            return {
                exploded: false,
            };
        },
        mounted() {
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
