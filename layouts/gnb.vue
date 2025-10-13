<template>
    <div id='gnb' ref='gnb'>
        <nav class='pc'>
            <ul class='nav'>
                <li v-for='nav in navigation' :key='nav.name' class='mouse-hover1' ref='menu'>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="102" height="102" viewBox="0 0 102 102" fill="none">
                        <path d="M49.8713 5.50822C48.8535 6.34293 47.8669 7.23509 46.9165 8.18542C31.2956 23.8064 31.2956 49.133 46.9165 64.754C56.5255 74.3629 69.8064 78.0573 82.2422 75.8446C66.5299 88.7308 43.2993 87.8397 28.6284 73.1688C13.0075 57.5478 13.0074 32.2213 28.6284 16.6003C34.6405 10.5882 42.0906 6.89256 49.8713 5.50822Z" fill="#3E3C3C"/>
                        <path d="M71 19L76.4018 33.5982L91 39L76.4018 44.4018L71 59L65.5982 44.4018L51 39L65.5982 33.5982L71 19Z" fill="#3E3C3C"/>
                    </svg>
                </div>
            </button>
            <div class='menu-cont'>
                <nav>
                    <ul class='nav'>
                        <li v-for='nav in navigation' :key='nav.name'>
                            <a :href='nav.path' @click='linkClick' v-html='nav.name'></a>
                        </li>
                        <li>
                            <ChangeLang />
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
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (process.client) {
    gsap.registerPlugin(ScrollTrigger);
}
    
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
        this.updateGnbColor(this.$route.path);
    },
    watch: {
        '$route.path'(newPath) {
            this.updateGnbColor(newPath);
        }
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
        },
        updateGnbColor(path) {
            const menus = this.$refs.menu;
            if (!menus) return;

            const menuList = Array.isArray(menus) ? menus : [menus];
            ScrollTrigger.getAll().forEach(t => t.kill());
            menuList.forEach(m => {
                const a = (m.$el && m.$el.querySelector) ? m.$el.querySelector('a') : (m.querySelector ? m.querySelector('a') : m);
                if (a) gsap.killTweensOf(a);
            });

            if (path === '/') {
                this.initGnbColorScroll(menuList);
            } else {
                menuList.forEach(m => {
                    const a = (m.$el && m.$el.querySelector) ? m.$el.querySelector('a') : (m.querySelector ? m.querySelector('a') : m);
                    if (a) {
                    a.style.color = '#3E3C3C';
                    }
                });
            }
        },
        initGnbColorScroll(menus) {
            if (!menus || !menus.length) return;

            const bumper = document.querySelector('.bumper');
            if (!bumper) {
                menus.forEach(m => {
                    const a = (m.$el && m.$el.querySelector) ? m.$el.querySelector('a') : (m.querySelector ? m.querySelector('a') : m);
                    if (a) a.style.color = '#3E3C3C';
                });
                return;
            }

            menus.forEach(m => {
                const a = (m.$el && m.$el.querySelector) ? m.$el.querySelector('a') : (m.querySelector ? m.querySelector('a') : m);
                if (a) a.style.color = '#f7f7f7';
            });

            menus.forEach(m => {
                const a = (m.$el && m.$el.querySelector) ? m.$el.querySelector('a') : (m.querySelector ? m.querySelector('a') : m);
                if (!a) return;

                gsap.killTweensOf(a);

                gsap.to(a, {
                    color: '#3E3C3C',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: bumper,
                        start: 'top 100%',
                        end: 'top top',
                        scrub: true,
                    }
                });
            });
        },

    }
}
</script>

<style lang='scss' scoped>
    @import '/assets/scss/layout/gnb.scss';
</style>