<template>
    <div id="project_detail">
        <PageTransition :title="title"></PageTransition>
        <div class="contents">
            <section class="main">
                <div class="inner">
                    <div class="mainvisual" data-aos="fade-up">
                        <ParallaxImg :src="main.mainvisual"></ParallaxImg>
                    </div>
                    <div class="title" data-aos="fade-up">
                        <p>{{ work }}</p>
                        <a
                            target="_blank"
                            :href=link.href>
                            <TextShifting :text="main.title"></TextShifting>
                        </a>
                    </div>
                </div>
            </section>
            <section>
                <div class="inner">
                    <iframe src="https://editor.p5js.org/witselblue/full/qY2ZOCn7V"></iframe>
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
    import PageTransition from '@/layouts/PageTransition.vue';
    import ParallaxImg from '@/components/ParallaxImg.vue';
    import ButtonRound from '@/components/ButtonRound.vue';
    import TextShifting from '@/components/TextShifting.vue';
    import Pagination from '@/components/Pagination.vue';
    import DetailFooter from '@/layouts/DetailFooter.vue';
    
    export default {
        components: {
            PageTransition,
            ParallaxImg,
            ButtonRound,
            TextShifting,
            Pagination,
            DetailFooter,
        },
        data() {
            return {
                title: 'Kiki',
                work: 'p5.js',
                main: {
                    mainvisual: require('@/assets/img/archive01_main.png'),
                    id: '01',
                    title: 'Kiki',
                    description: 
                        '지브리 애니메이션 캐릭터인 키키의 얼굴에<br> 나비가 가까이 가면 표정이 변화합니다.',
                },
                link: {
                    href: 'https://editor.p5js.org/witselblue/full/qY2ZOCn7V',
                    text: 'View Code',
                },
                pagination: {
                    prevLink: '/archive/myisland',
                    prevText: 'MyIsland',
                    nextLink: '/archive/zizi',
                    nextText: 'Zizi',
                    nextImg: require('@/assets/img/archive02_main.png'),
                },
            }
        },
        mounted() {
 
        },
        methods: {

        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/layout/project_detail.scss';

    #detail_footer::v-deep {
        .res-box-wrap {
            img {
                transform: scale(1.2);
            }
        }
    }
</style>