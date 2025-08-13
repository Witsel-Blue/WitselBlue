<template>
    <div id="project_detail">
        <CursorCustom />
        <PageTransition :title="title" />
        <div class="contents">
            <section class="main">
                <div class="inner">
                    <div
                        class="mainvisual"
                        data-aos="fade-up"
                    >
                        <ParallaxImg :src="main.mainvisual" />
                    </div>
                    <div
                        class="title"
                        data-aos="fade-up"
                    >
                        <p>{{ desc.work }}</p>
                        <a
                            class="mouse-hover1"
                            target="_blank"
                            :href="link.href"
                        >
                            <TextShifting :text="main.title" />
                        </a>
                    </div>
                </div>
            </section>
            <section
                class="device-bg"
                data-aos="fade-up"
            >
                <div class="inner">
                    <div
                        class="device_pc"
                        data-aos="fade-up"
                    >
                        <img
                            src="@/assets/img/device-laptop.png"
                            class="device"
                        >
                        <div class="img-wrap">
                            <!-- <img :src="main.mainvisual" class="img"> -->
                        </div>
                    </div>
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
                        v-if="main.description"
                        data-aos="fade-up"
                        class="txt-c" 
                        v-html="main.description"
                    />
                    <ButtonRound
                        v-if="link.href"
                        data-aos="fade-up"
                        class="mt-32 txt-c"
                        :link="link"
                    />
                </div>
            </section>
        </div>
        <Pagination 
            :pagination="pagination"
        />
        <DetailFooter 
            :pagination="pagination"
        />
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
            title: 'Cabinnet',
            main: {
                mainvisual: require('@/assets/img/project06_main.png'),
                id: '06',
                title: 'Cabinnet',
                description: 
                        '나의 취향과 상품의 스토리가<br class="mb"> 만나는 콘텐츠 플랫폼으로,<br> 세상을 바꾸는 실험과 시도가 담긴<br class="mb"> 사회적경제의 상품과 브랜드를 소개<br> 네이버 블로그 형식으로 운영에서 쉽게<br class="mb"> 글을 작성할 수 있도록 개발',
            },
            desc: {
                duration: '2021.05-2021.07',
                consultant: '서울 사회적경제 포털',
                team: 'SKNK',
                work: 'frontend',
                platform: 'drupal9 / css / jquery',
            },
            link: {
                href: '',
                text: 'Visit Site',
                target: '_blank',
            },
            pagination: {
                href: '/project',
                text: 'view all project',
                prevLink: '/project/DCDCenter',
                prevText: 'DCDCenter',
                nextLink: '/project/KACE',
                nextText: 'KACE',
                nextWork: 'frontend',
                nextImg: require('@/assets/img/project07_pagination.png'),
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/layout/page_detail.scss';
</style>