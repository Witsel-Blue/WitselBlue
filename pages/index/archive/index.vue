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
            <ButtonScrollDown />
        </div>

        <div class="tab-wrap">
            <div class="inner">
                <div class="tab-main">
                    <button
                        v-for="tab in mainTabs"
                        :key="tab"
                        :class="{ active: activeMain === tab }"
                        @click="selectMain(tab)"
                    >
                        {{ tab }}
                    </button>
                </div>
                <div v-if="activeMain !== 'all'" class="tab-sub">
                    <button
                        v-for="tab in subTabs[activeMain]"
                        :key="tab"
                        :class="{ active: activeSub === tab }"
                        @click="activeSub = tab"
                    >
                        {{ tab }}
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
                    <SkewCardY :img="item.img" :path="item.path" />
                    <div class="desc">
                        <p class="work">{{ item.tags.work }}</p>
                        <Nuxt-link 
                            class="title mouse-hover1"
                            :to=item.path>
                            <TextShifting :text="item.name" :key="item.path"></TextShifting>
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

        <Footer />
    </div>
</template>

<script>
import archiveDevData from '@/assets/data/archive_dev.js';
import archiveMusicData from '@/assets/data/archive_music.js';
import CursorCustom from '@/components/CursorCustom.vue';
import Footer from '@/layouts/Footer.vue';
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
        Footer,
        PageTransition,
        TextShifting,
        ButtonScrollDown,
        StarBg,
    },
    data() {
        return {
            title: 'Archive',
            mainTabs: ['all', 'dev', 'music'],
            activeMain: 'all',
            subTabs: {
                dev: ['all', 'p5.js', 'pixi.js', 'three.js'],
                music: ['all', 'producing', 'dj'],
            },
            activeSub: 'all',
            archive: {
                dev: archiveDevData,
                music: archiveMusicData,
            }
        }
    },
    computed: {
  filteredLists() {
    let list = [];

    // mainTabs 분기
    if (this.activeMain === 'all') {
      list = [...this.archive.dev, ...this.archive.music];
    } else if (this.activeMain === 'dev') {
      list = [...this.archive.dev];
    } else if (this.activeMain === 'music') {
      list = [...this.archive.music];
    }

    // subTabs 필터
    if (this.activeSub !== 'all') {
      list = list.filter(item => (item.tags?.work || item.work) === this.activeSub);
    }

    // music 항목은 name이 없는 경우 artist를 name으로 매핑
    list = list.map(item => {
      if (!item.name && item.artist) {
        return { ...item, name: item.name || item.artist };
      }
      return item;
    });

    return list;
  }
    },
    watch: {
        selectMain(tab) {
            this.activeMain = tab;
            this.activeSub = 'all';
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
            var titleTop = title.offsetTop - winH*3/100;

            window.addEventListener('scroll', function() {
                var scrolled = window.scrollY;

                if ( titleTop < scrolled ) {
                    title.classList.add('active');
                } else {
                    var x = 1 - scrolled * 0.008;
                    var x2 = 1 - scrolled * 0.016;
                    title.style.transform = 'scale(' + x + ')';
                    button.style.opacity = x2;
                    title.classList.remove('active');
                }

            });
        },
        selectMain(tab) {
            this.activeMain = tab;
            this.activeSub = 'all';
        }
    },
}
</script>


<style lang="scss" scoped>
    @import '@/assets/scss/layout/page.scss';
</style>