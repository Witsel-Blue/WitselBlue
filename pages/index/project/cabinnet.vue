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
                <div class="device_pc" data-aos="fade-up">
                    <img src="@/assets/img/device-laptop.png" class="device">
                    <div class="img-wrap">
                        <img :src="main.mainvisual" class="img">
                    </div>
                </div>
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
                title: 'Cabin.net',
                main: {
                    // mainvisual: require('@/assets/img/project06_main.png'),
                    id: '06',
                    title: 'Cabin.net',
                    description: 
                        '나의 취향과 상품의 스토리가 만나는 콘텐츠 플랫폼으로,<br> 세상을 바꾸는 실험과 시도가 담긴 사회적경제의 상품과 브랜드를 소개<br> 네이버 블로그 형식으로 운영에서 쉽게 글을 작성할 수 있도록 개발',
                },
                desc: {
                    duration: '2021.05-2021.07',
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
                    prevLink: '/project/DCDCenter',
                    prevText: '전문무용수지원센터',
                    nextLink: '/project/KACE',
                    nextText: 'KACE',
                    // nextImg: require('@/assets/img/project07_main.png'),
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/layout/project_detail.scss';
</style>