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

        <!-- 탭 메뉴 -->
        <div class="tab-menu">
            <button
                v-for="tab in mainTabs"
                :key="tab"
                :class="{ active: activeMain === tab }"
                @click="activeMain = tab"
            >
                {{ tab }}
            </button>
        </div>

        <div v-if="activeMain !== 'all'" class="sub-tab-menu">
            <button
                v-for="tab in subTabs[activeMain]"
                :key="tab"
                :class="{ active: activeSub === tab }"
                @click="activeSub = tab"
            >
                {{ tab }}
            </button>
        </div>

        <div class="list-wrap">
            <div
                v-for="(item, i) in filteredLists"
                :key="i"
                class="list-card"
            >
                <img v-if="item.img" :src="item.img" :alt="item.name || item.title" />

                <h3>{{ item.name || item.title }}</h3>
                <p v-if="item.artist">{{ item.artist }}</p>
                <p>{{ item.work }}</p>

                <a v-if="item.link" :href="item.link" target="_blank">Visit</a>
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
      if (this.activeMain === 'all') {
            return [...this.archive.dev, ...this.archive.music]
        }
        let list = this.archive[this.activeMain] || []
        if (this.activeSub === 'all') {
            return list
        }
        return list.filter(item => item.work === this.activeSub)
        }
    },
    watch: {
        activeMain() {
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
</style>