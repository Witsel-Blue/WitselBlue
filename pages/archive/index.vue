<template>
    <div id='archive' class='page'>
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
                <div class='drop-lottie' v-if='showDrop'
                    :style='{top: `${dropPos.y}px`, left: `${dropPos.x}px`}'>
                    <Lottie :animationData='Drop' :loop='false' :autoplay='true' :key='dropKey' />
                </div>
                <div class='tab-main'>
                    <button
                        v-for='tab in mainTabs'
                        :key='tab'
                        class='mouse-hover2'
                        :class='{ active: activeMain === tab }'
                        @click='toggleMenu($event, tab)'
                    >
                        {{ tabLabels[tab] || tab }}
                    </button>
                </div>
                <div v-if='activeMain !== "all"' class='tab-sub'>
                    <button
                        v-for='tab in subTabs[activeMain]'
                        :key='tab'
                        class='mouse-hover2'
                        :class='{ active: activeSub === tab }'
                        @click='toggleSubmenu($event, tab)'
                    >
                        {{ tabLabels[tab] || tab }}
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
                        <p class='work'>{{ item.tags.work }}</p>
                        <Nuxt-link 
                            class='title mouse-hover1'
                            :to='item.path'>
                            <TextShifting :text='item.title' :key='item.slug || i' />
                        </Nuxt-link>
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
import archiveDevData from '@/assets/data/archive_dev.js';
import archiveMusicData from '@/assets/data/archive_music.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import CursorCustom from '@/components/CursorCustom.vue';
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
        CursorCustom,
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
            activeMain: 'dev',
            subTabs: {
                dev: ['all', 'p5.js', 'pixi.js', 'three.js'],
                music: ['all', 'producing', 'dj'],
            },
            activeSub: 'all',
            archive: {
                dev: archiveDevData,
                music: archiveMusicData,
            },
            tabLabels: {
                dev: 'Development',
                music: 'Music',
                producing: 'Producing',
                dj: 'Mixset'
            },
            Drop,
            showDrop: false,
            dropPos: { x: 0, y: 0 },
            dropKey: 0,
        }
    },
    computed: {
        filteredLists() {
            let list = []

            if (this.activeMain === 'dev') {
                list = [...this.archive.dev]
            } else if (this.activeMain === 'music') {
                list = [...this.archive.music]
            }

            if (this.activeSub !== 'all') {
                list = list.filter(
                    item => (item.tags?.work || item.work) === this.activeSub
                )
            }

            return list.map(item => ({
                ...item,
                title: item.title || item.name || item.artist,
                path: `/archive/${this.activeMain}/${item.slug}`,
            }));
        }
    },
    mounted() {
        this.$nextTick(() =>{
            const devBtn = this.$el.querySelector('.tab-main button');
            if (devBtn) {
                this.activeMain = 'dev';
                this.activeSub = 'all';
                this.triggerDropLottie({ currentTarget: devBtn });
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
        toggleMenu(event, tab) {
            this.triggerDropLottie(event);
            this.activeMain = tab;
            this.activeSub = 'all';
            this.$nextTick(() => this.animateListCards());
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