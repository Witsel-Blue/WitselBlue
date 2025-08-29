<template>
    <div id="project_detail">
        <CursorCustom />
        <PageTransition :title="project.title" />
        <div class="contents">
            <section class="main">
                <div class="inner">
                    <div
                        class="mainvisual"
                        data-aos="fade-up"
                    >
                        <ParallaxImg :src="project.images.mainvisual" />
                    </div>
                    <div
                        class="title"
                        data-aos="fade-up"
                    >
                        <p>{{ project.tags.work }}</p>
                        <a
                            v-if="project.link"
                            class="mouse-hover1"
                            target="_blank"
                            :href="project.link.href"
                        >
                            <TextShifting :text="project.title" />
                        </a>
                    </div>
                </div>
            </section>
            <section
                class="device-bg"
                data-aos="fade-up"
                v-if="project.images.pc"
            >
                <div class="inner">
                    <div
                        class="device_pc"
                        data-aos="fade-up"
                    >
                        <img
                            src="@/assets/img/device-laptop.png"
                            class="device"
                        >
                        <div class="img-wrap">
                            <img
                                :src="project.images.pc"
                                class="img"
                            >
                        </div>
                    </div>
                </div>
            </section>
            <section
                class="device-bg"
                data-aos="fade-up"
                v-if="project.images.mb1"
            >
                <div class="inner">
                    <ul class="device_mb">
                        <li data-aos="fade-up">
                            <img
                                src="@/assets/img/device-iphone15.png"
                                class="device"
                            >
                            <img
                                :src="project.images.mb1"
                                class="img"
                            >
                        </li>
                        <li data-aos="fade-up">
                            <img
                                src="@/assets/img/device-iphone15.png"
                                class="device"
                            >
                            <img
                                :src="project.images.mb2"
                                class="img"
                            >
                        </li>
                        <li data-aos="fade-up">
                            <img
                                src="@/assets/img/device-iphone15.png"
                                class="device"
                            >
                            <img
                                :src="project.images.mb3"
                                class="img"
                            >
                        </li>
                    </ul>
                </div>
            </section>
            <section>
                <div class="inner">
                    <ul class="desc">
                        <li v-if="project.desc.agency || project.desc.client">
                            <dl data-aos="fade-up">
                                <dt>팀<span v-if="project.desc.client"> / 클라이언트</span></dt>
                                <dd>
                                    {{ project.desc.agency }}
                                    <span v-if="project.desc.client"> / {{ project.desc.client }}</span>
                                </dd>
                            </dl>
                        </li>
                        <li v-if="project.desc.duration">
                            <dl data-aos="fade-up">
                                <dt>작업기간</dt>
                                <dd>
                                    {{ project.desc.duration.start }}
                                    <span v-if="project.desc.duration.end"> - {{ project.desc.duration.end }}</span>
                                </dd>
                            </dl>
                        </li>
                        <li v-if="project.tags.platform || project.tags.env">
                            <dl data-aos="fade-up">
                                <dt>형식</dt>
                                <dd>{{ project.tags.platform }} {{ project.tags.env }}</dd>
                            </dl>
                        </li>
                    </ul>
                </div>
            </section>
            <section>
                <div class="inner">
                    <p
                        v-if="project.content.about"
                        data-aos="fade-up"
                        class="txt-c" 
                        v-html="project.content.about"
                    />
                    <ButtonRound
                        v-if="project.link && project.link.href"
                        data-aos="fade-up"
                        class="mt-32 txt-c"
                        :link="project.link"
                    />
                </div>
            </section>
        </div>
        <!-- <Pagination 
            :pagination="pagination"
        />
        <DetailFooter 
            :pagination="pagination"
        /> -->
    </div>
</template>

<script>
import projects from '@/assets/data/projects.js';
import CursorCustom from '@/components/CursorCustom.vue';
import PageTransition from '@/layouts/PageTransition.vue';
import ParallaxImg from '@/components/ParallaxImg.vue';
import ButtonRound from '@/components/ButtonRound.vue';
import TextShifting from '@/components/TextShifting.vue';
import Pagination from '@/components/Pagination.vue';
import DetailFooter from '@/layouts/DetailFooter.vue';
    
export default {
    components: {
        CursorCustom,
        PageTransition,
        ParallaxImg,
        ButtonRound,
        TextShifting,
        Pagination,
        DetailFooter,
    },
    async asyncData({ params }) {
        const project = projects.find(p => p.slug === params.slug);
        return { project };
    },
    mounted() {
        setTimeout(() => {
            this.getMbHeight();
        }, 1000);
        window.addEventListener('resize', this.getMbHeight);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.getMbHeight);
    },
    methods: {
        getMbHeight() {
            var mb = document.querySelector('.device_mb .device');
            var mbH = mb.clientHeight;
            var mbImg = document.querySelectorAll('.device_mb .img');
                
            for (var i = 0; i < mbImg.length; i++) {
                var c = mbImg[i];
                c.style.height = mbH + 'px';
            }
        },
    }
}
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/layout/page_detail.scss';
</style>