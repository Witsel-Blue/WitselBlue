<template>
    <div id="change-lang">
        <button>KO</button>
        <button>EN</button>
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
        position: fixed;
        top: 2%;
        right: 5vw;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        
        button {
            font-size: 0.8rem;

            &:not(:last-child)::after {
                content: '';
                display: inline-block;
                width: 1px;
                height: 0.6rem;
                background-color: $black1;
                margin: 0 8px;
            }
        }
    }
</style>