<template>
    <div id="portfolio_detail">
        <section class="main">
            <div class="mainvisual">
                <img 
                    :src="main.mainvisual"
                    v-if="main.mainvisual">
            </div>
            <h3>{{ main.title }}</h3>
            <p 
                v-html="main.description" 
                v-if="main.description">
            </p>
            <ButtonRound
                v-if="link.href"
                :link="link"
            />
        </section>
        <section>
            <ul>
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
            <Pagination 
            :pagination="pagination" />
        </section>
    </div>
</template>

<script>
    import ButtonRound from '@/components/ButtonRound.vue';
    import Pagination from '@/components/Pagination.vue';
    
    export default {
        components: {
            ButtonRound,
            Pagination,
        },
        data() {
            return {
                main: {
                    mainvisual: require('@/assets/img/portfolio04_main.png'),
                    title: 'Oxfam Virtaulwalker',
                    description: 
                        '옥스팜코리아에서 주최한 걷기 기부 소개 및 참가신청 사이트<br> 스크롤에 따라 SVG 라인이 그려지는 애니메이션 구현',
                },
                desc: {
                    duration: '2022.08-2022.09',
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
                    prevLink: '/portfolio/03_DCAMP',
                    prevText: 'D.CAMP',
                    nextLink: '/portfolio/05_DCDCenter',
                    nextText: '전문무용수지원센터',
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/layout/portfolio_detail.scss';
</style>