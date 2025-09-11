<template>
    <div
        id='projects'
        class='page'
    >
        <CursorCustom />
        <PageTransition :title='title' />

        <div class='main'>
            <h1 class='title ft-bagel'>
                {{ title }}
            </h1>
            <StarBg />
        </div>

        <div class='tab-wrap'>
            <div class='inner'>
                <button
                    class='mouse-hover2'
                    :class="{ active: activeTab === 'all' }"
                    @click='selectAll'
                >
                    All
                </button>
                <div class='tab-group' v-for='(tagsArr, group) in tabs' :key='group'>
                    <button 
                        class='mouse-hover2'
                        :class='{ active: openedGroup === group }'
                        @click='toggleMenu(group)'
                    >
                        {{ groupLabels[group] || group }}
                    </button>
                    <div v-if='openedGroup === group' class='tab-sub'>
                        <button
                            v-for='tag in tagsArr'
                            :key='tag'
                            class='mouse-hover2'
                            :class='{ active: activeTab === tag }'
                            @click='toggleSubmenu(tag)'
                        >
                            {{ tagLabels[tag] || tag }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class='list-wrap'>
            <div class='inner'>
                <div
                    v-for='(item, i) in filteredLists'
                    :key='i'
                    class='list-card'
                    ref='listCards'
                >
                    <SkewCardY :img='item.images.thumb' :path='item.path' />
                    <div class='desc'>
                        <p class='work'>{{ item.tags.work }}</p>
                        <NuxtLink 
                            class='title mouse-hover1'
                            :to=item.path>
                            <TextShifting :text='item.title' :key='item.slug' />
                        </NuxtLink>
                        <div class='tags'>
                            <p v-for='(value, key) in item.tags' :key='key' v-if='key !== "work"'>
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
        StarBg,
    },
    data() {
        return {
            title: 'projects',
            activeTab: 'all',
            openedGroup: null,
            groupLabels: {
                work: 'work',
                env: 'environment',
                scope: 'contribution',
                platform: 'platform',
            },
            tagLabels: {
                development: 'development',
                frontend: 'frontend',
                publishing: 'publishing',
                individual: 'individual',
                teamwork: 'teamwork',
                web: 'web',
                app: 'app',
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
    methods: {
        selectAll() {
            this.activeTab = 'all';
            this.openedGroup = null;
            this.$nextTick(() => this.animateListCards());
        },
        toggleMenu(group) {
            this.activeTab = group;
            this.openedGroup = this.openedGroup === group ? null : group;
        },
        toggleSubmenu(tag) {
            this.activeTab = tag;
            this.$nextTick(() => this.animateListCards());
        },
        animateListCards() {
            const cards = this.$refs.listCards;
            if (!cards) return;

            const cardArray = Array.isArray(cards) ? cards : [cards];

            gsap.set(cards, { 
                opacity: 0, y: 100 
            });

            gsap.to(cards, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.out'
            });
        },
    },
}
</script>

<style lang='scss' scoped>
    @import '@/assets/scss/layout/page.scss';
</style>
