<template>
    <div id="page-transition">
        <!-- {{ title }} -->
        <TextMask :text="title"></TextMask>
    </div>
</template>

<script>
    import TextMask from '@/components/TextMask.vue';

    export default {
        components: {
            TextMask,
        },
        props: {
            title: String,
        },
        data() {
            return {
            }
        },
        mounted() {
            // this.pageTransition();
        },
        methods: {
            pageTransition() {
                setTimeout(function(){
                    document.getElementById('page-transition').classList.add('active');
                }, 3000);
            },
        }
    }
</script>

<style lang="scss" scoped>
    #page-transition {
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100;
        background-color: #2c2a2a;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10vh;
        font-size: 5rem;

        &.active {
            display: none;
        }
    }
</style>