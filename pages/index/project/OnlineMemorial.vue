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
                title: '4·16 Online Memorial',
                main: {
                    mainvisual: require('@/assets/img/project02_main.png'),
                    id: '02',
                    title: '4·16 Online Memorial',
                    description: 
                        '세월호참사 10주기를 기념하여<br class="mb"> 메세지를 남길 수 있는 공간<br> Scrollmagic, Tweenmax 등의<br class="mb"> 라이브러리를 이용하여 메인비주얼 구현',
                },
                img: {
                    pc: require('@/assets/img/project02_pc.png'),
                    img1: require('@/assets/img/project02_img1.png'),
                    img2: require('@/assets/img/project02_img2.png'),
                    mb1: require('@/assets/img/project02_mb01.png'),
                    mb2: require('@/assets/img/project02_mb02.png'),
                    mb3: require('@/assets/img/project02_mb03.png'),
                },
                desc: {
                    duration: '2022.04',
                    consultant: '4·16 재단',
                    team: 'SKNK',
                    work: 'publishing',
                    platform: 'html / css / jquery',
                },
                link: {
                    href: 'https://416foundation.org/%EC%98%A8%EB%9D%BC%EC%9D%B8-%EA%B8%B0%EC%96%B5-%EA%B3%B5%EA%B0%84/',
                    text: 'Visit Site',
                    target: '_blank',
                },
                pagination: {
                    href: '/project',
                    text: 'view all project',
                    prevLink: '/project/monimo',
                    prevText: 'Monimo',
                    nextLink: '/project/DCAMP',
                    nextText: 'DCAMP',
                    nextWork: 'frontend',
                    nextImg: require('@/assets/img/project03_main.png'),
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/layout/page_detail.scss';
</style>