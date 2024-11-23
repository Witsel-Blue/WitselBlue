<template>
    <div id="pagination">
        <ul class="pager">
                <li class="mouse-hover">
                    <Nuxt-link :to="pagination.prevLink">
                        <TextShifting :text="pagination.prevText"></TextShifting>
                    </Nuxt-link>
                </li>
                <li class="mouse-hover">
                    <Nuxt-link :to="pagination.nextLink">
                        <TextShifting :text="pagination.nextText"></TextShifting>
                    </Nuxt-link>
                </li>
            </ul>
    </div>
</template>

<script>
    import TextShifting from '@/components/TextShifting.vue';

    export default {
        components: {
            TextShifting,
        },
        props: {
            pagination: Object,
        },
        data() {
            return {

            }
        },
        mounted() {
            window.scrollTo({
                top: 0,
            });
            this.typewriter();
        },
        methods: {
            typewriter() {
            }
        }
    }

</script>

<style lang="scss" scoped>
    @import '@/assets/scss/base/variables.scss';
    
    .pager li {
        position: fixed;
        top: 50%;
        transform: translateY(-50%);
        writing-mode: vertical-lr;
        text-align: center;

        &:first-child {
            left: 5vw;
        }
        &:last-child {
            right: 5vw;
        }
    }

    // mobile
    @media all and (max-width: $mobile) {
        #pagination {
            display: none;
        }
    }
</style>