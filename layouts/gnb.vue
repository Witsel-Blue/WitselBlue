<template>
    <div id='gnb' ref='gnb'>
        <nav class='pc'>
            <ul class='nav'>
                <li v-for='nav in navigation' :key='nav.name' class='mouse-hover1'>
                    <Nuxt-link :to='nav.path' v-html='nav.name' 
                        @click.native.prevet='linkClick(nav.path)'
                    />
                </li>
                <li>
                    <Pager />
                </li>
                <li>
                    <ChangeLang />
                </li>
            </ul>
        </nav>

        <div ref='mb' class='mb'
            :class="[
                { 'active' : open === true },
                { 'shadow' : headerShadow === true }
            ]"
        >
            <button class='menu-button' @click='menuClick'>
                <div class='button-wrap'>
                    <svg width='216' height='216' viewBox='0 0 216 216' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path d='M78.2963 180C70.163 180 63.763 178 59.0963 174C54.4296 170 50.6963 164.533 47.8963 157.6C45.2296 150.533 42.6963 142.533 40.2963 133.6L20.8963 61.6C19.4296 56 19.763 50.8 21.8963 46C24.0296 41.0667 28.2296 37.8 34.4963 36.2C40.363 34.6 45.563 35 50.0963 37.4C54.6296 39.8 57.6963 44 59.2963 50L77.2963 115.8C78.8963 121.533 80.563 125.733 82.2963 128.4C84.163 131.067 87.0963 131.933 91.0963 131C94.8296 130.067 96.8296 128 97.0963 124.8C97.363 121.6 96.6963 117.067 95.0963 111.2L82.2963 62.6C80.563 55.9333 80.763 50.2 82.8963 45.4C85.163 40.4667 89.563 37.2667 96.0963 35.8C102.763 34.2 108.096 35.0667 112.096 38.4C116.23 41.6 119.03 46.1333 120.496 52L136.696 115.8C138.43 122.333 140.296 126.733 142.296 129C144.43 131.267 147.163 131.933 150.496 131C154.23 129.933 156.03 127.867 155.896 124.8C155.763 121.6 155.296 117 154.496 111C153.296 101.667 152.23 94 151.296 88C150.496 82 149.83 77 149.296 73C148.896 69 148.696 65.3333 148.696 62C148.696 54.5333 150.896 48.2 155.296 43C159.696 37.6667 165.696 35 173.296 35C181.03 35 186.896 37.4 190.896 42.2C194.896 46.8667 196.896 53.3333 196.896 61.6C196.896 66.9333 196.096 72.5333 194.496 78.4C193.03 84.2667 191.563 89.8 190.096 95L178.896 133.6C176.363 142.4 173.83 150.333 171.296 157.4C168.896 164.333 165.63 169.867 161.496 174C157.363 178 151.496 180 143.896 180C134.696 180 127.496 177.133 122.296 171.4C117.096 165.667 113.096 156.267 110.296 143.2H108.896C106.23 156.267 102.696 165.667 98.2963 171.4C93.8963 177.133 87.2296 180 78.2963 180Z' fill='#3E3C3C' />
                    </svg>
                </div>
            </button>
            <div class='menu-cont'>
                <nav>
                    <ul class='nav'>
                        <li v-for='nav in navigation' :key='nav.name'>
                            <a :href='nav.path' @click='linkClick' v-html='nav.name'></a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div class='desc'>
                <p>&copy; 2025 witselblue</p>
            </div>
            <div class='shadow'@click='shadowClick'></div>
            <Pager />
        </div>
    </div>
</template>

<script>
import Pager from '@/components/pager.vue';
import ChangeLang from '@/components/ChangeLang.vue';
    
export default {
    components: {
        Pager,
        ChangeLang,
    },
    data() {
        return {
            navigation: [
                {
                    name: '<p>H<span>o</span>me</p>',
                    path: '/'
                },
                {
                    name: '<p>Pr<span>o</span>jects</p>',
                    path: '/projects'
                },
                {
                    name: '<p>Ar<span>h</span>ive</p>',
                    path: '/archive'
                },
            ],
            open: false,
            headerShadow: false,
        }
    },
    computed: {
        activeTab() {
            return this.$route.path;
        }
    },
    mounted() {
        this.menuClick();
        this.linkClick();
        this.winScrolled();
    },
    methods: {
        menuClick() {
            this.open = !this.open;
        },
        linkClick() {
            this.open = false;
        },
        shadowClick() {
            this.open = false;
        },
        winScrolled() {
            window.addEventListener('scroll', function() {
                var scrollY = window.scrollY;
                if (scrollY > 100) {
                    return this.headerShadow = true;
                } else {
                    return this.headerShadow = false;
                }
            });
        },
        linkClick(path) {
            this.open = false;
            if (this.$route.path === path) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }
}
</script>

<style lang='scss' scoped>
    @import '/assets/scss/layout/gnb.scss';
</style>