<template>
    <div id='projects' class='page'>
        <PageTransition :title="$t('projects.title')" />

        <div class='main'>
            <h1 class='title ft-bagel'>
                {{ $t('projects.title') }}
            </h1>
            <StarBg />
        </div>

        <div class='tab-wrap'>
            <div class='inner'>
                <div class='drop-lottie' v-if='showDrop'
                    :style='{top: `${dropPos.y}px`, left: `${dropPos.x}px`}'>
                    <Lottie :animationData='Drop' :loop='false' :autoplay='true' :key='dropKey' />
                </div>
                <button
                    class='all mouse-hover2'
                    :class="{ active: activeTab === 'all' }"
                    @click='selectAll($event)'
                >
                    All
                </button>
                <p>
                    sort by:
                </p>
                <div class='tab-sub-wrap'>
                    <div class='tab-group' v-for='(tagsArr, group) in tabs' :key='group'>
                        <button 
                            class='mouse-hover2'
                            :class='{ active: openedGroup === group }'
                            @click='toggleMenu($event, group)'
                        >
                            {{ groupLabels[group] || group }}
                        </button>
                        <div v-if='openedGroup === group' class='tab-sub'>
                            <button
                                v-for='tag in tagsArr'
                                :key='tag'
                                class='mouse-hover2'
                                :class='{ active: activeTab === tag }'
                                @click='toggleSubmenu($event, tag)'
                            >
                                {{ tagLabels[tag] || tag }}
                            </button>
                        </div>
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
                        <p class='work'>{{ item.tags.work[$i18n.locale] }}</p>
                        <NuxtLink 
                            class='title mouse-hover1'
                            :to=item.path>
                            <TextShifting :text='item.title[$i18n.locale]' :key='item.slug' />
                        </NuxtLink>
                        <div class='tags'>
                            <p v-for='(value, key) in item.tags' :key='key' v-if='key !== "work"'>
                                #{{ value[$i18n.locale] }}
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
import PageTransition from '@/layouts/PageTransition.vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import StarBg from '@/components/StarBg.vue';
import SkewCardY from '@/components/SkewCardY.vue';
import TextShifting from '@/components/TextShifting.vue';
import Lottie from '@/components/Lottie.vue';
import Drop from '@/assets/lottie/drop.json';

if (process.client) {
    gsap.registerPlugin(ScrollTrigger);
}

export default {
    components: {
        PageTransition,
        StarBg,
        SkewCardY,
        TextShifting,
        Lottie,
    },
    data() {
        return {
            activeTab: 'all',
            openedGroup: null,
            groupLabels: {
                work: 'work',
                env: 'environment',
                scope: 'contribution',
                platform: 'platform',
            },
            tagLabels: {
                development: 'full-stack',
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
            Drop,
            showDrop: false,
            dropPos: { x: 0, y: 0 },
            dropKey: 0,
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
        this.$nextTick(() =>{
            const allBtn = this.$el.querySelector('.all');
            if (allBtn) {
                this.triggerDropLottie({ currentTarget: allBtn });
            }

            this.animateListCards();
        });
    },
    methods: {
        triggerDropLottie(event) {
            const parentRect = event.currentTarget.offsetParent.getBoundingClientRect();
            const btnRect = event.currentTarget.getBoundingClientRect();

            this.dropPos = {
                x: btnRect.left - parentRect.left + btnRect.width / 2 - 16,
                y: btnRect.top - parentRect.top - 16,
            };

            this.showDrop = false;
            this.$nextTick(() => {
                this.showDrop = true;
                this.dropKey ++;
            });
        },
        selectAll(event) {
            this.triggerDropLottie(event);
            this.activeTab = 'all';
            this.openedGroup = null;
            this.$nextTick(() => this.animateListCards());
        },
        toggleMenu(event, group) {
            this.triggerDropLottie(event);

            const isOpen = this.openedGroup === group;

            this.activeTab = group;
            this.openedGroup = this.openedGroup === group ? null : group;

            if (!isOpen) {
                this.$nextTick(() => {
                    // this.animateTabSub(group);
                });
            }
        },
        toggleSubmenu(event, tag) {
            this.activeTab = tag;
            this.$nextTick(() => this.animateListCards());
        },
        animateListCards() {
            const cards = this.$refs.listCards;
            if (!cards) return;

            const cardArray = Array.isArray(cards) ? cards : [cards];

            gsap.killTweensOf(cardArray);
            
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
        animateTabSub(group) {
            const tabSub = this.$el.querySelector(`.tab-group:nth-child(${Object.keys(this.tabs).indexOf(group) + 1}) .tab-sub`);
            if (!tabSub) return;

            gsap.fromTo(tabSub, 
                { opacity: 0.5, y: 8 }, 
                { opacity: 1, y: 0, duration: 0.2, }
            );
        },
    },
}
</script>

<style lang='scss' scoped>
    @import '@/assets/scss/layout/page.scss';
</style>
