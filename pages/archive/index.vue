<template>
    <div id='archive' class='page'>

        <PageTransition :title="$t('archive.title')" v-if="$route.path === '/archive'" />

        <div class='main'>
            <h1 class='title ft-bagel'>
                {{ $t('archive.title') }}
            </h1>
            <StarBg />
        </div>

        <div class='tab-wrap'>
            <div class='inner'>
                <div class='drop-lottie' v-if='showDrop'
                    :style='{top: `${dropPos.y}px`, left: `${dropPos.x}px`}'>
                    <Lottie :animationData='Drop' :loop='false' :autoplay='true' :key='dropKey' />
                </div>
                <div class='tab-main'>
                    <button
                        v-for='tab in mainTabs'
                        :key='tab'
                        class='mouse-hover2'
                        :class='[tab, { active: activeMain === tab }]'
                        @click='toggleMenu($event, tab)'
                    >
                        {{ $t(`archive_${tab}.title`) }}
                    </button>
                </div>
                <div v-if='activeMain !== "all"' class='tab-sub'>
                    <button
                        v-for='tab in subTabs'
                        :key='tab.key'
                        class='mouse-hover2'
                        :class='{ active: activeSub === tab.key }'
                        @click='toggleSubmenu($event, tab.key)'
                    >
                        {{ tab.label }}
                    </button>
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
                        <p class='work'>
                            {{ (typeof item.tags.work === 'object' ? item.tags.work[$i18n.locale] || item.tags.work.en : item.tags.work) }}
                        </p>
                        <Nuxt-link 
                            class='title mouse-hover1'
                            :to='item.path'>
                            <TextShifting :text='item.title[$i18n.locale]' :key='item.slug || i' />
                        </Nuxt-link>
                        <div class='tags'>
                            <p v-for='(value, key) in item.tags' :key='key' v-if='key !== "work"'>
                                #{{ typeof value === 'object' ? value[$i18n.locale] || value.en : value }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import archiveDevData from '@/assets/data/archive_dev.js';
import archiveMusicData from '@/assets/data/archive_music.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import PageTransition from '@/layouts/PageTransition.vue';
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
            title: 'archive',
            mainTabs: ['dev', 'music'],
            activeMain: '',
            activeSub: 'all',
            archive: {
                dev: archiveDevData,
                music: archiveMusicData,
            },
            Drop,
            showDrop: false,
            dropPos: { x: 0, y: 0 },
            dropKey: 0,
        }
    },
    computed: {
        subTabs() {
            if (!this.activeMain) return [];
            const tabs = this.$i18n.getLocaleMessage(this.$i18n.locale)[`archive_${this.activeMain}`]?.tabs;
            if (!tabs) return [];
            return Object.entries(tabs).map(([key, value]) => ({
                key,
                label: value
            }));
        },
        filteredLists() {
            let list = [];
            if (this.activeMain === 'dev') list = [...this.archive.dev];
            else if (this.activeMain === 'music') list = [...this.archive.music];

            if (this.activeSub !== 'all') {
                list = list.filter(item => {
                    const workValue = typeof item.tags.work === 'object'
                        ? item.tags.work.key || item.tags.work.en
                        : item.tags.work;
                    return workValue === this.activeSub;
                });
            }

            return list.map(item => ({
                ...item,
                title: item.title || item.name || item.artist,
                path: `/archive/${this.activeMain}/${item.slug}`,
            }));
        }
    },
    mounted() {
        const currentPath = this.$route.path;

        this.activeMain = 'dev';
        this.activeSub = 'all';

        if (currentPath.includes('/archive/music')) {
            this.activeMain = 'music';
        }

        this.$nextTick(() => {
            if (this.activeMain) {
                const mainBtn = this.$el.querySelector(`.tab-main button.${this.activeMain}`);
                if (mainBtn) this.triggerDropLottie({ currentTarget: mainBtn });
            }

            setTimeout(() => {
                if (this.activeSub) {
                    const subBtn = this.$el.querySelector(`.tab-sub button.${this.activeSub}`);
                    if (subBtn) this.triggerDropLottie({ currentTarget: subBtn });
                }
            }, 0);
        });

        this.animateListCards();
    },
    methods: {
        triggerDropLottie(event) {
            const parentRect = event.currentTarget.offsetParent.getBoundingClientRect();
            const btnRect = event.currentTarget.getBoundingClientRect();

            this.dropPos = {
                x: btnRect.left - parentRect.left + btnRect.width / 2 - 16,
                y: btnRect.top - parentRect.top - 16,
            };

            this.dropKey ++;
            this.showDrop = true;
        },
        toggleMenu(event, tab) {
            this.triggerDropLottie(event);
            if (tab === 'dev') this.$router.push('/archive/dev'); 
            else if (tab === 'music') this.$router.push('/archive/music'); 
        },
        toggleSubmenu(event, tab) {
            this.triggerDropLottie(event);
            this.activeSub = tab;
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
    },
}
</script>


<style lang='scss' scoped>
    @import '@/assets/scss/layout/page.scss';
</style>