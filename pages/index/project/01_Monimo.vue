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
                title: 'Monimo',
                main: {
                    mainvisual: require('@/assets/img/project01_main.png'),
                    id: '01',
                    title: 'Monimo',
                    description: 
                        '삼성생명, 삼성화재, 삼성카드, 삼성증권에서 만든 금융 서비스 앱<br> 여러 팀과 협력하여 보안 시스템 아래에서 개발<br> 컴포넌트와 1400여개 페이지 관리, 카드 메인 페이지 담당',
                },
                desc: {
                    duration: '2024.07-2024.10',
                    consultant: 'Samsung',
                    team: 'lisn',
                    work: 'development',
                    platform: 'vue2 / storybook / scss',
                },
                link: {
                    href: 'https://www.monimo.com/w/main/WPFMHP0101M0',
                    text: 'Go to Page',
                },
                pagination: {
                    prevLink: '/project/08_RNJOB',
                    prevText: 'RNJOB 앱',
                    nextLink: '/project/02_416_Online_Memorial',
                    nextText: '4·16 온라인 기억센터',
                    nextImg: require('@/assets/img/project02_main.png'),
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