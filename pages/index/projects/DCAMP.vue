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
                                :src="img.pc"
                                class="img"
                            >
                        </div>
                    </div>
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
            <section class="img-pc">
                <div class="inner">
                    <img
                        :src="img.img1"
                        data-aos="fade-up"
                    >
                    <img
                        :src="img.img2"
                        data-aos="fade-up"
                    >
                </div>
            </section>
            <section
                class="img-mb device-bg"
                data-aos="fade-up"
            >
                <div class="inner">
                    <img
                        :src="img.mb1"
                        data-aos="fade-up"
                    >
                    <img
                        :src="img.mb2"
                        data-aos="fade-up"
                    >
                    <img
                        :src="img.mb3"
                        data-aos="fade-up"
                    >
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
            title: 'DCAMP',
            main: {
                mainvisual: require('@/assets/img/project03_main.png'),
                id: '03',
                title: 'DCAMP',
                link: 'https://dcamp.kr/',
                description: 
                        '은행권청년창업재단 디캠프 사이트 리뉴얼<br> 사이트 전체 프론트엔드 담당',
            },
            img: {
                pc: require('@/assets/img/project03_pc.png'),
                img1: require('@/assets/img/project03_img1.png'),
                img2: require('@/assets/img/project03_img2.png'),
                mb1: require('@/assets/img/project03_mb01.png'),
                mb2: require('@/assets/img/project03_mb02.png'),
                mb3: require('@/assets/img/project03_mb03.png'),
            },
            desc: {
                duration: '2022.01-2022.03',
                consultant: 'DCAMP',
                team: 'SKNK',
                work: 'frontend',
                platform: 'drupal9 / css / jquery',
            },
            link: {
                href: 'https://dcamp.kr/',        
                text: 'Visit Site',
                target: '_blank',
            },
            pagination: {
                href: '/projects',
                text: 'view all projects',
                prevLink: '/projects/OnlineMemorial',
                prevText: '4·16 Online Memorial',
                nextLink: '/projects/OxfamVirtualWalker',
                nextText: 'Oxfam VirtualWalker',
                nextWork: 'frontend',
                nextImg: require('@/assets/img/project04_main.png'),
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/layout/page_detail.scss';
</style>