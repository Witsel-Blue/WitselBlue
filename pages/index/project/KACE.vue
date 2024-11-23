<template>
    <div id="project_detail">
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
    import PageTransition from '@/layouts/PageTransition.vue';
    import ParallaxImg from '@/components/ParallaxImg.vue';
    import ButtonRound from '@/components/ButtonRound.vue';
    import TextShifting from '@/components/TextShifting.vue';
    import Pagination from '@/components/Pagination.vue';
    import DetailFooter from '@/layouts/DetailFooter.vue';
    
    export default {
        components: {
            PageTransition,
            ParallaxImg,
            ButtonRound,
            TextShifting,
            Pagination,
            DetailFooter,
        },
        data() {
            return {
                title: 'KACE',
                main: {
                    mainvisual: require('@/assets/img/project07_main.png'),
                    id: '07',
                    title: 'KACE',
                    link: 'http://www.kace.or.kr/',
                    description: 
                        '지역사회교육에 관한 조사연구 전문가 양성과<br> 다양한 교육공동체 프로그램을<br class="mb"> 신청할 수 있는 서비스 제공<br> (사이트 리뉴얼을 위해 작업했으나<br class="mb"> 해당 링크에선 보실 수 없습니다)',
                },
                img: {
                    pc: require('@/assets/img/project07_pc.png'),
                    // mb: require('@/assets/img/project05_mb.png'),
                },
                desc: {
                    duration: '2021.09-2021.10',
                    consultant: '한국지역사회교육협의회',
                    team: 'SKNK',
                    work: 'frontend',
                    platform: 'drupal9 / css / jquery',
                },
                link: {
                    href: 'http://www.kace.or.kr/',
                    text: 'Visit Site',
                },
                pagination: {
                    prevLink: '/project/cabinnet',
                    prevText: 'Cabinnet',
                    nextLink: '/project/RNJOB',
                    nextText: 'RNJOB App',
                    nextWork: 'publishing',
                    nextImg: require('@/assets/img/project08_main.png'),
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/layout/page_detail.scss';
</style>