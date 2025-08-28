<template>
    <div id="change-cursor">
        <button class="active mouse-hover2">기본 커서로</button>
        <button class="mouse-hover2">인터렉티브 커서로</button>
    </div>
</template>

<script>
export default {
    mounted() {

    },
    methods: {

    },
}
</script>

<style lang="scss" scoped>
    @use '@/assets/scss/base/variables.scss' as *;
    
    #change-cursor {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        
        button {
            font-size: 0.8rem;
            color: $white1;

            &:not(:last-child)::after {
                content: '';
                display: inline-block;
                width: 1px;
                height: 0.6rem;
                background-color: $white1;
                margin: 0 8px;
            }

            &.active {
                font-weight: bold;
            }
        }
    }
</style>