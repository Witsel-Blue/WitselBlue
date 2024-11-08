<template>
    <div id="portfolio_detail">
        <section class="main">
            <div class="mainvisual">
                <img :src="main.mainvisual">
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
                    mainvisual: require('@/assets/img/portfolio01_main.png'),
                    title: 'Monimo',
                    description: 
                        '삼성생명, 삼성화재, 삼성카드, 삼성증권에서 만든 금융 서비스 앱<br> 여러 팀과 협력하여 보안 시스템 아래에서 개발<br> 컴포넌트와 1400여개 페이지 관리, 카드 메인 페이지 담당',
                },
                desc: {
                    duration: '2024.07-2024.10',
                    consultant: 'Samsung',
                    team: 'lisn',
                    work: 'development',
                    platform: 'vue2/storybook/scss',
                },
                link: {
                    href: 'https://www.monimo.com/w/main/WPFMHP0101M0',
                    text: 'Go to Page',
                },
                pagination: {
                    prevLink: '/portfolio/08_RNJOB',
                    prevText: 'RNJOB 앱',
                    nextLink: '/portfolio/02_416_Online_Memorial',
                    nextText: '4·16 온라인 기억센터',
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/layout/portfolio_detail.scss';
</style>