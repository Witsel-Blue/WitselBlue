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
                <ul class="device_mb">
                    <li data-aos="fade-up">
                        <img src="@/assets/img/device-iphone15.png" class="device">
                        <img src="@/assets/img/project01_mb01.png" class="img">
                    </li>
                    <li data-aos="fade-up">
                        <img src="@/assets/img/device-iphone15.png" class="device">
                        <img src="@/assets/img/project01_mb02.png" class="img">
                    </li>
                    <li data-aos="fade-up">
                        <img src="@/assets/img/device-iphone15.png" class="device">
                        <img src="@/assets/img/project01_mb03.png" class="img">
                    </li>
                </ul>
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
                title: 'RNJOB App',
                main: {
                    mainvisual: require('@/assets/img/project08_main.png'),
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
                    prevLink: '/project/07_KACE',
                    prevText: 'KACE',
                    nextLink: '/project/01_Monimo',
                    nextText: '삼성카드 모니모 앱',
                    nextImg: require('@/assets/img/project01_main.png'),
                }
            }
        },
        mounted() {
            process.nextTick(() => {
                process.nextTick(() => {
                    this.getMbHeight();
                });
            });
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
    @import '@/assets/scss/layout/project_detail.scss';
</style>