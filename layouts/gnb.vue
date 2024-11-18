<template>
    <div id="gnb">
        <div class="inner">

            <nav>
                <ul>

                    <li
                        v-for="nav in navigation"
                        :key="nav.name">
                        <Nuxt-link 
                            :to=nav.path 
                            v-html="nav.name">
                        </Nuxt-link>
                    </li>

                    <li>
                        <Pager></Pager>
                    </li>

                </ul>
            </nav>

        </div>
    </div>
</template>

<script>
    import Pager from '@/components/pager.vue';
    
    export default {
        components: {
            Pager,
        },
        data() {
            return {
                navigation: [
                    {
                        name: '<p>H<span>o</span>me</p>',
                        path: '/'
                    },
                    {
                        name: '<p>Ar<span>h</span>ive</p>',
                        path: '/archive'
                    },
                    {
                        name: '<p>Pr<span>o</span>ject</p>',
                        path: '/project'
                    }
                ]
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '/assets/scss/layout/gnb.scss';
</style>