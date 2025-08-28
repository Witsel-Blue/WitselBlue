<template>
    <div
        id="project"
        class="page"
    >
        <CursorCustom />
        <PageTransition :title="title" />

        <div class="main">
            <h1 class="title ft-bagel">
                {{ title }}
            </h1>
            <StarBg />
            <ButtonScrollDown />
        </div>

        <!-- 탭 메뉴 -->
        <div class="tab-menu">
            <button
                :class="{ active: activeTab === 'all' }"
                @click="activeTab = 'all'"
            >
                All
            </button>
            <div class="tab-group">
                <h4>Work</h4>
                <button
                v-for="tag in tabs.work"
                :key="tag"
                :class="{ active: activeTab === tag }"
                @click="activeTab = tag"
                >
                    {{ tag }}
                </button>
            </div>
            <div class="tab-group">
                <h4>Env</h4>
                <button
                v-for="tag in tabs.env"
                :key="tag"
                :class="{ active: activeTab === tag }"
                @click="activeTab = tag"
                >
                    {{ tag }}
                </button>
            </div>
            <div class="tab-group">
                <h4>Team</h4>
                <button
                v-for="tag in tabs.team"
                :key="tag"
                :class="{ active: activeTab === tag }"
                @click="activeTab = tag"
                >
                    {{ tag }}
                </button>
            </div>
            <div class="tab-group">
                <h4>Platform</h4>
                <button
                v-for="tag in tabs.platform"
                :key="tag"
                :class="{ active: activeTab === tag }"
                @click="activeTab = tag"
                >
                    {{ tag }}
                </button>
            </div>
        </div>

        <!-- 필터링된 리스트 -->
        <div class="project-lists">
            <div
                v-for="(item, i) in filteredLists"
                :key="i"
                class="project-card"
            >
                <img :src="item.img" :alt="item.name" />
                <h3>{{ item.name }}</h3>
                <p>{{ item.work }} | {{ item.duration }}</p>
                <a v-if="item.link" :href="item.link" target="_blank">Visit</a>
                <div class="tags">
                    <span v-for="(value, key) in item.tags" :key="key">
                        #{{ value }}
                    </span>
                </div>
            </div>
        </div>

        <Footer />
    </div>
</template>

<script>
import CursorCustom from '@/components/CursorCustom.vue';
import Footer from '@/layouts/Footer.vue';
import PageTransition from '@/layouts/PageTransition.vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import TextShifting from '@/components/TextShifting.vue';
import ButtonScrollDown from '@/components/ButtonScrollDown.vue';
import StarBg from '@/components/StarBg.vue';

if (process.client) {
    gsap.registerPlugin(ScrollTrigger);
}

export default {
    components: {
        CursorCustom,
        Footer,
        PageTransition,
        TextShifting,
        ButtonScrollDown,
        StarBg,
    },
    data() {
        return {
            title: 'project',
            activeTab: 'all',
            lists: [
                {
                    name: 'Damgon Research',
                    path: '/project/damgon',
                    link: '',
                    img: '',
                    duration: '2025.06-2025.08',
                    tags: {
                        work: 'development',
                        env: 'react',
                        team: '개인',
                        platrom: 'web',
                    }
                },
                {
                    name: 'Portfolio',
                    path: '/project/portfolio',
                    link: '',
                    img: require('@/assets/img/project09_main.png'),
                    duration: '2024.11',
                    tags: {
                        work: 'development',
                        env: 'vue',
                        team: '개인',
                        platform: 'web',
                    }
                },
                {
                    name: 'Monimo',
                    path: '/project/monimo',
                    link: 'https://www.monimo.com/w/main/WPFMHP0101M0',
                    img: require('@/assets/img/project01_main.png'),
                    duration: '2024.07-2024.10',
                    tags: {
                        work: 'development',
                        env: 'vue',
                        team: '팀',
                        platform: 'app',
                    }
                },
                {
                    name: '4·16 Online Memorial',
                    path: '/project/OnlineMemorial',
                    link: 'https://416foundation.org/%EC%98%A8%EB%9D%BC%EC%9D%B8-%EA%B8%B0%EC%96%B5-%EA%B3%B5%EA%B0%84/',
                    img: require('@/assets/img/project02_main.png'),
                    duration: '2022.04',
                    tags: {
                        work: 'publishing',
                        env: 'html',
                        team: '팀',
                        platform: 'web',
                    }
                },
                {
                    name: 'DCAMP',
                    path: '/project/DCAMP',
                    link: 'https://dcamp.kr/',
                    img: require('@/assets/img/project03_main.png'),
                    duration: '2022.01-2022.03',
                    tags: {
                        work: 'frontend',
                        env: 'drupal',
                        team: '팀',
                        platform: 'web',
                    }
                },
                {
                    name: 'Oxfam VirtualWalker',
                    path: '/project/OxfamVirtualWalker',
                    link: 'https://v50.oxfamtrailwalker.or.kr/',
                    img: require('@/assets/img/project04_main.png'),
                    duration: '2021.08-2021.09',
                    tags: {
                        work: 'frontend',
                        env: 'drupal',
                        team: '팀',
                        platform: 'web',
                    }
                },
                {
                    name: 'DCDCenter',
                    path: '/project/DCDCenter',
                    link: 'https://www.dcdcenter.or.kr/',
                    img: require('@/assets/img/project05_main.png'),
                    duration: '2021.11-2021.12',
                    tags: {
                        work: 'frontend',
                        env: 'drupal',
                        team: '팀',
                        platform: 'web',
                    }
                },
                {
                    name: 'Cabinnet',
                    path: '/project/cabinnet',
                    link: '/',
                    img: require('@/assets/img/project06_main.png'),
                    duration: '2021.05-2021.07',
                    tags: {
                        work: 'frontend',
                        env: 'drupal',
                        team: '팀',
                        platform: 'web',
                    }
                },
                {
                    name: 'KACE',
                    path: '/project/KACE',
                    link: 'http://www.kace.or.kr/',
                    img: require('@/assets/img/project07_main.png'),
                    duration: '2021.09-2021.10',
                    tags: {
                        work: 'frontend',
                        env: 'drupal',
                        team: '팀',
                        platform: 'web',
                    }
                },
                {
                    name: 'RNJOB App',
                    path: '/project/RNJOB',
                    link: 'https://rnjob.or.kr/',
                    img: require('@/assets/img/project08_main.png'),
                    duration: '2021.07',
                    tags: {
                        work: 'publishing',
                        env: 'drupal',
                        team: '팀',
                        platform: 'app',
                    }
                },
            ]
        }
    },
    computed: {
        tabs() {
            const workSet = new Set();
            const envSet = new Set();
            const teamSet = new Set();
            const platformSet = new Set();

            this.lists.forEach(item => {
                if (item.tags.work) workSet.add(item.tags.work);
                if (item.tags.env) envSet.add(item.tags.env);
                if (item.tags.team) teamSet.add(item.tags.team);
                if (item.tags.platform) platformSet.add(item.tags.platform);
            });

            return {
                work: [...workSet],
                env: [...envSet],
                team: [...teamSet],
                platform: [...platformSet],
            };
        },
        filteredLists() {
            if (this.activeTab === 'all') return this.lists;
            return this.lists.filter(item =>
                Object.values(item.tags).includes(this.activeTab)
            );
        }
    },
    mounted() {
        this.titleScroll();
    },
    methods: {
        titleScroll() {
            var title = document.querySelector('.title');
            var button = document.querySelector('#button-scrolldown');
            var winH = window.innerWidth;
            var titleTop = title.offsetTop - winH * 3 / 100;

            window.addEventListener('scroll', function () {
                var scrolled = window.scrollY;

                if (titleTop < scrolled) {
                    title.classList.add('active');
                } else {
                    var x = 1 - scrolled * 0.0016;
                    var x2 = 1 - scrolled * 0.016;
                    title.style.transform = 'scale(' + x + ')';
                    button.style.opacity = x2;
                    title.classList.remove('active');
                }
            });
        }
    },
}
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/layout/page.scss';

    .tab-menu {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin: 2rem 0;

        button {
            padding: 0.5rem 1rem;
            border: none;
            background: #eee;
            cursor: pointer;
            &.active {
                background: #333;
                color: #fff;
            }
        }
    }

    .project-lists {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 2rem;
        padding: 2rem;

        .project-card {
            border: 1px solid #ddd;
            padding: 1rem;
            border-radius: 8px;
            text-align: center;
            img {
                max-width: 100%;
                border-radius: 6px;
            }
        }
    }
</style>
