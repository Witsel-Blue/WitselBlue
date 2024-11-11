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
                <ul class="device_mb">
                    <li>
                        <img src="@/assets/img/device-iphone15.png" class="device">
                        <img src="@/assets/img/portfolio08_mb01.png" class="img">
                    </li>
                    <li>
                        <img src="@/assets/img/device-iphone15.png" class="device">
                        <img src="@/assets/img/portfolio08_mb02.png" class="img">
                    </li>
                    <li>
                        <img src="@/assets/img/device-iphone15.png" class="device">
                        <img src="@/assets/img/portfolio08_mb03.png" class="img">
                    </li>
                </ul>
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
                title: 'RNJOB App',
                main: {
                    mainvisual: require('@/assets/img/portfolio08_main.png'),
                    id: '08',
                    title: 'RNJOB 앱',
                    link: 'https://rnjob.or.kr/',
                    description: 
                        '간호 커리어 종합 지원 센터, RNJOB의 앱 퍼블리싱에 참여',
                },
                desc: {
                    duration: '2022.07',
                    consultant: '간호인력취업교육센터',
                    team: 'SKNK',
                    work: 'publishing',
                    platform: 'vue/html/css/jquery',
                },
                link: {
                    href: 'https://rnjob.or.kr/',
                    text: 'Go to Page',
                },
                pagination: {
                    prevLink: '/portfolio/07_KACE',
                    prevText: 'KACE',
                    nextLink: '/portfolio/01_Monimo',
                    nextText: '삼성카드 모니모 앱',
                }
            }
        },
        mounted() {
            this.getMbHeight();
            window.addEventListener('resize', this.getMbHeight);
        },
        methods: {
            getMbHeight() {
                var mb = document.querySelector('.device_mb .device');
                var mbH = mb.clientHeight;
                var mbImg = document.querySelectorAll('.device_mb .img');
                
                for (var i = 0; i < mbImg.length; i++) {
                    var c = mbImg[i];
                    c.style.height = mbH + 'px';
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/layout/portfolio_detail.scss';
</style>