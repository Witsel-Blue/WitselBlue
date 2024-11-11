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
                title: 'Cabin.net',
                main: {
                    // mainvisual: require('@/assets/img/portfolio06_main.png'),
                    id: '06',
                    title: 'Cabin.net',
                    description: 
                        '나의 취향과 상품의 스토리가 만나는 콘텐츠 플랫폼으로,<br> 세상을 바꾸는 실험과 시도가 담긴 사회적경제의 상품과 브랜드를 소개<br> 네이버 블로그 형식으로 운영에서 쉽게 글을 작성할 수 있도록 개발',
                },
                desc: {
                    duration: '2022.05-2022.06',
                    consultant: '서울 사회적경제 포털',
                    team: 'SKNK',
                    work: 'frontend',
                    platform: 'drupal9/css/jquery',
                },
                link: {
                    href: '',
                    text: 'Go to Page',
                },
                pagination: {
                    prevLink: '/portfolio/05_DCDCenter',
                    prevText: '전문무용수지원센터',
                    nextLink: '/portfolio/07_KACE',
                    nextText: 'KACE',
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/layout/portfolio_detail.scss';
</style>