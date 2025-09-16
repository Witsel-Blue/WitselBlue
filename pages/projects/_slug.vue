<template>
    <div id='project_detail'>
        <CursorCustom />
        <!-- <PageTransition :title='project.title' /> -->
        <div class='contents'>

            <section class='main'>
                <div class='mainvisual' data-aos='fade-up'>
                    <ParallaxImg :src='project.images.mainvisual' />
                </div>
                <div class='title' data-aos='fade-up'>
                    <p>{{ project.tags.work }}</p>
                    <a
                        v-if='project.link'
                        class='mouse-hover1'
                        target='_blank'
                        :href='project.link.href'
                        @mouseenter='showCursorImage(true)'
                        @mouseleave='showCursorImage(false)'
                    >
                        <TextShifting :text='project.title' />
                    </a>
                </div>
                <div class='desc' v-if='project.desc'>
                    <div class='inner'>
                         <ul>
                            <li v-if='project.desc.agency || project.desc.client'>
                                <dl data-aos='fade-up'>
                                    <dt>Team<span v-if='project.desc.client'> / Client</span></dt>
                                    <dd>
                                        {{ project.desc.agency }}
                                        <span v-if='project.desc.client'> / {{ project.desc.client }}</span>
                                    </dd>
                                </dl>
                            </li>
                            <li v-if='project.desc.duration'>
                                <dl data-aos='fade-up'>
                                    <dt>Work Period</dt>
                                    <dd>
                                        {{ project.desc.duration.start }}
                                        <span v-if='project.desc.duration.end'> - {{ project.desc.duration.end }}</span>
                                    </dd>
                                </dl>
                            </li>
                            <li v-if='project.desc.stack'>
                                <dl data-aos='fade-up'>
                                    <dt>Main Stack</dt>
                                    <dd>{{ project.desc.stack }}</dd>
                                </dl>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <section class='about'>
                <div class='inner'>
                    <p
                        v-if='project.content.about'
                        data-aos='fade-up'
                        class='txt-c' 
                        v-html='project.content.about'
                    ></p>
                    <ButtonRound
                        v-if='project.link && project.link.href'
                        data-aos='fade-up'
                        class='txt-c'
                        :link='project.link'
                    />
                </div>
            </section>

            <section class='device-bg' data-aos='fade-up' v-if='project.images.gif'>
                <div class='inner'>
                    <div class='device_pc'data-aos='fade-up'>
                        <img src='@/assets/img/device-laptop.png' class='device'>
                        <div class='img-wrap'>
                            <img :src='project.images.gif' class='img'>
                        </div>
                    </div>
                </div>
            </section>

            <section class='img-pc' v-if='project.images.pc1'>
                <div class='inner'>
                    <img :src='project.images.pc1' data-aos='fade-up'>
                    <img v-if='project.images.pc2' :src='project.images.pc2' data-aos='fade-up'>
                    <img v-if='project.images.pc3' :src='project.images.pc3' data-aos='fade-up'>
                </div>
            </section>

            <section class='device-bg' data-aos='fade-up' v-if='project.images.mb1'>
                <div class='inner'>
                    <ul class='device_mb'>
                        <li data-aos='fade-up'>
                            <img src='@/assets/img/device-iphone15.png' class='device'>
                            <img :src='project.images.mb1' class='img'>
                        </li>
                        <li data-aos='fade-up'>
                            <img src='@/assets/img/device-iphone15.png' class='device'>
                            <img :src='project.images.mb2' class='img'>
                        </li>
                        <li data-aos='fade-up'>
                            <img src='@/assets/img/device-iphone15.png' class='device'>
                            <img :src='project.images.mb3' class='img'>
                        </li>
                    </ul>
                </div>
            </section>

            <section class='detail' v-if='project.content.detail' >
                <div class='inner'>
                    <p 
                        v-for='(item, index) in project.content.detail' :key='index'
                        v-html='item'
                        data-aos='fade-up'
                    >
                    </p>
                </div>
            </section>
            
        </div>
        <!-- <Pagination 
            :pagination='pagination'
        /> -->
    </div>
</template>

<script>
import projectsData from '@/assets/data/projects.js';
import CursorCustom from '@/components/CursorCustom.vue';
import PageTransition from '@/layouts/PageTransition.vue';
import ParallaxImg from '@/components/ParallaxImg.vue';
import ButtonRound from '@/components/ButtonRound.vue';
import TextShifting from '@/components/TextShifting.vue';
import Pagination from '@/components/Pagination.vue';
    
export default {
    components: {
        CursorCustom,
        PageTransition,
        ParallaxImg,
        ButtonRound,
        TextShifting,
        Pagination,
    },
    data() {
        return {
            project: null,
            cursorText: '',
        }
    },
    async asyncData({ params, store }) {
        const project = projectsData.find(p => p.slug === params.slug);
        return { project };
    },
    beforeRouteEnter(to, from, next) {
        const project = projectsData.find(p => p.slug === to.params.slug);
        const index = projectsData.findIndex(p => p.slug === to.params.slug);
        const nextProject = { ...projectsData[(index + 1) % projectsData.length], category: 'projects' };

        next(vm => {
            vm.project = project;

            // 상태를 nextTick으로 적용
            vm.$nextTick(() => {
            vm.$store.commit('setDetailPage', true);
            vm.$store.commit('setNextProject', nextProject);
            });
        });
    },
    beforeRouteUpdate(to, from, next) {
        const project = projectsData.find(p => p.slug === to.params.slug);
        const index = projectsData.findIndex(p => p.slug === to.params.slug);
        const nextProject = { ...projectsData[(index + 1) % projectsData.length], category: 'projects' };

        this.project = project;

        this.$nextTick(() => {
            this.$store.commit('setDetailPage', true);
            this.$store.commit('setNextProject', nextProject);
        });

        next();
    },
    beforeDestroy() {
        this.$store.commit('setDetailPage', false);
        this.$store.commit('clearNextProject');
    },
    mounted() {
        setTimeout(() => {
            this.getMbHeight();
        }, 1000);
        window.addEventListener('resize', this.getMbHeight);
    },
    methods: {
        showCursorImage(show) {
            window.dispatchEvent(new CustomEvent('cursor-show-image', { detail: { show } }));
        },
        getMbHeight() {
            var mb = document.querySelector('.device_mb .device');
            if (!mb) return;
            var mbH = mb.clientHeight;
            var mbImg = document.querySelectorAll('.device_mb .img');
                
            mbImg.forEach(img => {
                img.style.height = mbH + 'px';
            });
        },
    }
}
</script>

<style lang='scss' scoped>
    @import '@/assets/scss/layout/page_detail.scss';
</style>