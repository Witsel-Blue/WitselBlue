<template>
    <div id="change-lang">
        <button class="active mouse-hover2">KO</button>
        <button class="mouse-hover2">EN</button>
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
    
    #change-lang {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        
        button {
            font-size: 0.8rem;
            color: $black1;

            &:not(:last-child)::after {
                content: '';
                display: inline-block;
                width: 1px;
                height: 0.6rem;
                background-color: $black1;
                margin: 0 8px;
            }

            &.active {
                font-weight: bold;
            }
        }
    }
</style>