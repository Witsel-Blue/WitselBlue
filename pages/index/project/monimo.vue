<template>
    <div id="project_detail">
        <CursorCustom />
        <PageTransition :title="title" />
        <div class="contents">
            <section class="main">
                <div class="inner">
                    <div
                        class="mainvisual"
                        data-aos="fade-up"
                    >
                        <ParallaxImg :src="main.mainvisual" />
                    </div>
                    <div
                        class="title"
                        data-aos="fade-up"
                    >
                        <p>{{ desc.work }}</p>
                        <a
                            class="mouse-hover1"
                            target="_blank"
                            :href="link.href"
                        >
                            <TextShifting :text="main.title" />
                        </a>
                    </div>
                </div>
            </section>
            <section
                class="device-bg"
                data-aos="fade-up"
            >
                <div class="inner">
                    <ul class="device_mb">
                        <li data-aos="fade-up">
                            <img
                                src="@/assets/img/device-iphone15.png"
                                class="device"
                            >
                            <img
                                src="@/assets/img/project01_mb01.png"
                                class="img"
                            >
                        </li>
                        <li data-aos="fade-up">
                            <img
                                src="@/assets/img/device-iphone15.png"
                                class="device"
                            >
                            <img
                                src="@/assets/img/project01_mb02.png"
                                class="img"
                            >
                        </li>
                        <li data-aos="fade-up">
                            <img
                                src="@/assets/img/device-iphone15.png"
                                class="device"
                            >
                            <img
                                src="@/assets/img/project01_mb03.png"
                                class="img"
                            >
                        </li>
                    </ul>
                </div>
            </section>
            <section>
                <div class="inner">
                    <ul class="desc">
                        <li v-if="desc.team">
                            <dl data-aos="fade-up">
                                <dt>팀 / 발주처</dt>
                                <dd>{{ desc.team }} / {{ desc.consultant }}</dd>
                            </dl>
                        </li>
                        <li v-if="desc.duration">
                            <dl data-aos="fade-up">
                                <dt>작업기간</dt>
                                <dd>{{ desc.duration }}</dd>
                            </dl>
                        </li>
                        <li v-if="desc.platform">
                            <dl data-aos="fade-up">
                                <dt>형식</dt>
                                <dd>{{ desc.platform }}</dd>
                            </dl>
                        </li>
                    </ul>
                </div>
            </section>
            <section>
                <div class="inner">
                    <p
                        v-if="main.description"
                        data-aos="fade-up"
                        class="txt-c" 
                        v-html="main.description"
                    />
                    <ButtonRound
                        v-if="link.href"
                        data-aos="fade-up"
                        class="mt-32 txt-c"
                        :link="link"
                    />
                </div>
            </section>
        </div>
        <Pagination 
            :pagination="pagination"
        />
        <DetailFooter 
            :pagination="pagination"
        />
    </div>
</template>

<script>
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
    data() {
        return {
            title: 'Monimo',
            main: {
                mainvisual: require('@/assets/img/project01_main.png'),
                id: '01',
                title: 'Monimo',
                description: 
                        '삼성생명, 삼성화재, 삼성카드,<br class="mb"> 삼성증권에서 만든 금융 서비스 앱<br> 여러 팀과 협력하여<br class="mb"> 보안 시스템 아래에서 개발<br> 컴포넌트와 1400여개 페이지 관리,<br class="mb"> 카드 메인 페이지 담당',
            },
            desc: {
                duration: '2024.07-2024.10',
                consultant: 'Samsung',
                team: 'lisn',
                work: 'development',
                platform: 'vue2 / storybook / scss',
            },
            link: {
                href: 'https://www.monimo.com/w/main/WPFMHP0101M0',
                text: 'Visit Site',
                target: '_blank',
            },
            pagination: {
                href: '/project',
                text: 'view all project',
                prevLink: '/project/RNJOB',
                prevText: 'RNJOB App',
                nextLink: '/project/OnlineMemorial',
                nextText: '4·16 Online Memorial',
                nextWork: 'publishing',
                nextImg: require('@/assets/img/project02_main.png'),
            },
        }
    },
    mounted() {
        setTimeout(() => {
            this.getMbHeight();
        }, '1000');
        window.addEventListener('resize', this.getMbHeight);
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