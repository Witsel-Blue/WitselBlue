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
                    mainvisual: require('@/assets/img/portfolio05_main.png'),
                    title: 'DCDCenter',
                    description: 
                        '무용예술인의 직업전환과 복지증진을 위해 다양한 지원사업을 신청할 수 있는 사이트',
                },
                desc: {
                    duration: '2023.01-2023.02',
                    consultant: '전문무용수지원센터',
                    team: 'SKNK',
                    work: 'frontend',
                    platform: 'drupal9/css/jquery',
                },
                link: {
                    href: 'https://www.dcdcenter.or.kr/',
                    text: 'Go to Page',
                },
                pagination: {
                    prevLink: '/portfolio/04_OxfamVirtualWalker',
                    prevText: '옥스팜 버추얼워커',
                    nextLink: '/portfolio/06_Cabinnet',
                    nextText: 'Cabinnet',
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/layout/portfolio_detail.scss';
</style>