<template>
    <div id="project_detail">
        <CursorCustom />
        <PageTransition :title="title"></PageTransition>
        <div class="contents">
            <section class="main">
                <div class="inner">
                    <div class="mainvisual" data-aos="fade-up">
                        <ParallaxImg :src="main.mainvisual"></ParallaxImg>
                    </div>
                    <div class="title" data-aos="fade-up">
                        <p>{{ desc.work }}</p>
                        <a
                            class="mouse-hover1"
                            target="_blank"
                            :href=link.href>
                            <TextShifting :text="main.title"></TextShifting>
                        </a>
                    </div>
                </div>
            </section>
            <section class="device-bg" data-aos="fade-up">
                <div class="inner">
                    <div class="device_pc" data-aos="fade-up">
                        <img src="@/assets/img/device-laptop.png" class="device">
                        <div class="img-wrap">
                            <img :src="img.pc" class="img">
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
                    <img :src="img.img1" data-aos="fade-up">
                    <img :src="img.img2" data-aos="fade-up">
                </div>
            </section>
            <section class="img-mb device-bg" data-aos="fade-up">
                <div class="inner">
                    <img :src="img.mb1" data-aos="fade-up">
                    <img :src="img.mb2" data-aos="fade-up">
                    <img :src="img.mb3" data-aos="fade-up">
                </div>
            </section>
            <section>
                <div class="inner">
                    <p
                        data-aos="fade-up"
                        class="txt-c"
                        v-html="main.description" 
                        v-if="main.description">
                    </p>
                    <ButtonRound
                        data-aos="fade-up"
                        class="mt-32 txt-c"
                        v-if="link.href"
                        :link="link"
                    />
                </div>
            </section>
        </div>
        <Pagination 
            :pagination="pagination" />
        <DetailFooter 
            :pagination="pagination" />
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
                title: 'Oxfam Virtaulwalker',
                main: {
                    mainvisual: require('@/assets/img/project04_main.png'),
                    id: '04',
                    title: 'Oxfam Virtaulwalker',
                    description: 
                        '옥스팜코리아에서 주최한 걷기 기부<br class="mb"> 소개 및 참가신청 사이트<br> 스크롤에 따라 SVG 라인이 그려지는<br class="mb"> 애니메이션 구현',
                },
                img: {
                    pc: require('@/assets/img/project04_pc.png'),
                    img1: require('@/assets/img/project04_img1.png'),
                    img2: require('@/assets/img/project04_img2.png'),
                    mb1: require('@/assets/img/project04_mb01.png'),
                    mb2: require('@/assets/img/project04_mb02.png'),
                    mb3: require('@/assets/img/project04_mb03.png'),
                },
                desc: {
                    duration: '2021.08-2021.09',
                    consultant: '옥스팜코리아',
                    team: 'SKNK',
                    work: 'frontend',
                    platform: 'drupal9 / css / jquery',
                },
                link: {
                    href: 'https://v50.oxfamtrailwalker.or.kr/',
                    text: 'Visit Site',
                    target: '_blank',
                },
                pagination: {
                    href: '/project',
                    text: 'view all project',
                    prevLink: '/project/DCAMP',
                    prevText: 'DCAMP',
                    nextLink: '/project/DCDCenter',
                    nextText: 'DCDCenter',
                    nextWork: 'frontend',
                    nextImg: require('@/assets/img/project05_main.png'),
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/layout/page_detail.scss';

    .contents .main .title {
        max-width: 40%;
    }

    // mobile
    @media all and (max-width: $mobile) {
        .contents .main .title {
            max-width: 100%;
        }
    }
</style>