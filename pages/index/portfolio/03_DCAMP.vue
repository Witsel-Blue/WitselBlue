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
                    mainvisual: require('@/assets/img/portfolio03_main.png'),
                    title: 'DCAMP',
                    link: 'https://dcamp.kr/',
                    description: 
                        '은행권청년창업재단 디캠프 사이트 리뉴얼<br> 사이트 전체 프론트엔드 담당',
                },
                desc: {
                    duration: '2022.01-2022.03',
                    consultant: 'DCAMP',
                    team: 'SKNK',
                    work: 'frontend',
                    platform: 'drupal9/css/jquery',
                },
                link: {
                    href: 'https://dcamp.kr/',        
                    text: 'Go to Page',
                },
                pagination: {
                    prevLink: '/portfolio/02_416_Online_Memorial',
                    prevText: '4·16 온라인 기억센터',
                    nextLink: '/portfolio/04_OxfamVirtualWalker',
                    nextText: '옥스팜 버추얼워커',
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/layout/portfolio_detail.scss';
</style>