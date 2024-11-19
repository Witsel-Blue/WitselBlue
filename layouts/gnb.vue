<template>
    <div id="gnb" ref="gnb">

        <nav class="pc">
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

        <div 
            class="mb"
            :class="{ 'active' : this.open === true}">
            <button 
                class="menu-button" 
                @click="menuClick">
                <div class="button-wrap">
                    <span class="line1"></span>
                    <span class="line2"></span>
                    <span class="line3"></span>
                </div>
            </button>
            <div class="menu-cont">
                <nav>
                    <ul>
                        <li
                            v-for="nav in navigation"
                            :key="nav.name">
                            <a
                                @click="linkClick"
                                :href="nav.path"
                                v-html="nav.name">
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
            <Pager></Pager>
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
                ],
                open: true,
            }
        },
        mounted() {
            this.menuClick();
            this.linkClick();
        },
        methods: {
            menuClick() {
                this.open = !this.open;
            },
            linkClick() {
                this.open = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '/assets/scss/layout/gnb.scss';
</style>