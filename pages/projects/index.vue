<template>
    <div
        id="projects"
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

        <div class="tab-wrap">
            <div class="inner">
                <button
                    class="mouse-hover2"
                    :class="{ active: activeTab === 'all' }"
                    @click="selectAll"
                >
                    All
                </button>
                <div class="tab-group" v-for="(tagsArr, group) in tabs" :key="group">
                    <button 
                        class="mouse-hover2"
                        :class="{ active: openedGroup === group }"
                        @click="toggleGroup(group)"
                    >
                        {{ groupLabels[group] || group }}
                    </button>
                    <div v-if="openedGroup === group" class="tab-sub">
                        <button
                            v-for="tag in tagsArr"
                            :key="tag"
                            class="mouse-hover2"
                            :class="{ active: activeTab === tag }"
                            @click="activeTab = tag"
                        >
                            {{ tagLabels[tag] || tag }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="list-wrap">
            <div class="inner">
                <div
                    v-for="(item, i) in filteredLists"
                    :key="i"
                    class="list-card"
                >
                    <SkewCardY :img="item.images.thumb" :path="item.path" />
                    <div class="desc">
                        <p class="work">{{ item.tags.work }}</p>
                        <NuxtLink 
                            class="title mouse-hover1"
                            :to=item.path>
                            <TextShifting :text="item.title" :key="item.slug" />
                        </NuxtLink>
                        <div class="tags">
                            <p v-for="(value, key) in item.tags" :key="key" v-if="key !== 'work'">
                                #{{ value }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import projectsData from '@/assets/data/projects.js';
import CursorCustom from '@/components/CursorCustom.vue';
import PageTransition from '@/layouts/PageTransition.vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import ButtonScrollDown from '@/components/ButtonScrollDown.vue';
import StarBg from '@/components/StarBg.vue';
import SkewCardY from '@/components/SkewCardY.vue';
import TextShifting from '@/components/TextShifting.vue';

if (process.client) {
    gsap.registerPlugin(ScrollTrigger);
}

export default {
    components: {
        CursorCustom,
        PageTransition,
        TextShifting,
        ButtonScrollDown,
        StarBg,
    },
    data() {
        return {
            title: 'projects',
            activeTab: 'all',
            openedGroup: null,
            groupLabels: {
                work: '업무영역',
                env: '작업환경',
                scope: '기여도',
                platform: '플랫폼',
            },
            tagLabels: {
                development: '전체개발',
                frontend: '프론트엔드',
                publishing: '퍼블리싱',
                individual: '개인',
                teamwork: '팀워크',
                web: '웹',
                app: '앱',
            },
            lists: projectsData.map(p => ({
                ...p,
                path: `/projects/${p.slug}`,
            })),
        }
    },
    computed: {
        tabs() {
            const workSet = new Set();
            const envSet = new Set();
            const scopeSet = new Set();
            const platformSet = new Set();

            this.lists.forEach(item => {
                if (item.tags.work) workSet.add(item.tags.work);
                if (item.tags.env) envSet.add(item.tags.env);
                if (item.tags.scope) scopeSet.add(item.tags.scope);
                if (item.tags.platform) platformSet.add(item.tags.platform);
            });

            return {
                work: [...workSet],
                env: [...envSet],
                scope: [...scopeSet],
                platform: [...platformSet],
            };
        },
        filteredLists() {
            if (this.activeTab === 'all') return this.lists;

            if (['work','env','scope','platform'].includes(this.activeTab)) {
                return this.lists.filter(item => item.tags[this.activeTab]);
            }

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
            if (!title || !button) return;

            var winH = window.innerWidth;
            var titleTop = title.offsetTop - winH * 0.03;

            window.addEventListener('scroll', function () {
                var scrolled = window.scrollY;

                if (titleTop < scrolled) {
                    // title.classList.add('active');
                } else {
                    var x = 1 - scrolled * 0.008;
                    var x2 = 1 - scrolled * 0.04;
                    // title.style.transform = 'scale(' + x + ')';
                    button.style.opacity = x2;
                    // title.classList.remove('active');
                }
            });
        },
        selectAll() {
            this.activeTab = 'all';
            this.openedGroup = null;
        },
        toggleGroup(group) {
            this.activeTab = group;
            this.openedGroup = this.openedGroup === group ? null : group;
        }
    },
}
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/layout/page.scss';
</style>
