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

<style lang="scss" scoped>
    @import '@/assets/scss/base/variables.scss';
    
    #resume {
        background-color: $white2;
        -webkit-touch-callout: none;
        user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        -webkit-user-select: none;
    }
</style>