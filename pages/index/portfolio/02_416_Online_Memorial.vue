<template>
    <div id="portfolio_detail">
        <section class="main">
            <div class="mainvisual">
                <img 
                    :src="main.mainvisual"
                    v-if="main.mainvisual">
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
        <!-- <section>
            <div class="pc">
                <img 
                    :src="img.pc"
                    v-if="img.pc">
            </div>
            <div class="mb">
                <img 
                    :src="img.mb"
                    v-if="img.mb">
            </div>
        </section> -->
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
                    mainvisual: require('@/assets/img/portfolio02_main.png'),
                    title: '4·16 온라인 기억센터',
                    description: 
                        '세월호참사 10주기를 기념하여 메세지를 남길 수 있는 공간<br> Scrollmagic, Tweenmax 등의 라이브러리를 이용하여 메인비주얼 구현',
                },
                desc: {
                    duration: '2022.04',
                    consultant: '4·16 재단',
                    team: 'SKNK',
                    work: 'publishing',
                    platform: 'html/css/jquery',
                },
                img: {
                    pc: require('@/assets/img/portfolio02_pc.png'),
                    mb: require('@/assets/img/portfolio02_mb.png'),
                },
                link: {
                    href: 'https://416foundation.org/%EC%98%A8%EB%9D%BC%EC%9D%B8-%EA%B8%B0%EC%96%B5-%EA%B3%B5%EA%B0%84/',
                    text: 'Go to Page',
                },
                pagination: {
                    prevLink: '/portfolio/01_Monimo',
                    prevText: '삼성카드 모니모 앱',
                    nextLink: '/portfolio/03_DCAMP',
                    nextText: 'D.CAMP',
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/layout/portfolio_detail.scss';
</style>