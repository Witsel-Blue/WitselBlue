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
                            target="_blank"
                            :href=link.href>
                            <TextShifting :text="main.title"></TextShifting>
                        </a>
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
            <section class="device-bg">
                <div class="inner">
                    <div class="device_pc" data-aos="fade-up">
                        <img src="@/assets/img/device-laptop.png" class="device">
                        <div class="img-wrap">
                            <img :src="main.mainvisual" class="img">
                        </div>
                    </div>
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
        <DetailFooter />
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
                title: '4·16 Online Memorial',
                main: {
                    mainvisual: require('@/assets/img/project02_main.png'),
                    id: '02',
                    title: '4·16 온라인 기억센터',
                    description: 
                        '세월호참사 10주기를 기념하여 메세지를 남길 수 있는 공간<br> Scrollmagic, Tweenmax 등의 라이브러리를 이용하여 메인비주얼 구현',
                },
                desc: {
                    duration: '2022.04',
                    consultant: '4·16 재단',
                    team: 'SKNK',
                    work: 'publishing',
                    platform: 'html/css/jquery',
                },
                img: {
                    pc: require('@/assets/img/project02_pc.png'),
                    mb: require('@/assets/img/project02_mb.png'),
                },
                link: {
                    href: 'https://416foundation.org/%EC%98%A8%EB%9D%BC%EC%9D%B8-%EA%B8%B0%EC%96%B5-%EA%B3%B5%EA%B0%84/',
                    text: 'Go to Page',
                },
                pagination: {
                    prevLink: '/project/monimo',
                    prevText: '삼성카드 모니모 앱',
                    nextLink: '/project/DCAMP',
                    nextText: 'D.CAMP',
                    nextImg: require('@/assets/img/project03_main.png'),
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/layout/project_detail.scss';
</style>