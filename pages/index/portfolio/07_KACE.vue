<template>
    <div id="portfolio_detail">
        <PageTransition :title="title"></PageTransition>
        <div class="contents">
            <section class="main">
                <div class="mainvisual">
                    <img :src="main.mainvisual">
                </div>
                <div class="title">
                    <p>{{ main.id }}</p>
                    <h3>{{ main.title }}</h3>
                </div>
            </section>
            <section>
                <ul class="desc">
                    <li v-if="desc.duration">
                        <dl>
                            <dt>작업기간</dt>
                            <dd>{{ desc.duration }}</dd>
                        </dl>
                    </li>
                    <li v-if="desc.team">
                        <dl>
                            <dt>팀</dt>
                            <dd>{{ desc.team }}</dd>
                        </dl>
                    </li>
                    <li v-if="desc.consultant">
                        <dl>
                            <dt>발주처</dt>
                            <dd>{{ desc.consultant }}</dd>
                        </dl>
                    </li>
                    <li v-if="desc.work">
                        <dl>
                            <dt>수행범위</dt>
                            <dd>{{ desc.work }}</dd>
                        </dl>
                    </li>
                    <li v-if="desc.platform">
                        <dl>
                            <dt>형식</dt>
                            <dd>{{ desc.platform }}</dd>
                        </dl>
                    </li>
                </ul>
            </section>
            <section>
                <div class="device_pc">
                    <img src="@/assets/img/device-laptop.png" class="device">
                </div>
            </section>
            <section>
                <p 
                    v-html="main.description" 
                    v-if="main.description">
                </p>
                <ButtonRound
                    v-if="link.href"
                    :link="link"
                />
            </section>
        </div>
        <Pagination 
            :pagination="pagination" />
    </div>
</template>

<script>
    import PageTransition from '@/components/PageTransition.vue';
    import ButtonRound from '@/components/ButtonRound.vue';
    import Pagination from '@/components/Pagination.vue';
    
    export default {
        components: {
            PageTransition,
            ButtonRound,
            Pagination,
        },
        data() {
            return {
                title: 'KACE',
                main: {
                    // mainvisual: require('@/assets/img/portfolio07_main.png'),
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
                    prevLink: '/portfolio/06_Cabinnet',
                    prevText: 'Cabinnet',
                    nextLink: '/portfolio/08_RNJOB',
                    nextText: 'RNJOB 앱',
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/layout/portfolio_detail.scss';
</style>