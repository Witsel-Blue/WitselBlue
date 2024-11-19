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
                title: 'Oxfam Virtaulwalker',
                main: {
                    mainvisual: require('@/assets/img/project04_main.png'),
                    id: '04',
                    title: 'Oxfam Virtaulwalker',
                    description: 
                        '옥스팜코리아에서 주최한 걷기 기부 소개 및 참가신청 사이트<br> 스크롤에 따라 SVG 라인이 그려지는 애니메이션 구현',
                },
                desc: {
                    duration: '2021.08-2021.09',
                    consultant: '옥스팜코리아',
                    team: 'SKNK',
                    work: 'frontend',
                    platform: 'drupal9/css/jquery',
                },
                link: {
                    href: 'https://v50.oxfamtrailwalker.or.kr/',
                    text: 'Go to Page',
                },
                pagination: {
                    prevLink: '/project/DCAMP',
                    prevText: 'D.CAMP',
                    nextLink: '/project/DCDCenter',
                    nextText: '전문무용수지원센터',
                    nextImg: require('@/assets/img/project05_main.png'),
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/layout/project_detail.scss';
</style>