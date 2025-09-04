<template>
    <div
        id="archive"
        class="page"
    >
        <CursorCustom />
        <PageTransition :title="title" />

        <div class="main">
            <h1 class="title ft-bagel">
                {{ title }}
            </h1>
            <StarBg />
        </div>

        <div class="tab-wrap">
            <div class="inner">
                <div class="tab-main">
                    <button
                        v-for="tab in mainTabs"
                        :key="tab"
                        class="mouse-hover2"
                        :class="{ active: activeMain === tab }"
                        @click="selectMain(tab)"
                    >
                        {{ tabLabels[tab] || tab }}
                    </button>
                </div>
                <div v-if="activeMain !== 'all'" class="tab-sub">
                    <button
                        v-for="tab in subTabs[activeMain]"
                        :key="tab"
                        class="mouse-hover2"
                        :class="{ active: activeSub === tab }"
                        @click="activeSub = tab"
                    >
                        {{ tabLabels[tab] || tab }}
                    </button>
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
                        <Nuxt-link 
                            class="title mouse-hover1"
                            :to="item.path">
                            <TextShifting :text="item.title" :key="item.slug" />
                        </Nuxt-link>
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
import archiveDevData from '@/assets/data/archive_dev.js';
import archiveMusicData from '@/assets/data/archive_music.js';
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
                dev: '개발',
                music: '음악',
                producing: '프로듀싱',
                dj: '믹스셋'
            },
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
        this.titleScroll();
    },
    methods: {
        selectMain(tab) {
            this.activeMain = tab;
            this.activeSub = 'all';
        },
        titleScroll() {
            var title = document.querySelector('.title');
            var button = document.querySelector('#button-scrolldown');
            var winH = window.innerWidth;
            var titleTop = title.offsetTop - winH*3/100;

            window.addEventListener('scroll', function() {
                var scrolled = window.scrollY;

                if ( titleTop < scrolled ) {
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
    },
}
</script>


<style lang="scss" scoped>
    @import '@/assets/scss/layout/page.scss';
</style>