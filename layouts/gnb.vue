<template>
    <div id="gnb">
        <div class="inner">

            <nav>
                <ul>

                    <li
                        v-for="nav in navigation"
                        :key="nav.name">
                        <Nuxt-link :to=nav.path>
                            {{ nav.name }}
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
                        name: 'Home',
                        path: '/'
                    },
                    {
                        name: 'Arhive',
                        path: '/archive'
                    },
                    {
                        name: 'Portfolio',
                        path: '/portfolio'
                    }
                ]
            }
        }
    }
</script>