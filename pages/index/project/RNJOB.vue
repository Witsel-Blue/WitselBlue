<template>
    <div id="project_detail">
        <CursorCustom />
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
                            class="mouse-hover1"
                            target="_blank"
                            :href=link.href>
                            <TextShifting :text="main.title"></TextShifting>
                        </a>
                    </div>
                </div>
            </section>
            <section class="device-bg" data-aos="fade-up">
                <div class="inner">
                    <ul class="device_mb">
                        <li data-aos="fade-up">
                            <img src="@/assets/img/device-iphone15.png" class="device">
                            <img src="@/assets/img/project08_mb01.png" class="img">
                        </li>
                        <li data-aos="fade-up">
                            <img src="@/assets/img/device-iphone15.png" class="device">
                            <img src="@/assets/img/project08_mb02.png" class="img">
                        </li>
                        <li data-aos="fade-up">
                            <img src="@/assets/img/device-iphone15.png" class="device">
                            <img src="@/assets/img/project08_mb03.png" class="img">
                        </li>
                    </ul>
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
        <DetailFooter 
            :pagination="pagination" />
    </div>
</template>

<script>
    import CursorCustom from '@/components/CursorCustom.vue';
    import PageTransition from '@/layouts/PageTransition.vue';
    import ParallaxImg from '@/components/ParallaxImg.vue';
    import ButtonRound from '@/components/ButtonRound.vue';
    import TextShifting from '@/components/TextShifting.vue';
    import Pagination from '@/components/Pagination.vue';
    import DetailFooter from '@/layouts/DetailFooter.vue';
    
    export default {
        components: {
            CursorCustom,
            PageTransition,
            ParallaxImg,
            ButtonRound,
            TextShifting,
            Pagination,
            DetailFooter,
        },
        data() {
            return {
                title: 'RNJOB App',
                main: {
                    mainvisual: require('@/assets/img/project08_main.png'),
                    id: '08',
                    title: 'RNJOB App',
                    link: 'https://rnjob.or.kr/',
                    description: 
                        '간호 커리어 종합 지원 센터,<br> RNJOB의 앱 퍼블리싱에 참여',
                },
                desc: {
                    duration: '2021.07',
                    consultant: '간호인력취업교육센터',
                    team: 'SKNK',
                    work: 'publishing',
                    platform: 'vue / html / css / jquery',
                },
                link: {
                    href: 'https://rnjob.or.kr/',
                    text: 'Visit Site',
                },
                pagination: {
                    prevLink: '/project/KACE',
                    prevText: 'KACE',
                    nextLink: '/project/monimo',
                    nextText: 'Monimo',
                    nextWork: 'development',
                    nextImg: require('@/assets/img/project01_main.png'),
                }
            }
        },
        mounted() {
            setTimeout(() => {
                this.getMbHeight();
            }, '1000');
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
    @import '@/assets/scss/layout/page_detail.scss';
</style>