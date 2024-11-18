<template>
    <div id="project_detail">
        <PageTransition :title="title"></PageTransition>
        <div class="contents">
            <section class="main inner-small">
                <div class="title" data-aos="fade-up">
                    <p>{{ desc.work }}</p>
                    <h3>{{ main.title }}</h3>
                </div>
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
            </section>
            <section>
                <div class="mainvisual" data-aos="fade-up">
                     <ParallaxImg :src="main.mainvisual"></ParallaxImg>
                </div>
            </section>
            <section>
                <p
                    class="txt-c"
                    data-aos="fade-up"
                    v-html="main.description" 
                    v-if="main.description">
                </p>
                <ButtonRound
                    class="mt-32 txt-c"
                    data-aos="fade-up"
                    v-if="link.href"
                    :link="link"
                />
            </section>
            <section class="inner-small">
                <div class="device_pc" data-aos="fade-up">
                    <img src="@/assets/img/device-laptop.png" class="device">
                    <div class="img-wrap">
                        <img :src="main.mainvisual" class="img">
                    </div>
                </div>
            </section>
        </div>
        <Pagination 
            :pagination="pagination" />
        <div class="contents-next">
            <a :href="pagination.nextLink">
                <div class="inner-small" data-aos="fade-up">
                    <TextShifting :text="'next'"></TextShifting>
                </div>
                <div data-aos="fade-up">
                    <img :src="pagination.nextImg" v-if="pagination.nextImg">
                    <span class="fake-img" v-else></span>
                </div>
            </a>
        </div>
    </div>
</template>

<script>
    import PageTransition from '@/components/PageTransition.vue';
    import ParallaxImg from '@/components/ParallaxImg.vue';
    import ButtonRound from '@/components/ButtonRound.vue';
    import TextShifting from '@/components/TextShifting.vue';
    import Pagination from '@/components/Pagination.vue';
    
    export default {
        components: {
            PageTransition,
            ParallaxImg,
            ButtonRound,
            TextShifting,
            Pagination,
        },
        data() {
            return {
                title: 'KACE',
                main: {
                    // mainvisual: require('@/assets/img/project07_main.png'),
                    id: '07',
                    title: 'KACE',
                    link: 'http://www.kace.or.kr/',
                    description: 
                        '지역사회교육에 관한 조사연구 전문가 양성과<br> 다양한 교육공동체 프로그램을 신청할 수 있는 서비스 제공<br> (사이트 리뉴얼을 위해 작업했으나 해당 링크에선 보실 수 없습니다)',
                },
                desc: {
                    duration: '2022.10-2021.12',
                    consultant: '한국지역사회교육협의회',
                    team: 'SKNK',
                    work: 'frontend',
                    platform: 'drupal9/css/jquery',
                },
                link: {
                    href: 'http://www.kace.or.kr/',
                    text: 'Go to Page',
                },
                pagination: {
                    prevLink: '/project/06_Cabinnet',
                    prevText: 'Cabinnet',
                    nextLink: '/project/08_RNJOB',
                    nextText: 'RNJOB 앱',
                    nextImg: require('@/assets/img/project08_main.png'),
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/layout/project_detail.scss';
</style>