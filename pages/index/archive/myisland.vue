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
                            class="mouse-hover1"
                            target="_blank"
                            :href=link.href>
                            <TextShifting :text="main.title"></TextShifting>
                        </a>
                    </div>
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
                title: 'My Island',
                work: 'three.js',
                main: {
                    // mainvisual: require('@/assets/img/archive03_main.png'),
                    id: '03',
                    title: 'My Island',
                    description: 
                        '작은 섬을<br> 3D로 돌려 관찰할 수 있습니다.',
                },
                link: {
                    href: '',
                    text: 'View Code',
                },
                pagination: {
                    prevLink: '/archive/witchpot',
                    prevText: 'WitchPot',
                    nextLink: '/archive/kiki',
                    nextText: 'Kiki',
                    nextWork: 'p5.js',
                    nextImg: require('@/assets/img/archive01_main.png'),
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
    @import '@/assets/scss/layout/page_detail.scss';

    #detail_footer::v-deep {
        .res-box-wrap {
            img {
                transform: scale(1.2);
            }
        }
    }
</style>