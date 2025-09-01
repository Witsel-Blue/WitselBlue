<template>
    <div
        id="resume"
        oncontextmenu="return false"
        ondragstart="return false"
        onselectstart="return false"
    >
        <img src="@/static/resume.png">
    </div>
</template>

<script>
export default {
    async asyncData({ store }) {
        store.commit('setNoUIPage', true);
    },
    beforeDestroy() {
        this.$store.commit('setNoUIPage', false);
    }
}
</script>

<style lang="scss" scoped>
    @use '@/assets/scss/base/variables.scss' as *;
    
    #resume {
        background-color: $white2;
        -webkit-touch-callout: none;
        user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        -webkit-user-select: none;
    }
</style>